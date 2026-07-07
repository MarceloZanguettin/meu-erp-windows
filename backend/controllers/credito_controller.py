from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Credito
from schemas import credito

router = APIRouter(prefix="/creditos", tags=["Créditos de Cliente (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Credito:
    obj = db.query(Credito).filter(Credito.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Crédito (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[credito.CreditoOut])
def listar_creditos(
    cod_empresa: Optional[int] = Query(None),
    cod_cliente: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Credito)
    if cod_empresa:
        q = q.filter(Credito.cod_empresa == cod_empresa)
    if cod_cliente:
        q = q.filter(Credito.cod_cliente == cod_cliente)
    if busca:
        termo = f"%{busca}%"
        filtros = [
            Credito.obs.ilike(termo),
            Credito.cod_historico.ilike(termo),
        ]
        if busca.isdigit():
            valor = int(busca)
            filtros += [
                Credito.codigo == valor,
                Credito.cod_empresa == valor,
                Credito.cod_cliente == valor,
                Credito.cod_conta == valor,
                Credito.cod_saida == valor,
            ]
        q = q.filter(or_(*filtros))
    return q.order_by(Credito.id.desc()).all()


@router.get("/{id}", response_model=credito.CreditoOut)
def buscar_credito(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=credito.CreditoOut)
def criar_credito(dados: credito.CreditoCreate, db: Session = Depends(get_db)):
    obj = Credito(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=credito.CreditoOut)
def atualizar_credito(id: int, dados: credito.CreditoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_credito(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Crédito (GENUS) deletado com sucesso"}

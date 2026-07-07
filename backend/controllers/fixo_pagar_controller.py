from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import FixoPagar
from schemas import fixo_pagar

router = APIRouter(prefix="/fixos-pagar", tags=["Fixos a Pagar"])


def _get_ou_404(db: Session, id: int) -> FixoPagar:
    obj = db.query(FixoPagar).filter(FixoPagar.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Fixo a pagar não encontrado")
    return obj


@router.get("", response_model=list[fixo_pagar.FixoPagarOut])
def listar_fixos_pagar(
    cod_empresa: Optional[int] = Query(None),
    cod_cadastro: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(FixoPagar)
    if cod_empresa:
        q = q.filter(FixoPagar.cod_empresa == cod_empresa)
    if cod_cadastro:
        q = q.filter(FixoPagar.cod_cadastro == cod_cadastro)
    if busca:
        termo = f"%{busca}%"
        filtros = [FixoPagar.obs.ilike(termo), FixoPagar.cod_historico.ilike(termo)]
        if busca.isdigit():
            valor = int(busca)
            filtros += [
                FixoPagar.codigo == valor,
                FixoPagar.cod_cadastro == valor,
                FixoPagar.cod_empresa == valor,
            ]
        q = q.filter(or_(*filtros))
    return q.order_by(FixoPagar.id.desc()).all()


@router.get("/{id}", response_model=fixo_pagar.FixoPagarOut)
def buscar_fixo_pagar(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=fixo_pagar.FixoPagarOut)
def criar_fixo_pagar(dados: fixo_pagar.FixoPagarCreate, db: Session = Depends(get_db)):
    obj = FixoPagar(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=fixo_pagar.FixoPagarOut)
def atualizar_fixo_pagar(id: int, dados: fixo_pagar.FixoPagarUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_fixo_pagar(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Fixo a pagar deletado com sucesso"}

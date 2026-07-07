from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Movto
from schemas import movto

router = APIRouter(prefix="/movtos", tags=["Movimentos de Crédito (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Movto:
    obj = db.query(Movto).filter(Movto.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Movimento (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[movto.MovtoOut])
def listar_movtos(
    cod_empresa: Optional[int] = Query(None),
    cod_cadastro: Optional[int] = Query(None),
    tipo: Optional[str] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Movto)
    if cod_empresa:
        q = q.filter(Movto.cod_empresa == cod_empresa)
    if cod_cadastro:
        q = q.filter(Movto.cod_cadastro == cod_cadastro)
    if tipo:
        q = q.filter(Movto.tipo == tipo)
    if busca:
        termo = f"%{busca}%"
        filtros = [
            Movto.obs.ilike(termo),
            Movto.tipo.ilike(termo),
        ]
        if busca.isdigit():
            valor = int(busca)
            filtros += [
                Movto.codigo == valor,
                Movto.cod_empresa == valor,
                Movto.cod_cadastro == valor,
                Movto.cod_cadastro_credito == valor,
                Movto.cod_funcionario == valor,
                Movto.cod_saida == valor,
            ]
        q = q.filter(or_(*filtros))
    return q.order_by(Movto.id.desc()).all()


@router.get("/{id}", response_model=movto.MovtoOut)
def buscar_movto(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=movto.MovtoOut)
def criar_movto(dados: movto.MovtoCreate, db: Session = Depends(get_db)):
    obj = Movto(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=movto.MovtoOut)
def atualizar_movto(id: int, dados: movto.MovtoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_movto(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Movimento (GENUS) deletado com sucesso"}

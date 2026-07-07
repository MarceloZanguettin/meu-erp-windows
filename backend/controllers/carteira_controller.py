from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Carteira
from schemas import carteira

router = APIRouter(prefix="/carteiras", tags=["Carteiras de Cobrança (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Carteira:
    obj = db.query(Carteira).filter(Carteira.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Carteira (GENUS) não encontrada")
    return obj


@router.get("", response_model=list[carteira.CarteiraOut])
def listar_carteiras(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Carteira)
    if busca:
        termo = f"%{busca}%"
        filtros = [
            Carteira.descricao.ilike(termo),
            Carteira.descontada.ilike(termo),
        ]
        if busca.isdigit():
            valor = int(busca)
            filtros += [
                Carteira.codigo == valor,
                Carteira.float_pagto == valor,
            ]
        q = q.filter(or_(*filtros))
    return q.order_by(Carteira.id.desc()).all()


@router.get("/{id}", response_model=carteira.CarteiraOut)
def buscar_carteira(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=carteira.CarteiraOut)
def criar_carteira(dados: carteira.CarteiraCreate, db: Session = Depends(get_db)):
    obj = Carteira(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=carteira.CarteiraOut)
def atualizar_carteira(id: int, dados: carteira.CarteiraUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_carteira(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Carteira (GENUS) deletada com sucesso"}

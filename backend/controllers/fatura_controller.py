from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Fatura
from schemas import fatura

router = APIRouter(prefix="/faturas", tags=["Faturas"])


def _get_ou_404(db: Session, id: int) -> Fatura:
    obj = db.query(Fatura).filter(Fatura.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Fatura não encontrada")
    return obj


@router.get("", response_model=list[fatura.FaturaOut])
def listar_faturas(
    cod_empresa: Optional[int] = Query(None),
    cod_cadastro: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Fatura)
    if cod_empresa:
        q = q.filter(Fatura.cod_empresa == cod_empresa)
    if cod_cadastro:
        q = q.filter(Fatura.cod_cadastro == cod_cadastro)
    if busca:
        termo = f"%{busca}%"
        filtros = [Fatura.cod_cond_pagto.ilike(termo)]
        if busca.isdigit():
            valor = int(busca)
            filtros += [
                Fatura.codigo == valor,
                Fatura.cod_cadastro == valor,
                Fatura.cod_empresa == valor,
                Fatura.cod_carteira == valor,
            ]
        q = q.filter(or_(*filtros))
    return q.order_by(Fatura.id.desc()).all()


@router.get("/{id}", response_model=fatura.FaturaOut)
def buscar_fatura(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=fatura.FaturaOut)
def criar_fatura(dados: fatura.FaturaCreate, db: Session = Depends(get_db)):
    obj = Fatura(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=fatura.FaturaOut)
def atualizar_fatura(id: int, dados: fatura.FaturaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_fatura(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Fatura deletada com sucesso"}

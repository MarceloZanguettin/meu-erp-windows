from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import FaturaPagar
from schemas import fatura_pagar

router = APIRouter(prefix="/faturas-pagar", tags=["Faturas a Pagar"])


def _get_ou_404(db: Session, id: int) -> FaturaPagar:
    obj = db.query(FaturaPagar).filter(FaturaPagar.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Fatura a pagar não encontrada")
    return obj


@router.get("", response_model=list[fatura_pagar.FaturaPagarOut])
def listar_faturas_pagar(
    cod_empresa: Optional[int] = Query(None),
    cod_cadastro: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(FaturaPagar)
    if cod_empresa:
        q = q.filter(FaturaPagar.cod_empresa == cod_empresa)
    if cod_cadastro:
        q = q.filter(FaturaPagar.cod_cadastro == cod_cadastro)
    if busca:
        termo = f"%{busca}%"
        filtros = [
            FaturaPagar.cod_cond_pagto.ilike(termo),
            FaturaPagar.obs.ilike(termo),
        ]
        if busca.isdigit():
            valor = int(busca)
            filtros += [
                FaturaPagar.codigo == valor,
                FaturaPagar.doc == valor,
                FaturaPagar.cod_cadastro == valor,
                FaturaPagar.cod_empresa == valor,
                FaturaPagar.cod_carteira == valor,
            ]
        q = q.filter(or_(*filtros))
    return q.order_by(FaturaPagar.id.desc()).all()


@router.get("/{id}", response_model=fatura_pagar.FaturaPagarOut)
def buscar_fatura_pagar(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=fatura_pagar.FaturaPagarOut)
def criar_fatura_pagar(dados: fatura_pagar.FaturaPagarCreate, db: Session = Depends(get_db)):
    obj = FaturaPagar(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=fatura_pagar.FaturaPagarOut)
def atualizar_fatura_pagar(id: int, dados: fatura_pagar.FaturaPagarUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_fatura_pagar(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Fatura a pagar deletada com sucesso"}

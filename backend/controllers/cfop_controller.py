from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Cfop
from schemas import cfop as cfop_schema

# Tabela mestre de Código Fiscal de Operações e Prestações (CFOP) do GENUS
# (GENUS.CFOP) — referenciada por cod_cfop/cod_cfop2 em Entrada, ItemEntrada,
# PedidoVenda, ItemPedidoLan, Saida, RegraEstado etc.; ver docstring do model
# `Cfop` em models/tabelas.py.
router = APIRouter(prefix="/cfops", tags=["CFOP (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Cfop:
    obj = db.query(Cfop).filter(Cfop.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="CFOP não encontrado")
    return obj


@router.get("", response_model=list[cfop_schema.CfopOut])
def listar_cfops(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Cfop)
    if busca:
        q = q.filter(
            (Cfop.codigo.ilike(f"%{busca}%"))
            | (Cfop.descricao.ilike(f"%{busca}%"))
        )
    return q.order_by(Cfop.id).all()


@router.get("/{id}", response_model=cfop_schema.CfopOut)
def buscar_cfop(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cfop_schema.CfopOut)
def criar_cfop(dados: cfop_schema.CfopCreate, db: Session = Depends(get_db)):
    obj = Cfop(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cfop_schema.CfopOut)
def atualizar_cfop(id: int, dados: cfop_schema.CfopUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cfop(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "CFOP deletado com sucesso"}

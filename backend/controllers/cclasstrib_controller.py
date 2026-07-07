from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import CClassTrib
from schemas import cclasstrib as cclasstrib_schema

# Tabela mestre de Código de Classificação Tributária (CClassTrib) da
# Reforma Tributária (IBS/CBS) do GENUS (GENUS.CCLASSTRIB) — referenciada
# por reforma_cclasstrib/reforma_cclasstribreg/reforma_cclasstribis_is em
# Produto, Classificacao e demais tabelas; ver docstring do model
# `CClassTrib` em models/tabelas.py.
router = APIRouter(prefix="/cclasstribs", tags=["CClassTrib (GENUS)"])


def _get_ou_404(db: Session, id: int) -> CClassTrib:
    obj = db.query(CClassTrib).filter(CClassTrib.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="CClassTrib não encontrado")
    return obj


@router.get("", response_model=list[cclasstrib_schema.CClassTribOut])
def listar_cclasstribs(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(CClassTrib)
    if busca:
        q = q.filter(
            (CClassTrib.cclasstrib.ilike(f"%{busca}%"))
            | (CClassTrib.nome.ilike(f"%{busca}%"))
        )
    return q.order_by(CClassTrib.id).all()


@router.get("/{id}", response_model=cclasstrib_schema.CClassTribOut)
def buscar_cclasstrib(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cclasstrib_schema.CClassTribOut)
def criar_cclasstrib(dados: cclasstrib_schema.CClassTribCreate, db: Session = Depends(get_db)):
    obj = CClassTrib(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cclasstrib_schema.CClassTribOut)
def atualizar_cclasstrib(id: int, dados: cclasstrib_schema.CClassTribUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cclasstrib(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "CClassTrib deletado com sucesso"}

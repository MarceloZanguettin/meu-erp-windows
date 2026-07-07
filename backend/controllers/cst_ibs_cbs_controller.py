from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import CstIbsCbs
from schemas import cst_ibs_cbs as cst_ibs_cbs_schema

# Tabela mestre de Código de Situação Tributária do IBS/CBS (CstIbsCbs) da
# Reforma Tributária do GENUS (GENUS.CST_IBS_CBS) — referenciada por
# reforma_cst_ibscbs em ItemSaida, ItemEntrada e demais tabelas; ver
# docstring do model `CstIbsCbs` em models/tabelas.py.
router = APIRouter(prefix="/cst-ibs-cbs", tags=["CST IBS/CBS (GENUS)"])


def _get_ou_404(db: Session, id: int) -> CstIbsCbs:
    obj = db.query(CstIbsCbs).filter(CstIbsCbs.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="CST IBS/CBS não encontrado")
    return obj


@router.get("", response_model=list[cst_ibs_cbs_schema.CstIbsCbsOut])
def listar_cst_ibs_cbs(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(CstIbsCbs)
    if busca:
        q = q.filter(
            (CstIbsCbs.cst.ilike(f"%{busca}%"))
            | (CstIbsCbs.descricao.ilike(f"%{busca}%"))
        )
    return q.order_by(CstIbsCbs.id).all()


@router.get("/{id}", response_model=cst_ibs_cbs_schema.CstIbsCbsOut)
def buscar_cst_ibs_cbs(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cst_ibs_cbs_schema.CstIbsCbsOut)
def criar_cst_ibs_cbs(dados: cst_ibs_cbs_schema.CstIbsCbsCreate, db: Session = Depends(get_db)):
    obj = CstIbsCbs(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cst_ibs_cbs_schema.CstIbsCbsOut)
def atualizar_cst_ibs_cbs(id: int, dados: cst_ibs_cbs_schema.CstIbsCbsUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cst_ibs_cbs(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "CST IBS/CBS deletado com sucesso"}

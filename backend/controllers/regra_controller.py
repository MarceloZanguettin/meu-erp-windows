from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Regra
from schemas import regra

router = APIRouter(prefix="/regras", tags=["Regras (mestre)"])


def _get_ou_404(db: Session, id: int) -> Regra:
    obj = db.query(Regra).filter(Regra.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Regra não encontrada")
    return obj


@router.get("", response_model=list[regra.RegraOut])
def listar_regras(
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Regra)
    if cod_empresa is not None:
        q = q.filter(Regra.cod_empresa == cod_empresa)
    if busca:
        q = q.filter(
            (Regra.descricao.ilike(f"%{busca}%"))
            | (Regra.tipo_nf.ilike(f"%{busca}%"))
            | (Regra.tipo_cliente.ilike(f"%{busca}%"))
        )
    return q.order_by(Regra.id).all()


@router.get("/{id}", response_model=regra.RegraOut)
def buscar_regra(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=regra.RegraOut)
def criar_regra(dados: regra.RegraCreate, db: Session = Depends(get_db)):
    obj = Regra(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=regra.RegraOut)
def atualizar_regra(id: int, dados: regra.RegraUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_regra(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Regra deletada com sucesso"}

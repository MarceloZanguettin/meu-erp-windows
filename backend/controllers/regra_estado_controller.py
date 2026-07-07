from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import RegraEstado
from schemas import regra_estado

router = APIRouter(prefix="/regras-estado", tags=["Regras Fiscais por Estado"])


def _get_ou_404(db: Session, id: int) -> RegraEstado:
    obj = db.query(RegraEstado).filter(RegraEstado.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Regra fiscal por estado não encontrada")
    return obj


@router.get("", response_model=list[regra_estado.RegraEstadoOut])
def listar_regras_estado(
    cod_regras: Optional[int] = Query(None),
    cod_estado: Optional[str] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(RegraEstado)
    if cod_regras is not None:
        q = q.filter(RegraEstado.cod_regras == cod_regras)
    if cod_estado:
        q = q.filter(RegraEstado.cod_estado == cod_estado)
    if busca:
        q = q.filter(
            (RegraEstado.cod_estado.ilike(f"%{busca}%"))
            | (RegraEstado.cod_cfop.ilike(f"%{busca}%"))
            | (RegraEstado.cst.ilike(f"%{busca}%"))
            | (RegraEstado.csosn.ilike(f"%{busca}%"))
        )
    return q.order_by(RegraEstado.id).all()


@router.get("/{id}", response_model=regra_estado.RegraEstadoOut)
def buscar_regra_estado(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=regra_estado.RegraEstadoOut)
def criar_regra_estado(dados: regra_estado.RegraEstadoCreate, db: Session = Depends(get_db)):
    obj = RegraEstado(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=regra_estado.RegraEstadoOut)
def atualizar_regra_estado(id: int, dados: regra_estado.RegraEstadoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_regra_estado(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Regra fiscal por estado deletada com sucesso"}

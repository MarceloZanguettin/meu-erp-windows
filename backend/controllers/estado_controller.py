from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Estado
from schemas import estado as estado_schema

# Tabela mestre de Estados/UF do GENUS (GENUS.ESTADO) — módulo Sistema/
# Config, referenciada como código bruto por Cidade.cod_estado/
# RegraEstado.cod_estado/Iva.estado; ver docstring do model `Estado` em
# models/tabelas.py.
router = APIRouter(prefix="/estados", tags=["Estados (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Estado:
    obj = db.query(Estado).filter(Estado.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Estado não encontrado")
    return obj


@router.get("", response_model=list[estado_schema.EstadoOut])
def listar_estados(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Estado)
    if busca:
        condicoes = [
            Estado.nome.ilike(f"%{busca}%"),
            Estado.sigla.ilike(f"%{busca}%"),
        ]
        q = q.filter(or_(*condicoes))
    return q.order_by(Estado.id).all()


@router.get("/{id}", response_model=estado_schema.EstadoOut)
def buscar_estado(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=estado_schema.EstadoOut)
def criar_estado(dados: estado_schema.EstadoCreate, db: Session = Depends(get_db)):
    obj = Estado(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=estado_schema.EstadoOut)
def atualizar_estado(id: int, dados: estado_schema.EstadoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_estado(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Estado deletado com sucesso"}

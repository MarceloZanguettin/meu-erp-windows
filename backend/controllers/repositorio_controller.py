from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Repositorio
from schemas import repositorio as repositorio_schema

# Repositório de objetos/scripts do sistema do GENUS (GENUS.REPOSITORIO) —
# módulo Sistema/Config; ver docstring do model `Repositorio` em
# models/tabelas.py.
router = APIRouter(prefix="/repositorios", tags=["Repositório (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Repositorio:
    obj = db.query(Repositorio).filter(Repositorio.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Registro de repositório não encontrado")
    return obj


@router.get("", response_model=list[repositorio_schema.RepositorioOut])
def listar_repositorios(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Repositorio)
    if busca:
        condicoes = [
            Repositorio.nome.ilike(f"%{busca}%"),
        ]
        q = q.filter(or_(*condicoes))
    return q.order_by(Repositorio.id).all()


@router.get("/{id}", response_model=repositorio_schema.RepositorioOut)
def buscar_repositorio(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=repositorio_schema.RepositorioOut)
def criar_repositorio(dados: repositorio_schema.RepositorioCreate, db: Session = Depends(get_db)):
    obj = Repositorio(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=repositorio_schema.RepositorioOut)
def atualizar_repositorio(id: int, dados: repositorio_schema.RepositorioUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_repositorio(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro de repositório deletado com sucesso"}

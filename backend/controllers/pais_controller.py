from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Pais
from schemas import pais as pais_schema

# Tabela mestre de Países do GENUS (GENUS.PAIS) — módulo Sistema/Config,
# referenciada apenas por Cidade.cod_pais (código bruto de país); ver
# docstring do model `Pais` em models/tabelas.py.
router = APIRouter(prefix="/paises", tags=["Países (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Pais:
    obj = db.query(Pais).filter(Pais.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="País não encontrado")
    return obj


@router.get("", response_model=list[pais_schema.PaisOut])
def listar_paises(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Pais)
    if busca:
        condicoes = [
            Pais.nome.ilike(f"%{busca}%"),
        ]
        if busca.isdigit():
            condicoes.append(Pais.codigo == int(busca))
        q = q.filter(or_(*condicoes))
    return q.order_by(Pais.id).all()


@router.get("/{id}", response_model=pais_schema.PaisOut)
def buscar_pais(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=pais_schema.PaisOut)
def criar_pais(dados: pais_schema.PaisCreate, db: Session = Depends(get_db)):
    obj = Pais(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=pais_schema.PaisOut)
def atualizar_pais(id: int, dados: pais_schema.PaisUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_pais(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "País deletado com sucesso"}

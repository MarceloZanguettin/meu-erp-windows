from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Cargo
from schemas import cargo as cargo_schema

# Tabela mestre de Cargos do GENUS (GENUS.CARGO) — módulo RH/Folha,
# referenciada apenas por Funcionario.cod_cargo (código bruto); ver
# docstring do model `Cargo` em models/tabelas.py.
router = APIRouter(prefix="/cargos", tags=["Cargos (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Cargo:
    obj = db.query(Cargo).filter(Cargo.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Cargo não encontrado")
    return obj


@router.get("", response_model=list[cargo_schema.CargoOut])
def listar_cargos(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Cargo)
    if busca:
        condicoes = [
            Cargo.descricao.ilike(f"%{busca}%"),
        ]
        if busca.isdigit():
            condicoes.append(Cargo.codigo == int(busca))
        q = q.filter(or_(*condicoes))
    return q.order_by(Cargo.id).all()


@router.get("/{id}", response_model=cargo_schema.CargoOut)
def buscar_cargo(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cargo_schema.CargoOut)
def criar_cargo(dados: cargo_schema.CargoCreate, db: Session = Depends(get_db)):
    obj = Cargo(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cargo_schema.CargoOut)
def atualizar_cargo(id: int, dados: cargo_schema.CargoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cargo(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Cargo deletado com sucesso"}

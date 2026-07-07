from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Padrao
from schemas import padrao as padrao_schema

# Tabela mestre de Padrões Contábeis do GENUS (GENUS.PADRAO) — módulo
# Sistema/Config, históricos/contas contábeis padrão usados pelas rotinas
# automáticas de lançamento (caixa padrão, cartão a receber, descontos,
# acréscimos, depreciação, partida dobrada); ver docstring do model `Padrao`
# em models/tabelas.py.
router = APIRouter(prefix="/padroes", tags=["Padrões Contábeis (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Padrao:
    obj = db.query(Padrao).filter(Padrao.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Padrão não encontrado")
    return obj


@router.get("", response_model=list[padrao_schema.PadraoOut])
def listar_padroes(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Padrao)
    if busca:
        condicoes = [
            Padrao.historico_receber.ilike(f"%{busca}%"),
            Padrao.historico_pagar.ilike(f"%{busca}%"),
        ]
        if busca.isdigit():
            condicoes.append(Padrao.codigo == int(busca))
        q = q.filter(or_(*condicoes))
    return q.order_by(Padrao.id).all()


@router.get("/{id}", response_model=padrao_schema.PadraoOut)
def buscar_padrao(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=padrao_schema.PadraoOut)
def criar_padrao(dados: padrao_schema.PadraoCreate, db: Session = Depends(get_db)):
    obj = Padrao(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=padrao_schema.PadraoOut)
def atualizar_padrao(id: int, dados: padrao_schema.PadraoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_padrao(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Padrão deletado com sucesso"}

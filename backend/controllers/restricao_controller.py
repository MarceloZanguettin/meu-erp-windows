from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Restricao
from schemas import restricao as restricao_schema

# Tabela mestre de Restrições Cadastrais do GENUS (GENUS.RESTRICAO) —
# módulo Sistema/Config, lista de CPF/CNPJ restritos (bloqueio de
# crédito/negativação) identificados diretamente pelo documento, sem FK
# para CADASTRO; ver docstring do model `Restricao` em models/tabelas.py.
router = APIRouter(prefix="/restricoes", tags=["Restrições Cadastrais (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Restricao:
    obj = db.query(Restricao).filter(Restricao.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Restrição não encontrada")
    return obj


@router.get("", response_model=list[restricao_schema.RestricaoOut])
def listar_restricoes(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Restricao)
    if busca:
        condicoes = [
            Restricao.nome.ilike(f"%{busca}%"),
            Restricao.cpf_cnpj.ilike(f"%{busca}%"),
            Restricao.motivo.ilike(f"%{busca}%"),
        ]
        q = q.filter(or_(*condicoes))
    return q.order_by(Restricao.id).all()


@router.get("/{id}", response_model=restricao_schema.RestricaoOut)
def buscar_restricao(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=restricao_schema.RestricaoOut)
def criar_restricao(dados: restricao_schema.RestricaoCreate, db: Session = Depends(get_db)):
    obj = Restricao(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=restricao_schema.RestricaoOut)
def atualizar_restricao(id: int, dados: restricao_schema.RestricaoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_restricao(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Restrição deletada com sucesso"}

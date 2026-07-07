from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Configuracao
from schemas import configuracao as configuracao_schema

# Tabela de configurações gerais do sistema do GENUS (GENUS.CONFIGURACAO) —
# módulo Sistema/Config; ver docstring do model `Configuracao` em
# models/tabelas.py.
router = APIRouter(prefix="/configuracoes", tags=["Configurações (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Configuracao:
    obj = db.query(Configuracao).filter(Configuracao.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Configuração não encontrada")
    return obj


@router.get("", response_model=list[configuracao_schema.ConfiguracaoOut])
def listar_configuracoes(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Configuracao)
    if busca:
        condicoes = [
            Configuracao.codigo.ilike(f"%{busca}%"),
            Configuracao.dh.ilike(f"%{busca}%"),
            Configuracao.dc.ilike(f"%{busca}%"),
        ]
        q = q.filter(or_(*condicoes))
    return q.order_by(Configuracao.id).all()


@router.get("/{id}", response_model=configuracao_schema.ConfiguracaoOut)
def buscar_configuracao(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=configuracao_schema.ConfiguracaoOut)
def criar_configuracao(dados: configuracao_schema.ConfiguracaoCreate, db: Session = Depends(get_db)):
    obj = Configuracao(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=configuracao_schema.ConfiguracaoOut)
def atualizar_configuracao(id: int, dados: configuracao_schema.ConfiguracaoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_configuracao(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Configuração deletada com sucesso"}

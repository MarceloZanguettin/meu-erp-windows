from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Mensagem
from schemas import mensagem as mensagem_schema

# Tabela mestre de Mensagens do GENUS (GENUS.MENSAGEM) — módulo Sistema/
# Config, mensagens internas entre usuários/empresas do GENUS; ver
# docstring do model `Mensagem` em models/tabelas.py.
router = APIRouter(prefix="/mensagens", tags=["Mensagens (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Mensagem:
    obj = db.query(Mensagem).filter(Mensagem.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Mensagem não encontrada")
    return obj


@router.get("", response_model=list[mensagem_schema.MensagemOut])
def listar_mensagens(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Mensagem)
    if busca:
        condicoes = [
            Mensagem.titulo.ilike(f"%{busca}%"),
            Mensagem.observacao.ilike(f"%{busca}%"),
            Mensagem.chave.ilike(f"%{busca}%"),
        ]
        if busca.isdigit():
            condicoes.append(Mensagem.codigo == int(busca))
        q = q.filter(or_(*condicoes))
    return q.order_by(Mensagem.id).all()


@router.get("/{id}", response_model=mensagem_schema.MensagemOut)
def buscar_mensagem(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=mensagem_schema.MensagemOut)
def criar_mensagem(dados: mensagem_schema.MensagemCreate, db: Session = Depends(get_db)):
    obj = Mensagem(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=mensagem_schema.MensagemOut)
def atualizar_mensagem(id: int, dados: mensagem_schema.MensagemUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_mensagem(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Mensagem deletada com sucesso"}

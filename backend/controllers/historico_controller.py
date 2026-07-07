from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Historico
from schemas import historico

router = APIRouter(prefix="/historicos", tags=["Históricos"])


def _get_ou_404(db: Session, id: int) -> Historico:
    obj = db.query(Historico).filter(Historico.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Histórico não encontrado")
    return obj


@router.get("", response_model=list[historico.HistoricoOut])
def listar_historicos(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Historico)
    if busca:
        condicoes = [Historico.descricao.ilike(f"%{busca}%"), Historico.codigo.ilike(f"%{busca}%")]
        q = q.filter(or_(*condicoes))
    return q.order_by(Historico.descricao, Historico.id).all()


@router.get("/{id}", response_model=historico.HistoricoOut)
def buscar_historico(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=historico.HistoricoOut)
def criar_historico(dados: historico.HistoricoCreate, db: Session = Depends(get_db)):
    obj = Historico(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=historico.HistoricoOut)
def atualizar_historico(id: int, dados: historico.HistoricoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_historico(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Histórico deletado com sucesso"}

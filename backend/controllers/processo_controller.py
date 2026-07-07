from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Processo
from schemas import processo

router = APIRouter(prefix="/processos", tags=["Processos"])


def _get_ou_404(db: Session, id: int) -> Processo:
    obj = db.query(Processo).filter(Processo.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    return obj


@router.get("", response_model=list[processo.ProcessoOut])
def listar_processos(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Processo)
    if busca:
        q = q.filter(Processo.descricao.ilike(f"%{busca}%"))
    return q.order_by(Processo.ordem, Processo.id).all()


@router.get("/{id}", response_model=processo.ProcessoOut)
def buscar_processo(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=processo.ProcessoOut)
def criar_processo(dados: processo.ProcessoCreate, db: Session = Depends(get_db)):
    obj = Processo(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=processo.ProcessoOut)
def atualizar_processo(id: int, dados: processo.ProcessoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_processo(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Processo deletado com sucesso"}

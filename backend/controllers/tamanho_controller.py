from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Tamanho
from schemas import tamanho

router = APIRouter(prefix="/tamanhos", tags=["Tamanhos"])


def _get_ou_404(db: Session, id: int) -> Tamanho:
    obj = db.query(Tamanho).filter(Tamanho.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Tamanho não encontrado")
    return obj


@router.get("", response_model=list[tamanho.TamanhoOut])
def listar_tamanhos(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Tamanho)
    if busca:
        q = q.filter(
            (Tamanho.descricao.ilike(f"%{busca}%"))
            | (Tamanho.codigo.ilike(f"%{busca}%"))
        )
    return q.order_by(Tamanho.ordem, Tamanho.id).all()


@router.get("/{id}", response_model=tamanho.TamanhoOut)
def buscar_tamanho(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=tamanho.TamanhoOut)
def criar_tamanho(dados: tamanho.TamanhoCreate, db: Session = Depends(get_db)):
    obj = Tamanho(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=tamanho.TamanhoOut)
def atualizar_tamanho(id: int, dados: tamanho.TamanhoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_tamanho(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Tamanho deletado com sucesso"}

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Classificacao
from schemas import classificacao

router = APIRouter(prefix="/classificacoes", tags=["Classificações"])


def _get_ou_404(db: Session, id: int) -> Classificacao:
    obj = db.query(Classificacao).filter(Classificacao.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Classificação não encontrada")
    return obj


@router.get("", response_model=list[classificacao.ClassificacaoOut])
def listar_classificacoes(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Classificacao)
    if busca:
        q = q.filter(
            (Classificacao.ncm.ilike(f"%{busca}%"))
            | (Classificacao.descricao_ncm.ilike(f"%{busca}%"))
        )
    return q.order_by(Classificacao.id).all()


@router.get("/{id}", response_model=classificacao.ClassificacaoOut)
def buscar_classificacao(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=classificacao.ClassificacaoOut)
def criar_classificacao(dados: classificacao.ClassificacaoCreate, db: Session = Depends(get_db)):
    obj = Classificacao(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=classificacao.ClassificacaoOut)
def atualizar_classificacao(id: int, dados: classificacao.ClassificacaoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_classificacao(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Classificação deletada com sucesso"}

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ProdutoRegra
from schemas import produto_regra

router = APIRouter(prefix="/produto-regras", tags=["Regras de Produto"])


def _get_ou_404(db: Session, id: int) -> ProdutoRegra:
    obj = db.query(ProdutoRegra).filter(ProdutoRegra.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Regra de produto não encontrada")
    return obj


@router.get("", response_model=list[produto_regra.ProdutoRegraOut])
def listar_produto_regras(
    produto_id: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ProdutoRegra)
    if produto_id:
        q = q.filter(ProdutoRegra.produto_id == produto_id)
    if busca:
        q = q.filter(ProdutoRegra.cod_produto.ilike(f"%{busca}%"))
    return q.order_by(ProdutoRegra.id).all()


@router.get("/{id}", response_model=produto_regra.ProdutoRegraOut)
def buscar_produto_regra(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=produto_regra.ProdutoRegraOut)
def criar_produto_regra(dados: produto_regra.ProdutoRegraCreate, db: Session = Depends(get_db)):
    obj = ProdutoRegra(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=produto_regra.ProdutoRegraOut)
def atualizar_produto_regra(id: int, dados: produto_regra.ProdutoRegraUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_produto_regra(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Regra de produto deletada com sucesso"}

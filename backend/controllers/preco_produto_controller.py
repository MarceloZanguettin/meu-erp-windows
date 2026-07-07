from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import PrecoProduto
from schemas import preco_produto

router = APIRouter(prefix="/precos-produto", tags=["Preços de Produto"])


def _get_ou_404(db: Session, id: int) -> PrecoProduto:
    obj = db.query(PrecoProduto).filter(PrecoProduto.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Preço de produto não encontrado")
    return obj


@router.get("", response_model=list[preco_produto.PrecoProdutoOut])
def listar_precos_produto(
    produto_id: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(PrecoProduto)
    if produto_id:
        q = q.filter(PrecoProduto.produto_id == produto_id)
    if busca:
        q = q.filter(PrecoProduto.cod_produto.ilike(f"%{busca}%"))
    return q.order_by(PrecoProduto.id).all()


@router.get("/{id}", response_model=preco_produto.PrecoProdutoOut)
def buscar_preco_produto(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=preco_produto.PrecoProdutoOut)
def criar_preco_produto(dados: preco_produto.PrecoProdutoCreate, db: Session = Depends(get_db)):
    obj = PrecoProduto(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=preco_produto.PrecoProdutoOut)
def atualizar_preco_produto(id: int, dados: preco_produto.PrecoProdutoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_preco_produto(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Preço de produto deletado com sucesso"}

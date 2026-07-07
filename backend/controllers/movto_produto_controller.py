from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import MovtoProduto
from schemas import movto_produto

router = APIRouter(prefix="/movto-produtos", tags=["Movimentos de Produto"])


def _get_ou_404(db: Session, id: int) -> MovtoProduto:
    obj = db.query(MovtoProduto).filter(MovtoProduto.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Movimento de produto não encontrado")
    return obj


@router.get("", response_model=list[movto_produto.MovtoProdutoOut])
def listar_movto_produtos(
    produto_id: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(MovtoProduto)
    if produto_id:
        q = q.filter(MovtoProduto.produto_id == produto_id)
    if busca:
        q = q.filter(
            (MovtoProduto.cod_produto.ilike(f"%{busca}%"))
            | (MovtoProduto.lote_produto.ilike(f"%{busca}%"))
            | (MovtoProduto.lote_producao.ilike(f"%{busca}%"))
        )
    return q.order_by(MovtoProduto.id.desc()).all()


@router.get("/{id}", response_model=movto_produto.MovtoProdutoOut)
def buscar_movto_produto(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=movto_produto.MovtoProdutoOut)
def criar_movto_produto(dados: movto_produto.MovtoProdutoCreate, db: Session = Depends(get_db)):
    obj = MovtoProduto(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=movto_produto.MovtoProdutoOut)
def atualizar_movto_produto(id: int, dados: movto_produto.MovtoProdutoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_movto_produto(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Movimento de produto deletado com sucesso"}

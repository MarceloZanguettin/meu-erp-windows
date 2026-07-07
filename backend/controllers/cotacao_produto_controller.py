from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import CotacaoProduto
from schemas import cotacao_produto

router = APIRouter(prefix="/cotacao-produtos", tags=["Produtos solicitados em Cotação de Preço (GENUS)"])


def _get_ou_404(db: Session, id: int) -> CotacaoProduto:
    obj = db.query(CotacaoProduto).filter(CotacaoProduto.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Produto de cotação não encontrado")
    return obj


@router.get("", response_model=list[cotacao_produto.CotacaoProdutoOut])
def listar_cotacao_produtos(
    produto_id: Optional[int] = Query(None),
    cod_cotacao: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(CotacaoProduto)
    if produto_id:
        q = q.filter(CotacaoProduto.produto_id == produto_id)
    if cod_cotacao:
        q = q.filter(CotacaoProduto.cod_cotacao == cod_cotacao)
    if busca:
        q = q.filter(CotacaoProduto.cod_produto.ilike(f"%{busca}%"))
    return q.order_by(CotacaoProduto.id.desc()).all()


@router.get("/{id}", response_model=cotacao_produto.CotacaoProdutoOut)
def buscar_cotacao_produto(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cotacao_produto.CotacaoProdutoOut)
def criar_cotacao_produto(dados: cotacao_produto.CotacaoProdutoCreate, db: Session = Depends(get_db)):
    obj = CotacaoProduto(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cotacao_produto.CotacaoProdutoOut)
def atualizar_cotacao_produto(id: int, dados: cotacao_produto.CotacaoProdutoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cotacao_produto(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Produto de cotação deletado com sucesso"}

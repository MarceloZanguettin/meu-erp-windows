from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ProdutoConversaoFornecedor
from schemas import produto_conversao_fornecedor

router = APIRouter(prefix="/produto-conversoes-fornecedor", tags=["Conversões de Fornecedor de Produto"])


def _get_ou_404(db: Session, id: int) -> ProdutoConversaoFornecedor:
    obj = db.query(ProdutoConversaoFornecedor).filter(ProdutoConversaoFornecedor.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Conversão de fornecedor de produto não encontrada")
    return obj


@router.get("", response_model=list[produto_conversao_fornecedor.ProdutoConversaoFornecedorOut])
def listar_produto_conversoes_fornecedor(
    produto_id: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ProdutoConversaoFornecedor)
    if produto_id:
        q = q.filter(ProdutoConversaoFornecedor.produto_id == produto_id)
    if busca:
        q = q.filter(ProdutoConversaoFornecedor.cod_produto.ilike(f"%{busca}%"))
    return q.order_by(ProdutoConversaoFornecedor.id).all()


@router.get("/{id}", response_model=produto_conversao_fornecedor.ProdutoConversaoFornecedorOut)
def buscar_produto_conversao_fornecedor(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=produto_conversao_fornecedor.ProdutoConversaoFornecedorOut)
def criar_produto_conversao_fornecedor(dados: produto_conversao_fornecedor.ProdutoConversaoFornecedorCreate, db: Session = Depends(get_db)):
    obj = ProdutoConversaoFornecedor(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=produto_conversao_fornecedor.ProdutoConversaoFornecedorOut)
def atualizar_produto_conversao_fornecedor(id: int, dados: produto_conversao_fornecedor.ProdutoConversaoFornecedorUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_produto_conversao_fornecedor(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Conversão de fornecedor de produto deletada com sucesso"}

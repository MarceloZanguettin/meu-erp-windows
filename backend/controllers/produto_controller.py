from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Produto
from schemas import produto

router = APIRouter(prefix="/produtos", tags=["Produtos"])


def _get_ou_404(db: Session, id: int) -> Produto:
    obj = db.query(Produto).filter(Produto.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return obj


@router.get("", response_model=list[produto.ProdutoOut])
def listar_produtos(
    busca: Optional[str] = Query(None),
    situacao: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Produto)
    if busca:
        q = q.filter(
            Produto.nome.ilike(f"%{busca}%")
            | Produto.codigo.ilike(f"%{busca}%")
            | Produto.codigo_interno.ilike(f"%{busca}%")
            | Produto.referencia.ilike(f"%{busca}%")
        )
    if situacao:
        q = q.filter(Produto.situacao == situacao)
    return q.order_by(Produto.nome).all()


@router.get("/{id}", response_model=produto.ProdutoOut)
def buscar_produto(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=produto.ProdutoOut)
def criar_produto(dados: produto.ProdutoCreate, db: Session = Depends(get_db)):
    if dados.codigo:
        existente = db.query(Produto).filter(Produto.codigo == dados.codigo).first()
        if existente:
            raise HTTPException(status_code=409, detail="Já existe um produto com esse código")
    obj = Produto(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=produto.ProdutoOut)
def atualizar_produto(id: int, dados: produto.ProdutoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_produto(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Produto deletado com sucesso"}

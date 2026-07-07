from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ProdutoBarra
from schemas import produto_barra

router = APIRouter(prefix="/produto-barras", tags=["Códigos de Barra de Produto"])


def _get_ou_404(db: Session, id: int) -> ProdutoBarra:
    obj = db.query(ProdutoBarra).filter(ProdutoBarra.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Código de barras de produto não encontrado")
    return obj


@router.get("", response_model=list[produto_barra.ProdutoBarraOut])
def listar_produto_barras(
    produto_id: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ProdutoBarra)
    if produto_id:
        q = q.filter(ProdutoBarra.produto_id == produto_id)
    if busca:
        q = q.filter(ProdutoBarra.codigo_barra.ilike(f"%{busca}%"))
    return q.order_by(ProdutoBarra.id).all()


@router.get("/{id}", response_model=produto_barra.ProdutoBarraOut)
def buscar_produto_barra(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=produto_barra.ProdutoBarraOut)
def criar_produto_barra(dados: produto_barra.ProdutoBarraCreate, db: Session = Depends(get_db)):
    obj = ProdutoBarra(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=produto_barra.ProdutoBarraOut)
def atualizar_produto_barra(id: int, dados: produto_barra.ProdutoBarraUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_produto_barra(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Código de barras de produto deletado com sucesso"}

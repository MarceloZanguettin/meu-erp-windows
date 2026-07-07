from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ProdutoReferencia
from schemas import produto_referencia

router = APIRouter(prefix="/produto-referencias", tags=["Referências de Fornecedor de Produto"])


def _get_ou_404(db: Session, id: int) -> ProdutoReferencia:
    obj = db.query(ProdutoReferencia).filter(ProdutoReferencia.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Referência de fornecedor de produto não encontrada")
    return obj


@router.get("", response_model=list[produto_referencia.ProdutoReferenciaOut])
def listar_produto_referencias(
    produto_id: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ProdutoReferencia)
    if produto_id:
        q = q.filter(ProdutoReferencia.produto_id == produto_id)
    if busca:
        q = q.filter(ProdutoReferencia.ref_fabrica.ilike(f"%{busca}%"))
    return q.order_by(ProdutoReferencia.id).all()


@router.get("/{id}", response_model=produto_referencia.ProdutoReferenciaOut)
def buscar_produto_referencia(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=produto_referencia.ProdutoReferenciaOut)
def criar_produto_referencia(dados: produto_referencia.ProdutoReferenciaCreate, db: Session = Depends(get_db)):
    obj = ProdutoReferencia(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=produto_referencia.ProdutoReferenciaOut)
def atualizar_produto_referencia(id: int, dados: produto_referencia.ProdutoReferenciaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_produto_referencia(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Referência de fornecedor de produto deletada com sucesso"}

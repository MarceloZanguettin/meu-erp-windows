from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ProdutoExcluido
from schemas import produto_excluido

router = APIRouter(prefix="/produtos-excluidos", tags=["Produtos Excluídos"])


def _get_ou_404(db: Session, id: int) -> ProdutoExcluido:
    obj = db.query(ProdutoExcluido).filter(ProdutoExcluido.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Produto excluído não encontrado")
    return obj


@router.get("", response_model=list[produto_excluido.ProdutoExcluidoOut])
def listar_produtos_excluidos(
    produto_id: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ProdutoExcluido)
    if produto_id:
        q = q.filter(ProdutoExcluido.produto_id == produto_id)
    if busca:
        q = q.filter(
            ProdutoExcluido.descricao.ilike(f"%{busca}%")
            | ProdutoExcluido.cod_produto.ilike(f"%{busca}%")
            | ProdutoExcluido.codigo_interno.ilike(f"%{busca}%")
        )
    return q.order_by(ProdutoExcluido.id).all()


@router.get("/{id}", response_model=produto_excluido.ProdutoExcluidoOut)
def buscar_produto_excluido(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=produto_excluido.ProdutoExcluidoOut)
def criar_produto_excluido(dados: produto_excluido.ProdutoExcluidoCreate, db: Session = Depends(get_db)):
    obj = ProdutoExcluido(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=produto_excluido.ProdutoExcluidoOut)
def atualizar_produto_excluido(id: int, dados: produto_excluido.ProdutoExcluidoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_produto_excluido(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Produto excluído removido com sucesso"}

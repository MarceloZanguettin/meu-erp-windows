from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ProdutoComposicao
from schemas import produto_composicao

router = APIRouter(prefix="/produto-composicoes", tags=["Composição de Produto"])


def _get_ou_404(db: Session, id: int) -> ProdutoComposicao:
    obj = db.query(ProdutoComposicao).filter(ProdutoComposicao.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Composição de produto não encontrada")
    return obj


@router.get("", response_model=list[produto_composicao.ProdutoComposicaoOut])
def listar_produto_composicoes(
    produto_id: Optional[int] = Query(None, description="Filtra pelo produto 'pai' (acabado) da composição"),
    produto_materia_id: Optional[int] = Query(None, description="Filtra pelo produto 'componente'/matéria-prima da composição"),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ProdutoComposicao)
    if produto_id:
        q = q.filter(ProdutoComposicao.produto_id == produto_id)
    if produto_materia_id:
        q = q.filter(ProdutoComposicao.produto_materia_id == produto_materia_id)
    if busca:
        q = q.filter(
            (ProdutoComposicao.cod_produto.ilike(f"%{busca}%"))
            | (ProdutoComposicao.cod_materia.ilike(f"%{busca}%"))
        )
    return q.order_by(ProdutoComposicao.sequencia, ProdutoComposicao.id).all()


@router.get("/{id}", response_model=produto_composicao.ProdutoComposicaoOut)
def buscar_produto_composicao(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=produto_composicao.ProdutoComposicaoOut)
def criar_produto_composicao(dados: produto_composicao.ProdutoComposicaoCreate, db: Session = Depends(get_db)):
    obj = ProdutoComposicao(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=produto_composicao.ProdutoComposicaoOut)
def atualizar_produto_composicao(id: int, dados: produto_composicao.ProdutoComposicaoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_produto_composicao(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Composição de produto deletada com sucesso"}

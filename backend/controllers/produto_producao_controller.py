from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ProdutoProducao
from schemas import produto_producao

router = APIRouter(prefix="/produto-producoes", tags=["Produção de Produto"])


def _get_ou_404(db: Session, id: int) -> ProdutoProducao:
    obj = db.query(ProdutoProducao).filter(ProdutoProducao.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Registro de produção de produto não encontrado")
    return obj


@router.get("", response_model=list[produto_producao.ProdutoProducaoOut])
def listar_produto_producoes(
    produto_id: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ProdutoProducao)
    if produto_id:
        q = q.filter(ProdutoProducao.produto_id == produto_id)
    if busca:
        q = q.filter(
            (ProdutoProducao.lote.ilike(f"%{busca}%"))
            | (ProdutoProducao.cod_produto.ilike(f"%{busca}%"))
        )
    return q.order_by(ProdutoProducao.id.desc()).all()


@router.get("/{id}", response_model=produto_producao.ProdutoProducaoOut)
def buscar_produto_producao(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=produto_producao.ProdutoProducaoOut)
def criar_produto_producao(dados: produto_producao.ProdutoProducaoCreate, db: Session = Depends(get_db)):
    obj = ProdutoProducao(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=produto_producao.ProdutoProducaoOut)
def atualizar_produto_producao(id: int, dados: produto_producao.ProdutoProducaoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_produto_producao(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro de produção de produto deletado com sucesso"}

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ProdutoProcesso
from schemas import produto_processo

router = APIRouter(prefix="/produto-processos", tags=["Processos de Produto"])


def _get_ou_404(db: Session, id: int) -> ProdutoProcesso:
    obj = db.query(ProdutoProcesso).filter(ProdutoProcesso.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Processo de produto não encontrado")
    return obj


@router.get("", response_model=list[produto_processo.ProdutoProcessoOut])
def listar_produto_processos(
    produto_id: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ProdutoProcesso)
    if produto_id:
        q = q.filter(ProdutoProcesso.produto_id == produto_id)
    if busca:
        q = q.filter(ProdutoProcesso.cod_produto.ilike(f"%{busca}%"))
    return q.order_by(ProdutoProcesso.ordem, ProdutoProcesso.id).all()


@router.get("/{id}", response_model=produto_processo.ProdutoProcessoOut)
def buscar_produto_processo(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=produto_processo.ProdutoProcessoOut)
def criar_produto_processo(dados: produto_processo.ProdutoProcessoCreate, db: Session = Depends(get_db)):
    obj = ProdutoProcesso(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=produto_processo.ProdutoProcessoOut)
def atualizar_produto_processo(id: int, dados: produto_processo.ProdutoProcessoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_produto_processo(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Processo de produto deletado com sucesso"}

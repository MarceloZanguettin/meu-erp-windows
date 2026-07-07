from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import CotacaoItens
from schemas import cotacao_itens

router = APIRouter(prefix="/cotacao-itens", tags=["Itens de Cotação de Preço (GENUS)"])


def _get_ou_404(db: Session, id: int) -> CotacaoItens:
    obj = db.query(CotacaoItens).filter(CotacaoItens.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Item de cotação não encontrado")
    return obj


@router.get("", response_model=list[cotacao_itens.CotacaoItensOut])
def listar_cotacao_itens(
    produto_id: Optional[int] = Query(None),
    cod_cotacao_preco: Optional[int] = Query(None),
    cod_fornecedor: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(CotacaoItens)
    if produto_id:
        q = q.filter(CotacaoItens.produto_id == produto_id)
    if cod_cotacao_preco:
        q = q.filter(CotacaoItens.cod_cotacao_preco == cod_cotacao_preco)
    if cod_fornecedor:
        q = q.filter(CotacaoItens.cod_fornecedor == cod_fornecedor)
    if busca:
        q = q.filter(
            (CotacaoItens.cod_produto.ilike(f"%{busca}%"))
            | (CotacaoItens.obs.ilike(f"%{busca}%"))
        )
    return q.order_by(CotacaoItens.id.desc()).all()


@router.get("/{id}", response_model=cotacao_itens.CotacaoItensOut)
def buscar_cotacao_item(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cotacao_itens.CotacaoItensOut)
def criar_cotacao_item(dados: cotacao_itens.CotacaoItensCreate, db: Session = Depends(get_db)):
    obj = CotacaoItens(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cotacao_itens.CotacaoItensOut)
def atualizar_cotacao_item(id: int, dados: cotacao_itens.CotacaoItensUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cotacao_item(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Item de cotação deletado com sucesso"}

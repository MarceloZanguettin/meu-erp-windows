from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ItemOrcamentoGenus
from schemas import item_orcamento_genus

router = APIRouter(prefix="/itens-orcamento-genus", tags=["Itens de Orçamento GENUS (Vendas/Faturamento)"])


def _get_ou_404(db: Session, id: int) -> ItemOrcamentoGenus:
    obj = db.query(ItemOrcamentoGenus).filter(ItemOrcamentoGenus.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Item de orçamento (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[item_orcamento_genus.ItemOrcamentoGenusOut])
def listar_itens_orcamento_genus(
    orcamento_id: Optional[int] = Query(None),
    produto_id: Optional[int] = Query(None),
    cod_orcamento: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ItemOrcamentoGenus)
    if orcamento_id:
        q = q.filter(ItemOrcamentoGenus.orcamento_id == orcamento_id)
    if produto_id:
        q = q.filter(ItemOrcamentoGenus.produto_id == produto_id)
    if cod_orcamento:
        q = q.filter(ItemOrcamentoGenus.cod_orcamento == cod_orcamento)
    if cod_empresa:
        q = q.filter(ItemOrcamentoGenus.cod_empresa == cod_empresa)
    if busca:
        q = q.filter(
            (ItemOrcamentoGenus.cod_produto.ilike(f"%{busca}%"))
            | (ItemOrcamentoGenus.descricao_produto.ilike(f"%{busca}%"))
        )
    return q.order_by(ItemOrcamentoGenus.id.desc()).all()


@router.get("/{id}", response_model=item_orcamento_genus.ItemOrcamentoGenusOut)
def buscar_item_orcamento_genus(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=item_orcamento_genus.ItemOrcamentoGenusOut)
def criar_item_orcamento_genus(dados: item_orcamento_genus.ItemOrcamentoGenusCreate, db: Session = Depends(get_db)):
    obj = ItemOrcamentoGenus(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=item_orcamento_genus.ItemOrcamentoGenusOut)
def atualizar_item_orcamento_genus(id: int, dados: item_orcamento_genus.ItemOrcamentoGenusUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_item_orcamento_genus(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Item de orçamento (GENUS) deletado com sucesso"}

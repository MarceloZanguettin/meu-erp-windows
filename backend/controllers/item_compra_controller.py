from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ItemCompra
from schemas import item_compra

router = APIRouter(prefix="/itens-compra", tags=["Itens de Compra (Compras)"])


def _get_ou_404(db: Session, id: int) -> ItemCompra:
    obj = db.query(ItemCompra).filter(ItemCompra.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Item de compra não encontrado")
    return obj


@router.get("", response_model=list[item_compra.ItemCompraOut])
def listar_itens_compra(
    produto_id: Optional[int] = Query(None),
    compra_id: Optional[int] = Query(None),
    cod_compras: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ItemCompra)
    if produto_id:
        q = q.filter(ItemCompra.produto_id == produto_id)
    if compra_id:
        q = q.filter(ItemCompra.compra_id == compra_id)
    if cod_compras:
        q = q.filter(ItemCompra.cod_compras == cod_compras)
    if cod_empresa:
        q = q.filter(ItemCompra.cod_empresa == cod_empresa)
    if busca:
        q = q.filter(
            (ItemCompra.cod_produto.ilike(f"%{busca}%"))
            | (ItemCompra.lote_produto.ilike(f"%{busca}%"))
        )
    return q.order_by(ItemCompra.id.desc()).all()


@router.get("/{id}", response_model=item_compra.ItemCompraOut)
def buscar_item_compra(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=item_compra.ItemCompraOut)
def criar_item_compra(dados: item_compra.ItemCompraCreate, db: Session = Depends(get_db)):
    obj = ItemCompra(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=item_compra.ItemCompraOut)
def atualizar_item_compra(id: int, dados: item_compra.ItemCompraUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_item_compra(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Item de compra deletado com sucesso"}

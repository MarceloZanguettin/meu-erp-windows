from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ItemPedidoLan
from schemas import item_pedido_lan

router = APIRouter(prefix="/itens-pedido-lan", tags=["Itens de Pedido de Venda GENUS (Vendas/Faturamento)"])


def _get_ou_404(db: Session, id: int) -> ItemPedidoLan:
    obj = db.query(ItemPedidoLan).filter(ItemPedidoLan.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Item de pedido de venda (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[item_pedido_lan.ItemPedidoLanOut])
def listar_itens_pedido_lan(
    pedido_id: Optional[int] = Query(None),
    produto_id: Optional[int] = Query(None),
    cod_pedido: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ItemPedidoLan)
    if pedido_id:
        q = q.filter(ItemPedidoLan.pedido_id == pedido_id)
    if produto_id:
        q = q.filter(ItemPedidoLan.produto_id == produto_id)
    if cod_pedido:
        q = q.filter(ItemPedidoLan.cod_pedido == cod_pedido)
    if cod_empresa:
        q = q.filter(ItemPedidoLan.cod_empresa == cod_empresa)
    if busca:
        q = q.filter(
            (ItemPedidoLan.cod_produto.ilike(f"%{busca}%"))
            | (ItemPedidoLan.num_item.ilike(f"%{busca}%"))
        )
    return q.order_by(ItemPedidoLan.id.desc()).all()


@router.get("/{id}", response_model=item_pedido_lan.ItemPedidoLanOut)
def buscar_item_pedido_lan(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=item_pedido_lan.ItemPedidoLanOut)
def criar_item_pedido_lan(dados: item_pedido_lan.ItemPedidoLanCreate, db: Session = Depends(get_db)):
    obj = ItemPedidoLan(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=item_pedido_lan.ItemPedidoLanOut)
def atualizar_item_pedido_lan(id: int, dados: item_pedido_lan.ItemPedidoLanUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_item_pedido_lan(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Item de pedido de venda (GENUS) deletado com sucesso"}

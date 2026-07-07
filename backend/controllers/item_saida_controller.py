from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ItemSaida
from schemas import item_saida

router = APIRouter(prefix="/itens-saida", tags=["Itens de Saída (Vendas/Faturamento)"])


def _get_ou_404(db: Session, id: int) -> ItemSaida:
    obj = db.query(ItemSaida).filter(ItemSaida.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Item de saída não encontrado")
    return obj


@router.get("", response_model=list[item_saida.ItemSaidaOut])
def listar_itens_saida(
    produto_id: Optional[int] = Query(None),
    cod_saida: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ItemSaida)
    if produto_id:
        q = q.filter(ItemSaida.produto_id == produto_id)
    if cod_saida:
        q = q.filter(ItemSaida.cod_saida == cod_saida)
    if cod_empresa:
        q = q.filter(ItemSaida.cod_empresa == cod_empresa)
    if busca:
        q = q.filter(
            (ItemSaida.cod_produto.ilike(f"%{busca}%"))
            | (ItemSaida.lote_produto.ilike(f"%{busca}%"))
            | (ItemSaida.num_pedido.ilike(f"%{busca}%"))
        )
    return q.order_by(ItemSaida.id.desc()).all()


@router.get("/{id}", response_model=item_saida.ItemSaidaOut)
def buscar_item_saida(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=item_saida.ItemSaidaOut)
def criar_item_saida(dados: item_saida.ItemSaidaCreate, db: Session = Depends(get_db)):
    obj = ItemSaida(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=item_saida.ItemSaidaOut)
def atualizar_item_saida(id: int, dados: item_saida.ItemSaidaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_item_saida(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Item de saída deletado com sucesso"}

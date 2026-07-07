from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ItemSaidaCancelado
from schemas import item_saida_cancelado

router = APIRouter(prefix="/itens-saida-cancelados", tags=["Itens de Saída Cancelados (Vendas/Faturamento)"])


def _get_ou_404(db: Session, id: int) -> ItemSaidaCancelado:
    obj = db.query(ItemSaidaCancelado).filter(ItemSaidaCancelado.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Item de saída cancelado não encontrado")
    return obj


@router.get("", response_model=list[item_saida_cancelado.ItemSaidaCanceladoOut])
def listar_itens_saida_cancelados(
    produto_id: Optional[int] = Query(None),
    cod_saida: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ItemSaidaCancelado)
    if produto_id:
        q = q.filter(ItemSaidaCancelado.produto_id == produto_id)
    if cod_saida:
        q = q.filter(ItemSaidaCancelado.cod_saida == cod_saida)
    if cod_empresa:
        q = q.filter(ItemSaidaCancelado.cod_empresa == cod_empresa)
    if busca:
        q = q.filter(
            (ItemSaidaCancelado.cod_produto.ilike(f"%{busca}%"))
            | (ItemSaidaCancelado.cod_cfop.ilike(f"%{busca}%"))
        )
    return q.order_by(ItemSaidaCancelado.id.desc()).all()


@router.get("/{id}", response_model=item_saida_cancelado.ItemSaidaCanceladoOut)
def buscar_item_saida_cancelado(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=item_saida_cancelado.ItemSaidaCanceladoOut)
def criar_item_saida_cancelado(dados: item_saida_cancelado.ItemSaidaCanceladoCreate, db: Session = Depends(get_db)):
    obj = ItemSaidaCancelado(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=item_saida_cancelado.ItemSaidaCanceladoOut)
def atualizar_item_saida_cancelado(id: int, dados: item_saida_cancelado.ItemSaidaCanceladoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_item_saida_cancelado(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Item de saída cancelado removido com sucesso"}

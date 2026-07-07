from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ItemEntrada
from schemas import item_entrada

router = APIRouter(prefix="/itens-entrada", tags=["Itens de Entrada (Compras)"])


def _get_ou_404(db: Session, id: int) -> ItemEntrada:
    obj = db.query(ItemEntrada).filter(ItemEntrada.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Item de entrada não encontrado")
    return obj


@router.get("", response_model=list[item_entrada.ItemEntradaOut])
def listar_itens_entrada(
    produto_id: Optional[int] = Query(None),
    cod_fornecedor: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ItemEntrada)
    if produto_id:
        q = q.filter(ItemEntrada.produto_id == produto_id)
    if cod_fornecedor:
        q = q.filter(ItemEntrada.cod_fornecedor == cod_fornecedor)
    if cod_empresa:
        q = q.filter(ItemEntrada.cod_empresa == cod_empresa)
    if busca:
        q = q.filter(
            (ItemEntrada.cod_produto.ilike(f"%{busca}%"))
            | (ItemEntrada.lote_produto.ilike(f"%{busca}%"))
            | (ItemEntrada.fiscal.ilike(f"%{busca}%"))
        )
    return q.order_by(ItemEntrada.id.desc()).all()


@router.get("/{id}", response_model=item_entrada.ItemEntradaOut)
def buscar_item_entrada(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=item_entrada.ItemEntradaOut)
def criar_item_entrada(dados: item_entrada.ItemEntradaCreate, db: Session = Depends(get_db)):
    obj = ItemEntrada(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=item_entrada.ItemEntradaOut)
def atualizar_item_entrada(id: int, dados: item_entrada.ItemEntradaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_item_entrada(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Item de entrada deletado com sucesso"}

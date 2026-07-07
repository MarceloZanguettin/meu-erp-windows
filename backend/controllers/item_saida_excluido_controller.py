from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ItemSaidaExcluido
from schemas import item_saida_excluido

router = APIRouter(prefix="/itens-saida-excluidos", tags=["Itens de Saída Excluídos (Vendas/Faturamento)"])


def _get_ou_404(db: Session, id: int) -> ItemSaidaExcluido:
    obj = db.query(ItemSaidaExcluido).filter(ItemSaidaExcluido.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Item de saída excluído não encontrado")
    return obj


@router.get("", response_model=list[item_saida_excluido.ItemSaidaExcluidoOut])
def listar_itens_saida_excluidos(
    produto_id: Optional[int] = Query(None),
    cod_saida: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ItemSaidaExcluido)
    if produto_id:
        q = q.filter(ItemSaidaExcluido.produto_id == produto_id)
    if cod_saida:
        q = q.filter(ItemSaidaExcluido.cod_saida == cod_saida)
    if cod_empresa:
        q = q.filter(ItemSaidaExcluido.cod_empresa == cod_empresa)
    if busca:
        q = q.filter(
            (ItemSaidaExcluido.cod_produto.ilike(f"%{busca}%"))
            | (ItemSaidaExcluido.lote_produto.ilike(f"%{busca}%"))
        )
    return q.order_by(ItemSaidaExcluido.id.desc()).all()


@router.get("/{id}", response_model=item_saida_excluido.ItemSaidaExcluidoOut)
def buscar_item_saida_excluido(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=item_saida_excluido.ItemSaidaExcluidoOut)
def criar_item_saida_excluido(dados: item_saida_excluido.ItemSaidaExcluidoCreate, db: Session = Depends(get_db)):
    obj = ItemSaidaExcluido(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=item_saida_excluido.ItemSaidaExcluidoOut)
def atualizar_item_saida_excluido(id: int, dados: item_saida_excluido.ItemSaidaExcluidoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_item_saida_excluido(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Item de saída excluído removido com sucesso"}

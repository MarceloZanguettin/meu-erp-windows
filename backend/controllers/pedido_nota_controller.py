from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import PedidoNota
from schemas import pedido_nota

router = APIRouter(prefix="/pedidos-nota", tags=["Vínculo Pedido-Nota Fiscal GENUS (Vendas/Faturamento)"])


def _get_ou_404(db: Session, id: int) -> PedidoNota:
    obj = db.query(PedidoNota).filter(PedidoNota.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Vínculo pedido-nota fiscal (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[pedido_nota.PedidoNotaOut])
def listar_pedidos_nota(
    pedido_id: Optional[int] = Query(None),
    saida_id: Optional[int] = Query(None),
    cod_pedido: Optional[int] = Query(None),
    cod_saida: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(PedidoNota)
    if pedido_id:
        q = q.filter(PedidoNota.pedido_id == pedido_id)
    if saida_id:
        q = q.filter(PedidoNota.saida_id == saida_id)
    if cod_pedido:
        q = q.filter(PedidoNota.cod_pedido == cod_pedido)
    if cod_saida:
        q = q.filter(PedidoNota.cod_saida == cod_saida)
    if cod_empresa:
        q = q.filter(PedidoNota.cod_empresa == cod_empresa)
    if busca:
        try:
            valor_busca = int(busca)
        except ValueError:
            valor_busca = None
        if valor_busca is not None:
            q = q.filter(
                (PedidoNota.cod_pedido == valor_busca)
                | (PedidoNota.cod_saida == valor_busca)
            )
    return q.order_by(PedidoNota.id.desc()).all()


@router.get("/{id}", response_model=pedido_nota.PedidoNotaOut)
def buscar_pedido_nota(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=pedido_nota.PedidoNotaOut)
def criar_pedido_nota(dados: pedido_nota.PedidoNotaCreate, db: Session = Depends(get_db)):
    obj = PedidoNota(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=pedido_nota.PedidoNotaOut)
def atualizar_pedido_nota(id: int, dados: pedido_nota.PedidoNotaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_pedido_nota(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Vínculo pedido-nota fiscal (GENUS) deletado com sucesso"}

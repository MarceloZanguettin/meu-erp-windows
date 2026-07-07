from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import LogAlteracaoPedido
from schemas import log_alteracao_pedido

router = APIRouter(prefix="/logs-alteracao-pedido", tags=["Log de Alteração de Pedido GENUS (Vendas/Faturamento)"])


def _get_ou_404(db: Session, id: int) -> LogAlteracaoPedido:
    obj = db.query(LogAlteracaoPedido).filter(LogAlteracaoPedido.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Log de alteração de pedido (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[log_alteracao_pedido.LogAlteracaoPedidoOut])
def listar_logs_alteracao_pedido(
    pedido_id: Optional[int] = Query(None),
    cod_pedido: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(LogAlteracaoPedido)
    if pedido_id:
        q = q.filter(LogAlteracaoPedido.pedido_id == pedido_id)
    if cod_pedido:
        q = q.filter(LogAlteracaoPedido.cod_pedido == cod_pedido)
    if cod_empresa:
        q = q.filter(LogAlteracaoPedido.cod_empresa == cod_empresa)
    if busca:
        q = q.filter(
            (LogAlteracaoPedido.status_novo.ilike(f"%{busca}%"))
            | (LogAlteracaoPedido.origem_alteracao.ilike(f"%{busca}%"))
        )
    return q.order_by(LogAlteracaoPedido.id.desc()).all()


@router.get("/{id}", response_model=log_alteracao_pedido.LogAlteracaoPedidoOut)
def buscar_log_alteracao_pedido(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=log_alteracao_pedido.LogAlteracaoPedidoOut)
def criar_log_alteracao_pedido(dados: log_alteracao_pedido.LogAlteracaoPedidoCreate, db: Session = Depends(get_db)):
    obj = LogAlteracaoPedido(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=log_alteracao_pedido.LogAlteracaoPedidoOut)
def atualizar_log_alteracao_pedido(id: int, dados: log_alteracao_pedido.LogAlteracaoPedidoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_log_alteracao_pedido(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Log de alteração de pedido (GENUS) deletado com sucesso"}

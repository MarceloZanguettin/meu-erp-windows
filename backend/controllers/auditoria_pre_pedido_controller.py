from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import AuditoriaPrePedido
from schemas import auditoria_pre_pedido

router = APIRouter(prefix="/auditorias-pre-pedido", tags=["Auditoria de Pré-Pedido GENUS (Vendas/Faturamento)"])


def _get_ou_404(db: Session, id: int) -> AuditoriaPrePedido:
    obj = db.query(AuditoriaPrePedido).filter(AuditoriaPrePedido.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Auditoria de pré-pedido (GENUS) não encontrada")
    return obj


@router.get("", response_model=list[auditoria_pre_pedido.AuditoriaPrePedidoOut])
def listar_auditorias_pre_pedido(
    cod_pre_pedido: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    cod_cliente: Optional[int] = Query(None),
    cod_funcionario: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(AuditoriaPrePedido)
    if cod_pre_pedido:
        q = q.filter(AuditoriaPrePedido.cod_pre_pedido == cod_pre_pedido)
    if cod_empresa:
        q = q.filter(AuditoriaPrePedido.cod_empresa == cod_empresa)
    if cod_cliente:
        q = q.filter(AuditoriaPrePedido.cod_cliente == cod_cliente)
    if cod_funcionario:
        q = q.filter(AuditoriaPrePedido.cod_funcionario == cod_funcionario)
    if busca:
        q = q.filter(
            (AuditoriaPrePedido.texto.ilike(f"%{busca}%"))
            | (AuditoriaPrePedido.operacao.ilike(f"%{busca}%"))
            | (AuditoriaPrePedido.lote.ilike(f"%{busca}%"))
        )
    return q.order_by(AuditoriaPrePedido.id.desc()).all()


@router.get("/{id}", response_model=auditoria_pre_pedido.AuditoriaPrePedidoOut)
def buscar_auditoria_pre_pedido(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=auditoria_pre_pedido.AuditoriaPrePedidoOut)
def criar_auditoria_pre_pedido(dados: auditoria_pre_pedido.AuditoriaPrePedidoCreate, db: Session = Depends(get_db)):
    obj = AuditoriaPrePedido(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=auditoria_pre_pedido.AuditoriaPrePedidoOut)
def atualizar_auditoria_pre_pedido(id: int, dados: auditoria_pre_pedido.AuditoriaPrePedidoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_auditoria_pre_pedido(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Auditoria de pré-pedido (GENUS) deletada com sucesso"}

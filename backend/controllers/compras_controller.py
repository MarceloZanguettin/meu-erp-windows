from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import datetime

from database import get_db
from models.tabelas import (
    SolicitacaoCompra, ItemSolicitacao,
    PedidoCompra, ItemPedidoCompra,
    MovimentoEstoque, Produto,
)
from schemas import compras

router = APIRouter(prefix="/compras", tags=["Compras"])


def _get_ou_404(db: Session, model, id: int):
    obj = db.query(model).filter(model.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    return obj


def _proximo_numero_sc(db: Session) -> str:
    resultado = db.query(func.max(SolicitacaoCompra.numero)).scalar()
    if resultado:
        try:
            num = int(resultado.split("-")[-1]) + 1
        except (ValueError, IndexError):
            num = 1
    else:
        num = 1
    return f"SC-{num:04d}"


def _proximo_numero_pc(db: Session) -> str:
    resultado = db.query(func.max(PedidoCompra.numero)).scalar()
    if resultado:
        try:
            num = int(resultado.split("-")[-1]) + 1
        except (ValueError, IndexError):
            num = 1
    else:
        num = 1
    return f"PC-{num:04d}"


# ── Solicitações de Compra ────────────────────────────────────────────────────

@router.get("/solicitacoes", response_model=list[compras.SolicitacaoCompraOut])
def listar_solicitacoes(
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(SolicitacaoCompra)
    if status:
        q = q.filter(SolicitacaoCompra.status == status)
    return q.order_by(SolicitacaoCompra.data.desc()).all()


@router.post("/solicitacoes", response_model=compras.SolicitacaoCompraOut)
def criar_solicitacao(dados: compras.SolicitacaoCompraCreate, db: Session = Depends(get_db)):
    itens_data = dados.itens
    dados_dict = dados.dict(exclude={"itens"})
    dados_dict["numero"] = _proximo_numero_sc(db)

    solicitacao = SolicitacaoCompra(**dados_dict)
    db.add(solicitacao)
    db.flush()  # gera o id sem commit

    for item_data in itens_data:
        item = ItemSolicitacao(**item_data.dict(), solicitacao_id=solicitacao.id)
        db.add(item)

    db.commit()
    db.refresh(solicitacao)
    return solicitacao


@router.put("/solicitacoes/{id}", response_model=compras.SolicitacaoCompraOut)
def atualizar_solicitacao(id: int, dados: compras.SolicitacaoCompraUpdate, db: Session = Depends(get_db)):
    solicitacao = _get_ou_404(db, SolicitacaoCompra, id)

    itens_data = dados.itens
    for campo, valor in dados.dict(exclude_none=True, exclude={"itens"}).items():
        setattr(solicitacao, campo, valor)

    if itens_data is not None:
        # Remove itens antigos e insere os novos
        db.query(ItemSolicitacao).filter(ItemSolicitacao.solicitacao_id == id).delete()
        for item_data in itens_data:
            item = ItemSolicitacao(**item_data.dict(), solicitacao_id=solicitacao.id)
            db.add(item)

    db.commit()
    db.refresh(solicitacao)
    return solicitacao


@router.patch("/solicitacoes/{id}/aprovar", response_model=compras.SolicitacaoCompraOut)
def aprovar_solicitacao(id: int, db: Session = Depends(get_db)):
    solicitacao = _get_ou_404(db, SolicitacaoCompra, id)
    solicitacao.status = "aprovada"
    db.commit()
    db.refresh(solicitacao)
    return solicitacao


@router.delete("/solicitacoes/{id}")
def deletar_solicitacao(id: int, db: Session = Depends(get_db)):
    solicitacao = _get_ou_404(db, SolicitacaoCompra, id)
    db.delete(solicitacao)
    db.commit()
    return {"detail": "Solicitação deletada com sucesso"}


# ── Pedidos de Compra ─────────────────────────────────────────────────────────

@router.get("/pedidos", response_model=list[compras.PedidoCompraOut])
def listar_pedidos_compra(
    status:        Optional[str] = Query(None),
    fornecedor_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(PedidoCompra)
    if status:
        q = q.filter(PedidoCompra.status == status)
    if fornecedor_id:
        q = q.filter(PedidoCompra.fornecedor_id == fornecedor_id)
    pedidos = q.order_by(PedidoCompra.data_emissao.desc()).all()

    resultado = []
    for p in pedidos:
        d = compras.PedidoCompraOut.from_orm(p)
        d.fornecedor_nome = p.fornecedor.nome if p.fornecedor else None
        resultado.append(d)
    return resultado


@router.post("/pedidos", response_model=compras.PedidoCompraOut)
def criar_pedido_compra(dados: compras.PedidoCompraCreate, db: Session = Depends(get_db)):
    itens_data = dados.itens
    dados_dict = dados.dict(exclude={"itens"})
    dados_dict["numero"] = _proximo_numero_pc(db)

    # Calcula total
    total = sum(i.quantidade * i.preco_unitario for i in itens_data)
    dados_dict["total"] = total

    pedido = PedidoCompra(**dados_dict)
    db.add(pedido)
    db.flush()

    for item_data in itens_data:
        item = ItemPedidoCompra(**item_data.dict(), pedido_id=pedido.id)
        db.add(item)

    db.commit()
    db.refresh(pedido)

    resultado = compras.PedidoCompraOut.from_orm(pedido)
    resultado.fornecedor_nome = pedido.fornecedor.nome if pedido.fornecedor else None
    return resultado


@router.put("/pedidos/{id}", response_model=compras.PedidoCompraOut)
def atualizar_pedido_compra(id: int, dados: compras.PedidoCompraUpdate, db: Session = Depends(get_db)):
    pedido = _get_ou_404(db, PedidoCompra, id)

    itens_data = dados.itens
    for campo, valor in dados.dict(exclude_none=True, exclude={"itens"}).items():
        setattr(pedido, campo, valor)

    if itens_data is not None:
        db.query(ItemPedidoCompra).filter(ItemPedidoCompra.pedido_id == id).delete()
        total = 0.0
        for item_data in itens_data:
            item = ItemPedidoCompra(**item_data.dict(), pedido_id=pedido.id)
            db.add(item)
            total += item_data.quantidade * item_data.preco_unitario
        pedido.total = total

    db.commit()
    db.refresh(pedido)

    resultado = compras.PedidoCompraOut.from_orm(pedido)
    resultado.fornecedor_nome = pedido.fornecedor.nome if pedido.fornecedor else None
    return resultado


@router.patch("/pedidos/{id}/receber", response_model=compras.PedidoCompraOut)
def receber_pedido_compra(id: int, db: Session = Depends(get_db)):
    pedido = _get_ou_404(db, PedidoCompra, id)
    pedido.status = "recebido"
    pedido.data_recebimento = datetime.datetime.utcnow()

    # Gera MovimentoEstoque de entrada para cada item
    for item in pedido.itens:
        if item.produto_id:
            movimento = MovimentoEstoque(
                produto_id=item.produto_id,
                tipo="entrada",
                quantidade=item.quantidade,
                custo_unitario=item.preco_unitario,
                documento_ref=pedido.numero,
                observacao=f"Recebimento do pedido de compra {pedido.numero}",
            )
            db.add(movimento)

            produto = db.query(Produto).filter(Produto.id == item.produto_id).first()
            if produto:
                produto.estoque = (produto.estoque or 0) + item.quantidade

        item.quantidade_recebida = item.quantidade

    db.commit()
    db.refresh(pedido)

    resultado = compras.PedidoCompraOut.from_orm(pedido)
    resultado.fornecedor_nome = pedido.fornecedor.nome if pedido.fornecedor else None
    return resultado


@router.delete("/pedidos/{id}")
def deletar_pedido_compra(id: int, db: Session = Depends(get_db)):
    pedido = _get_ou_404(db, PedidoCompra, id)
    db.delete(pedido)
    db.commit()
    return {"detail": "Pedido de compra deletado com sucesso"}

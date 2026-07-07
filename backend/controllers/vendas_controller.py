from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import datetime

from database import get_db
from models.tabelas import (
    Orcamento, ItemOrcamento,
    PedidoVenda, ItemPedidoVenda,
    MovimentoEstoque, Produto,
)
from schemas import vendas

router = APIRouter(prefix="/vendas", tags=["Vendas"])


def _get_ou_404(db: Session, model, id: int):
    obj = db.query(model).filter(model.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    return obj


def _proximo_numero_orc(db: Session) -> str:
    resultado = db.query(func.max(Orcamento.numero)).scalar()
    if resultado:
        try:
            num = int(resultado.split("-")[-1]) + 1
        except (ValueError, IndexError):
            num = 1
    else:
        num = 1
    return f"ORC-{num:04d}"


def _proximo_numero_pv(db: Session) -> str:
    resultado = db.query(func.max(PedidoVenda.numero)).scalar()
    if resultado:
        try:
            num = int(resultado.split("-")[-1]) + 1
        except (ValueError, IndexError):
            num = 1
    else:
        num = 1
    return f"PV-{num:04d}"


def _calcular_total_orcamento(itens_data) -> float:
    total = 0.0
    for item in itens_data:
        subtotal = item.quantidade * item.preco_unitario
        desconto = subtotal * (item.desconto_percentual or 0.0) / 100
        total += subtotal - desconto
    return total


# ── Orçamentos ────────────────────────────────────────────────────────────────

@router.get("/orcamentos", response_model=list[vendas.OrcamentoOut])
def listar_orcamentos(
    status: Optional[str] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Orcamento)
    if status:
        q = q.filter(Orcamento.status == status)
    if busca:
        q = q.filter(
            Orcamento.numero.ilike(f"%{busca}%")
            | Orcamento.nome_cliente.ilike(f"%{busca}%")
        )
    return q.order_by(Orcamento.data_emissao.desc()).all()


@router.get("/orcamentos/{id}", response_model=vendas.OrcamentoOut)
def buscar_orcamento(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, Orcamento, id)


@router.post("/orcamentos", response_model=vendas.OrcamentoOut)
def criar_orcamento(dados: vendas.OrcamentoCreate, db: Session = Depends(get_db)):
    itens_data = dados.itens
    dados_dict = dados.dict(exclude={"itens"})
    dados_dict["numero"] = _proximo_numero_orc(db)
    dados_dict["total"] = _calcular_total_orcamento(itens_data)

    orcamento = Orcamento(**dados_dict)
    db.add(orcamento)
    db.flush()

    for item_data in itens_data:
        item = ItemOrcamento(**item_data.dict(), orcamento_id=orcamento.id)
        db.add(item)

    db.commit()
    db.refresh(orcamento)
    return orcamento


@router.put("/orcamentos/{id}", response_model=vendas.OrcamentoOut)
def atualizar_orcamento(id: int, dados: vendas.OrcamentoUpdate, db: Session = Depends(get_db)):
    orcamento = _get_ou_404(db, Orcamento, id)

    itens_data = dados.itens
    for campo, valor in dados.dict(exclude_none=True, exclude={"itens"}).items():
        setattr(orcamento, campo, valor)

    if itens_data is not None:
        db.query(ItemOrcamento).filter(ItemOrcamento.orcamento_id == id).delete()
        for item_data in itens_data:
            item = ItemOrcamento(**item_data.dict(), orcamento_id=orcamento.id)
            db.add(item)
        orcamento.total = _calcular_total_orcamento(itens_data)

    db.commit()
    db.refresh(orcamento)
    return orcamento


@router.patch("/orcamentos/{id}/aprovar", response_model=vendas.OrcamentoOut)
def aprovar_orcamento(id: int, db: Session = Depends(get_db)):
    orcamento = _get_ou_404(db, Orcamento, id)
    orcamento.status = "aprovado"
    db.commit()
    db.refresh(orcamento)
    return orcamento


@router.patch("/orcamentos/{id}/converter", response_model=vendas.PedidoVendaOut)
def converter_orcamento(id: int, db: Session = Depends(get_db)):
    orcamento = _get_ou_404(db, Orcamento, id)

    # Cria PedidoVenda com base no orçamento
    pedido = PedidoVenda(
        numero=_proximo_numero_pv(db),
        orcamento_id=orcamento.id,
        cliente_id=orcamento.cliente_id,
        nome_cliente=orcamento.nome_cliente,
        forma_pagamento_id=orcamento.forma_pagamento_id,
        representante_id=orcamento.representante_id,
        desconto_percentual=orcamento.desconto_percentual,
        total=orcamento.total,
        observacao=orcamento.observacao,
        status="aberto",
    )
    db.add(pedido)
    db.flush()

    for item_orc in orcamento.itens:
        item_pv = ItemPedidoVenda(
            pedido_id=pedido.id,
            produto_id=item_orc.produto_id,
            descricao=item_orc.descricao,
            quantidade=item_orc.quantidade,
            preco_unitario=item_orc.preco_unitario,
            desconto_percentual=item_orc.desconto_percentual,
            unidade=item_orc.unidade,
        )
        db.add(item_pv)

    orcamento.status = "convertido"
    db.commit()
    db.refresh(pedido)
    return pedido


@router.delete("/orcamentos/{id}")
def deletar_orcamento(id: int, db: Session = Depends(get_db)):
    orcamento = _get_ou_404(db, Orcamento, id)
    db.delete(orcamento)
    db.commit()
    return {"detail": "Orçamento deletado com sucesso"}


# ── Pedidos de Venda ──────────────────────────────────────────────────────────

@router.get("/pedidos", response_model=list[vendas.PedidoVendaOut])
def listar_pedidos_venda(
    status:     Optional[str] = Query(None),
    cliente_id: Optional[int] = Query(None),
    data_inicio: Optional[str] = Query(None),
    data_fim:    Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(PedidoVenda)
    if status:
        q = q.filter(PedidoVenda.status == status)
    if cliente_id:
        q = q.filter(PedidoVenda.cliente_id == cliente_id)
    if data_inicio:
        q = q.filter(PedidoVenda.data_emissao >= datetime.datetime.fromisoformat(data_inicio))
    if data_fim:
        q = q.filter(PedidoVenda.data_emissao <= datetime.datetime.fromisoformat(data_fim + "T23:59:59"))
    return q.order_by(PedidoVenda.data_emissao.desc()).all()


@router.post("/pedidos", response_model=vendas.PedidoVendaOut)
def criar_pedido_venda(dados: vendas.PedidoVendaCreate, db: Session = Depends(get_db)):
    itens_data = dados.itens
    dados_dict = dados.dict(exclude={"itens"})
    dados_dict["numero"] = _proximo_numero_pv(db)
    dados_dict["total"] = _calcular_total_orcamento(itens_data)

    pedido = PedidoVenda(**dados_dict)
    db.add(pedido)
    db.flush()

    for item_data in itens_data:
        item = ItemPedidoVenda(**item_data.dict(), pedido_id=pedido.id)
        db.add(item)

    db.commit()
    db.refresh(pedido)
    return pedido


@router.put("/pedidos/{id}", response_model=vendas.PedidoVendaOut)
def atualizar_pedido_venda(id: int, dados: vendas.PedidoVendaUpdate, db: Session = Depends(get_db)):
    pedido = _get_ou_404(db, PedidoVenda, id)

    itens_data = dados.itens
    for campo, valor in dados.dict(exclude_none=True, exclude={"itens"}).items():
        setattr(pedido, campo, valor)

    if itens_data is not None:
        db.query(ItemPedidoVenda).filter(ItemPedidoVenda.pedido_id == id).delete()
        for item_data in itens_data:
            item = ItemPedidoVenda(**item_data.dict(), pedido_id=pedido.id)
            db.add(item)
        pedido.total = _calcular_total_orcamento(itens_data)

    db.commit()
    db.refresh(pedido)
    return pedido


@router.patch("/pedidos/{id}/faturar", response_model=vendas.PedidoVendaOut)
def faturar_pedido_venda(id: int, db: Session = Depends(get_db)):
    pedido = _get_ou_404(db, PedidoVenda, id)
    pedido.status = "faturado"
    pedido.data_faturamento = datetime.datetime.utcnow()

    # Gera MovimentoEstoque de saída para cada item
    for item in pedido.itens:
        if item.produto_id:
            movimento = MovimentoEstoque(
                produto_id=item.produto_id,
                tipo="saida",
                quantidade=item.quantidade,
                documento_ref=pedido.numero,
                observacao=f"Faturamento do pedido de venda {pedido.numero}",
            )
            db.add(movimento)

            produto = db.query(Produto).filter(Produto.id == item.produto_id).first()
            if produto:
                produto.estoque = (produto.estoque or 0) - item.quantidade

    db.commit()
    db.refresh(pedido)
    return pedido


@router.delete("/pedidos/{id}")
def deletar_pedido_venda(id: int, db: Session = Depends(get_db)):
    pedido = _get_ou_404(db, PedidoVenda, id)
    db.delete(pedido)
    db.commit()
    return {"detail": "Pedido de venda deletado com sucesso"}

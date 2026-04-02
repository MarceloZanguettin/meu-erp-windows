from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Solicitação de Compra ─────────────────────────────────────────────────────

class ItemSolicitacaoCreate(BaseModel):
    produto_id: Optional[int] = None
    descricao: str
    quantidade: float
    unidade: Optional[str] = None


class ItemSolicitacaoOut(BaseModel):
    id: int
    solicitacao_id: int
    produto_id: Optional[int]
    descricao: str
    quantidade: float
    unidade: Optional[str]

    class Config:
        from_attributes = True


class SolicitacaoCompraCreate(BaseModel):
    solicitante: Optional[str] = None
    centro_custo_id: Optional[int] = None
    observacao: Optional[str] = None
    itens: List[ItemSolicitacaoCreate] = []


class SolicitacaoCompraUpdate(BaseModel):
    solicitante: Optional[str] = None
    centro_custo_id: Optional[int] = None
    status: Optional[str] = None
    observacao: Optional[str] = None
    itens: Optional[List[ItemSolicitacaoCreate]] = None


class SolicitacaoCompraOut(BaseModel):
    id: int
    numero: str
    data: datetime
    solicitante: Optional[str]
    centro_custo_id: Optional[int]
    status: str
    observacao: Optional[str]
    itens: List[ItemSolicitacaoOut] = []

    class Config:
        from_attributes = True


# ── Pedido de Compra ──────────────────────────────────────────────────────────

class ItemPedidoCompraCreate(BaseModel):
    produto_id: Optional[int] = None
    descricao: str
    quantidade: float
    preco_unitario: float
    unidade: Optional[str] = None


class ItemPedidoCompraOut(BaseModel):
    id: int
    pedido_id: int
    produto_id: Optional[int]
    descricao: str
    quantidade: float
    quantidade_recebida: float
    preco_unitario: float
    unidade: Optional[str]

    class Config:
        from_attributes = True


class PedidoCompraCreate(BaseModel):
    fornecedor_id: int
    data_entrega_prevista: Optional[datetime] = None
    forma_pagamento_id: Optional[int] = None
    observacao: Optional[str] = None
    itens: List[ItemPedidoCompraCreate] = []


class PedidoCompraUpdate(BaseModel):
    fornecedor_id: Optional[int] = None
    data_entrega_prevista: Optional[datetime] = None
    forma_pagamento_id: Optional[int] = None
    status: Optional[str] = None
    observacao: Optional[str] = None
    itens: Optional[List[ItemPedidoCompraCreate]] = None


class PedidoCompraOut(BaseModel):
    id: int
    numero: str
    fornecedor_id: int
    fornecedor_nome: Optional[str] = None
    data_emissao: datetime
    data_entrega_prevista: Optional[datetime]
    data_recebimento: Optional[datetime]
    status: str
    forma_pagamento_id: Optional[int]
    total: float
    observacao: Optional[str]
    itens: List[ItemPedidoCompraOut] = []

    class Config:
        from_attributes = True

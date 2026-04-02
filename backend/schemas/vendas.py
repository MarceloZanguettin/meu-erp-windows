from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Orçamento ─────────────────────────────────────────────────────────────────

class ItemOrcamentoCreate(BaseModel):
    produto_id: Optional[int] = None
    descricao: str
    quantidade: float
    preco_unitario: float
    desconto_percentual: Optional[float] = 0.0
    unidade: Optional[str] = None


class ItemOrcamentoOut(BaseModel):
    id: int
    orcamento_id: int
    produto_id: Optional[int]
    descricao: str
    quantidade: float
    preco_unitario: float
    desconto_percentual: float
    unidade: Optional[str]

    class Config:
        from_attributes = True


class OrcamentoCreate(BaseModel):
    cliente_id: Optional[int] = None
    nome_cliente: Optional[str] = None
    data_validade: Optional[datetime] = None
    forma_pagamento_id: Optional[int] = None
    representante_id: Optional[int] = None
    desconto_percentual: Optional[float] = 0.0
    observacao: Optional[str] = None
    itens: List[ItemOrcamentoCreate] = []


class OrcamentoUpdate(BaseModel):
    cliente_id: Optional[int] = None
    nome_cliente: Optional[str] = None
    data_validade: Optional[datetime] = None
    status: Optional[str] = None
    forma_pagamento_id: Optional[int] = None
    representante_id: Optional[int] = None
    desconto_percentual: Optional[float] = None
    observacao: Optional[str] = None
    itens: Optional[List[ItemOrcamentoCreate]] = None


class OrcamentoOut(BaseModel):
    id: int
    numero: str
    cliente_id: Optional[int]
    nome_cliente: Optional[str]
    data_emissao: datetime
    data_validade: Optional[datetime]
    status: str
    forma_pagamento_id: Optional[int]
    representante_id: Optional[int]
    desconto_percentual: float
    total: float
    observacao: Optional[str]
    itens: List[ItemOrcamentoOut] = []

    class Config:
        from_attributes = True


# ── Pedido de Venda ───────────────────────────────────────────────────────────

class ItemPedidoVendaCreate(BaseModel):
    produto_id: Optional[int] = None
    descricao: str
    quantidade: float
    preco_unitario: float
    desconto_percentual: Optional[float] = 0.0
    unidade: Optional[str] = None


class ItemPedidoVendaOut(BaseModel):
    id: int
    pedido_id: int
    produto_id: Optional[int]
    descricao: str
    quantidade: float
    preco_unitario: float
    desconto_percentual: float
    unidade: Optional[str]

    class Config:
        from_attributes = True


class PedidoVendaCreate(BaseModel):
    orcamento_id: Optional[int] = None
    cliente_id: Optional[int] = None
    nome_cliente: Optional[str] = None
    data_entrega_prevista: Optional[datetime] = None
    forma_pagamento_id: Optional[int] = None
    representante_id: Optional[int] = None
    transportadora_id: Optional[int] = None
    desconto_percentual: Optional[float] = 0.0
    observacao: Optional[str] = None
    itens: List[ItemPedidoVendaCreate] = []


class PedidoVendaUpdate(BaseModel):
    cliente_id: Optional[int] = None
    nome_cliente: Optional[str] = None
    data_entrega_prevista: Optional[datetime] = None
    status: Optional[str] = None
    forma_pagamento_id: Optional[int] = None
    representante_id: Optional[int] = None
    transportadora_id: Optional[int] = None
    desconto_percentual: Optional[float] = None
    observacao: Optional[str] = None
    itens: Optional[List[ItemPedidoVendaCreate]] = None


class PedidoVendaOut(BaseModel):
    id: int
    numero: str
    orcamento_id: Optional[int]
    cliente_id: Optional[int]
    nome_cliente: Optional[str]
    data_emissao: datetime
    data_entrega_prevista: Optional[datetime]
    data_faturamento: Optional[datetime]
    status: str
    forma_pagamento_id: Optional[int]
    representante_id: Optional[int]
    transportadora_id: Optional[int]
    desconto_percentual: float
    total: float
    observacao: Optional[str]
    itens: List[ItemPedidoVendaOut] = []

    class Config:
        from_attributes = True

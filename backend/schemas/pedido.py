from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from .produto import Produto

class ItemPedido(BaseModel):
    produto_id: int
    quantidade: int = Field(..., gt=0) # Quantidade deve ser maior que 0
    preco_unitario: float

class Pedido(BaseModel):
    id: Optional[int] = None
    cliente_id: int
    data: datetime = Field(default_factory=datetime.now)
    itens: list[ItemPedido]
    total: float
    status: str = "Pendente" # Pendente, Pago, Cancelado
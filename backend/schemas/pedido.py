from pydantic import BaseModel
from datetime import datetime
from .produto import Produto

class ItemPedido(BaseModel):
    produto_id: str
    quantidade: int
    preco_unitario: float

class Pedido(BaseModel):
    id: Optional[str] = None
    cliente_id: str
    data: datetime = Field(default_factory=datetime.now)
    itens: list[ItemPedido]
    total: float
    status: str = "Pendente" # Pendente, Pago, Cancelado
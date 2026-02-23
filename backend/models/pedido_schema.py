from pydantic import BaseModel, Field
from typing import List

class ItemPedidoCreate(BaseModel):
    produto_id: int
    quantidade: int = Field(..., gt=0) # Quantidade deve ser maior que 0

class PedidoCreate(BaseModel):
    cliente_id: int
    itens: List[ItemPedidoCreate]
from pydantic import BaseModel
from typing import Optional


class PedidoNotaCreate(BaseModel):
    # Vínculo com o pedido de venda e a saída/nota fiscal já migrados neste ERP
    pedido_id: Optional[int] = None
    saida_id: Optional[int] = None

    # Campos migrados de GENUS.PEDIDONOTA
    cod_empresa: Optional[int] = None
    cod_pedido: Optional[int] = None
    cod_saida: Optional[int] = None
    cod_empresa_saida: Optional[int] = None


class PedidoNotaUpdate(PedidoNotaCreate):
    pass


class PedidoNotaOut(PedidoNotaCreate):
    id: int

    class Config:
        from_attributes = True

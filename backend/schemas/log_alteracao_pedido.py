from pydantic import BaseModel
from typing import Optional


class LogAlteracaoPedidoCreate(BaseModel):
    # Vínculo com o pedido de venda já migrado neste ERP
    pedido_id: Optional[int] = None

    # Campos migrados de GENUS.LOGALTERACAOPEDIDO
    cod_empresa: Optional[int] = None
    cod_pedido: Optional[int] = None
    status_novo: Optional[str] = None
    cod_funcionario_logado: Optional[int] = None
    data_alteracao: Optional[str] = None
    hora_alteracao: Optional[str] = None
    origem_alteracao: Optional[str] = None


class LogAlteracaoPedidoUpdate(LogAlteracaoPedidoCreate):
    pass


class LogAlteracaoPedidoOut(LogAlteracaoPedidoCreate):
    id: int

    class Config:
        from_attributes = True

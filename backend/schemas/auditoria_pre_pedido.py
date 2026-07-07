from pydantic import BaseModel
from typing import Optional
import datetime


class AuditoriaPrePedidoCreate(BaseModel):
    # Vínculos com cadastros já migrados neste ERP
    produto_id: Optional[int] = None
    produto_producao_id: Optional[int] = None

    # Campos migrados de GENUS.AUDITORIA_PREPEDIDO
    codigo: Optional[int] = None
    cod_funcionario: Optional[int] = None
    data: Optional[datetime.datetime] = None
    hora: Optional[str] = None
    texto: Optional[str] = None
    cod_empresa: Optional[int] = None
    cod_pre_pedido: Optional[int] = None
    cod_produto: Optional[str] = None
    doc: Optional[int] = None
    emissao_doc: Optional[datetime.datetime] = None
    cod_cliente: Optional[int] = None
    cod_produto_producao: Optional[int] = None
    lote: Optional[str] = None
    operacao: Optional[str] = None


class AuditoriaPrePedidoUpdate(AuditoriaPrePedidoCreate):
    pass


class AuditoriaPrePedidoOut(AuditoriaPrePedidoCreate):
    id: int

    class Config:
        from_attributes = True

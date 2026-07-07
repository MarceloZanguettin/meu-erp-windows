from pydantic import BaseModel
from typing import Optional


class CompraEntradaCreate(BaseModel):
    # Vínculo com a entrada (nota fiscal) e a compra já migradas neste ERP
    entrada_id: Optional[int] = None
    compra_id: Optional[int] = None

    # Campos migrados de GENUS.COMPRAENTRADA
    cod_empresa: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_fornecedor: Optional[int] = None
    cod_compras: Optional[int] = None


class CompraEntradaUpdate(CompraEntradaCreate):
    pass


class CompraEntradaOut(CompraEntradaCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional


class ItemCompraCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Vínculo com o cabeçalho de compra já migrado (ver model CompraGenus)
    compra_id: Optional[int] = None

    # Identificação / chave bruta do documento de compra (mirror — ver compra_id acima)
    cod_compras: Optional[int] = None
    cod_produto: Optional[str] = None
    cod_empresa: Optional[int] = None
    lote_produto: Optional[str] = None

    # Quantidades / valores comerciais
    unitario: Optional[float] = None
    custo_real: Optional[float] = None
    desconto: Optional[float] = None
    outros_valores: Optional[float] = None
    taxa_fornecedor: Optional[float] = None
    total: Optional[float] = None
    qtde: Optional[float] = None
    cpr: Optional[float] = None

    # Unidades / conversões
    kgmt: Optional[float] = None
    kgmt_total: Optional[float] = None
    unde: Optional[float] = None

    # Fiscal
    ipi: Optional[float] = None
    ipi_valor: Optional[float] = None
    st: Optional[float] = None

    # Observação
    obs: Optional[str] = None


class ItemCompraUpdate(ItemCompraCreate):
    pass


class ItemCompraOut(ItemCompraCreate):
    id: int

    class Config:
        from_attributes = True

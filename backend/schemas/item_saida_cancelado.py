from pydantic import BaseModel
from typing import Optional


class ItemSaidaCanceladoCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado (1:N, ver docstring do model)
    produto_id: Optional[int] = None

    # Identificação / chave original da linha e da saída (PK composta no GENUS, sem FK)
    cod_empresa: Optional[int] = None
    cod_saida: Optional[int] = None
    cod_produto: Optional[str] = None
    cod_sailan: Optional[int] = None

    # Quantidades / valores comerciais
    qtde: Optional[float] = None
    unitario: Optional[float] = None
    total: Optional[float] = None
    desconto: Optional[float] = None
    per_desconto: Optional[float] = None
    frete: Optional[float] = None
    retirar: Optional[str] = None
    estoque_cli: Optional[str] = None

    # Comissão
    perc_comissao: Optional[float] = None
    cal_comissao: Optional[float] = None
    val_comissao: Optional[float] = None

    # Fiscal: ICMS / IPI / CFOP
    entrada_saida: Optional[str] = None
    cod_cfop: Optional[str] = None
    aliq_icms: Optional[str] = None
    icms: Optional[float] = None
    reducao_icms: Optional[float] = None
    iva: Optional[float] = None
    ipi: Optional[float] = None


class ItemSaidaCanceladoUpdate(BaseModel):
    produto_id: Optional[int] = None

    cod_empresa: Optional[int] = None
    cod_saida: Optional[int] = None
    cod_produto: Optional[str] = None
    cod_sailan: Optional[int] = None

    qtde: Optional[float] = None
    unitario: Optional[float] = None
    total: Optional[float] = None
    desconto: Optional[float] = None
    per_desconto: Optional[float] = None
    frete: Optional[float] = None
    retirar: Optional[str] = None
    estoque_cli: Optional[str] = None

    perc_comissao: Optional[float] = None
    cal_comissao: Optional[float] = None
    val_comissao: Optional[float] = None

    entrada_saida: Optional[str] = None
    cod_cfop: Optional[str] = None
    aliq_icms: Optional[str] = None
    icms: Optional[float] = None
    reducao_icms: Optional[float] = None
    iva: Optional[float] = None
    ipi: Optional[float] = None


class ItemSaidaCanceladoOut(ItemSaidaCanceladoCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional


class CotacaoItensCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Vínculo com o cabeçalho da cotação de preço já migrado (ver model CotacaoPreco)
    cotacao_preco_id: Optional[int] = None

    # Identificação / chave bruta original (PK composta no GENUS: CODIGO + CODCOTACAOPRECO)
    codigo: Optional[int] = None
    cod_cotacao_preco: Optional[int] = None
    cod_produto: Optional[str] = None
    cod_fornecedor: Optional[int] = None

    # Valores comerciais da proposta cotada
    preco: Optional[float] = None
    frete: Optional[float] = None
    st: Optional[float] = None
    ipi: Optional[float] = None
    total: Optional[float] = None
    cpr: Optional[float] = None
    outros_valores: Optional[float] = None
    unitario: Optional[float] = None

    # Observação
    obs: Optional[str] = None


class CotacaoItensUpdate(CotacaoItensCreate):
    pass


class CotacaoItensOut(CotacaoItensCreate):
    id: int

    class Config:
        from_attributes = True

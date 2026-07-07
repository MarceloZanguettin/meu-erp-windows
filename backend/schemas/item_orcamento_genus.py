from pydantic import BaseModel
from typing import Optional


class ItemOrcamentoGenusCreate(BaseModel):
    # Vínculos com cadastros já migrados neste ERP
    orcamento_id: Optional[int] = None
    produto_id: Optional[int] = None

    # Identificação / chave original da linha e do orçamento (GENUS.ORCAMENTO2)
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None
    cod_orcamento: Optional[int] = None
    cod_produto: Optional[str] = None
    descricao_produto: Optional[str] = None

    # Quantidades / valores comerciais
    qtde: Optional[float] = None
    unitario: Optional[float] = None
    custo: Optional[float] = None
    desconto: Optional[float] = None
    per_desconto: Optional[float] = None
    frete: Optional[float] = None
    total: Optional[float] = None
    ipi: Optional[float] = None
    observacao: Optional[str] = None


class ItemOrcamentoGenusUpdate(ItemOrcamentoGenusCreate):
    pass


class ItemOrcamentoGenusOut(ItemOrcamentoGenusCreate):
    id: int

    class Config:
        from_attributes = True

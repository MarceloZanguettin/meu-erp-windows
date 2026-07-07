from pydantic import BaseModel
from typing import Optional


class ItemPedidoLanCreate(BaseModel):
    # Vínculos com cadastros já migrados neste ERP
    pedido_id: Optional[int] = None
    produto_id: Optional[int] = None

    # Identificação / chave original da linha e do pedido (GENUS.PEDIDOLAN)
    cod_empresa: Optional[int] = None
    cod_pedido: Optional[int] = None
    cod_produto: Optional[str] = None
    lote_produto: Optional[str] = None
    num_item: Optional[str] = None
    unidade: Optional[str] = None
    pai_filho: Optional[str] = None

    # Quantidades / valores comerciais
    qtde: Optional[float] = None
    qtde_embal: Optional[float] = None
    qtde_controle: Optional[float] = None
    qtde_fisico: Optional[float] = None
    qtde_faturado: Optional[float] = None
    fat_parcial_qtde_fisico: Optional[float] = None
    diferenca: Optional[float] = None
    unitario: Optional[float] = None
    total: Optional[float] = None
    custo_atual: Optional[float] = None
    desconto: Optional[float] = None
    per_desconto: Optional[float] = None
    frete: Optional[float] = None
    outras: Optional[float] = None
    comissao_item: Optional[float] = None
    fechado: Optional[float] = None

    # Fiscal: ICMS / ICMS-ST
    cst: Optional[str] = None
    csosn: Optional[str] = None
    cod_cfop: Optional[str] = None
    aliq_icms: Optional[str] = None
    icms: Optional[float] = None
    icms_base: Optional[float] = None
    icms_valor: Optional[float] = None
    icms_outras: Optional[float] = None
    icms_isento: Optional[float] = None
    reducao_icms: Optional[float] = None
    iva: Optional[float] = None
    icmsst: Optional[float] = None
    reducao_icmsst: Optional[float] = None
    icms_base_subst: Optional[float] = None
    icms_valor_subst: Optional[float] = None
    icms_fcp: Optional[float] = None
    cenq: Optional[str] = None

    # Fiscal: IPI
    ipi: Optional[float] = None
    ipi_cst: Optional[str] = None
    ipi_valor: Optional[float] = None
    ipi_base_calculo: Optional[float] = None

    # Fiscal: PIS / COFINS
    pis_cst: Optional[str] = None
    pis_valor: Optional[float] = None
    pis_base: Optional[float] = None
    pis_aliquota: Optional[float] = None
    quantidade_pis: Optional[float] = None
    aliq_pis_reais: Optional[float] = None
    cofins_cst: Optional[str] = None
    cofins_valor: Optional[float] = None
    cofins_base: Optional[float] = None
    cofins_aliquota: Optional[float] = None
    quantidade_cofins: Optional[float] = None
    aliq_cofins_reais: Optional[float] = None

    # Referências / classificação (códigos brutos, tabelas mestre ainda sem model)
    cod_romaneio: Optional[int] = None
    cod_tipo_estampa: Optional[int] = None
    cod_decreto: Optional[int] = None
    estoque_reservado_tipo: Optional[str] = None

    # Observação
    obs_produto: Optional[str] = None


class ItemPedidoLanUpdate(ItemPedidoLanCreate):
    pass


class ItemPedidoLanOut(ItemPedidoLanCreate):
    id: int

    class Config:
        from_attributes = True

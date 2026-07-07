from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ItemSaidaExcluidoCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado (1:N, ver docstring do model)
    produto_id: Optional[int] = None

    # Identificação / chave original da linha e da saída (sem PK/FK no GENUS)
    cod_empresa: Optional[int] = None
    cod_saida: Optional[int] = None
    cod_produto: Optional[str] = None
    lote_produto: Optional[str] = None

    # Quantidades / valores comerciais
    qtde: Optional[float] = None
    unitario: Optional[float] = None
    total: Optional[float] = None
    custo: Optional[float] = None
    desconto: Optional[float] = None
    per_desconto: Optional[float] = None
    frete: Optional[float] = None
    seguro: Optional[float] = None
    outras: Optional[float] = None
    retirar: Optional[str] = None
    estoque_cli: Optional[str] = None

    # Comissão
    perc_comissao: Optional[float] = None
    cal_comissao: Optional[float] = None
    val_comissao: Optional[float] = None

    # Fiscal: ICMS / ICMS-ST
    entrada_saida: Optional[str] = None
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
    reduzir_base_st: Optional[str] = None

    # Fiscal: IPI
    ipi: Optional[float] = None
    ipi_cst: Optional[str] = None
    ipi_valor: Optional[float] = None
    ipi_base_calculo: Optional[float] = None
    calcula_ipi_base: Optional[str] = None

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

    # Referências (código bruto, tabela mestre ainda sem model dedicado)
    cod_romaneio: Optional[int] = None

    # Observação
    obs_produto: Optional[str] = None

    # Auditoria da exclusão
    dt_exclusao: Optional[datetime] = None


class ItemSaidaExcluidoUpdate(BaseModel):
    produto_id: Optional[int] = None

    cod_empresa: Optional[int] = None
    cod_saida: Optional[int] = None
    cod_produto: Optional[str] = None
    lote_produto: Optional[str] = None

    qtde: Optional[float] = None
    unitario: Optional[float] = None
    total: Optional[float] = None
    custo: Optional[float] = None
    desconto: Optional[float] = None
    per_desconto: Optional[float] = None
    frete: Optional[float] = None
    seguro: Optional[float] = None
    outras: Optional[float] = None
    retirar: Optional[str] = None
    estoque_cli: Optional[str] = None

    perc_comissao: Optional[float] = None
    cal_comissao: Optional[float] = None
    val_comissao: Optional[float] = None

    entrada_saida: Optional[str] = None
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
    reduzir_base_st: Optional[str] = None

    ipi: Optional[float] = None
    ipi_cst: Optional[str] = None
    ipi_valor: Optional[float] = None
    ipi_base_calculo: Optional[float] = None
    calcula_ipi_base: Optional[str] = None

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

    cod_romaneio: Optional[int] = None

    obs_produto: Optional[str] = None

    dt_exclusao: Optional[datetime] = None


class ItemSaidaExcluidoOut(ItemSaidaExcluidoCreate):
    id: int

    class Config:
        from_attributes = True

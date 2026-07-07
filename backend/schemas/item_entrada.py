from pydantic import BaseModel
from typing import Optional


class ItemEntradaCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Vínculo com o cabeçalho de entrada já migrado (ver model Entrada)
    entrada_id: Optional[int] = None

    # Identificação / chave bruta do documento de entrada (mirror — ver entrada_id acima)
    cod_empresa: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_fornecedor: Optional[int] = None
    cod_produto: Optional[str] = None
    lote_produto: Optional[str] = None
    nitem_fornec: Optional[int] = None

    # Quantidades / valores comerciais
    unitario: Optional[float] = None
    total: Optional[float] = None
    qtde: Optional[float] = None
    qtde_estq: Optional[float] = None
    frete: Optional[float] = None
    retirar: Optional[str] = None
    perc_a_prazo: Optional[float] = None
    vl_venda: Optional[float] = None
    taxa_fornecedor: Optional[float] = None
    credito_fornecedor: Optional[float] = None
    cpr: Optional[float] = None

    # Custos
    custo_item: Optional[float] = None
    custo_real: Optional[float] = None
    preco_custo: Optional[float] = None
    outros_custo: Optional[float] = None
    icms_custo: Optional[float] = None

    # Referências / vínculo com empresa não fiscal e saída vinculada (devolução)
    cod_empresa_nao_fiscal: Optional[int] = None
    cod_saida_vinculada: Optional[int] = None
    cod_empresa_saida_vinculada: Optional[int] = None
    doc_saida_vinculada: Optional[int] = None

    # Fiscal: ICMS / ICMS-ST
    cf: Optional[str] = None
    fiscal: Optional[str] = None
    cod_cfop: Optional[str] = None
    tipo_imposto: Optional[str] = None
    csosn: Optional[str] = None
    cenq: Optional[str] = None
    icms: Optional[float] = None
    iva: Optional[float] = None
    iva_reajusta: Optional[str] = None
    icms_valor: Optional[float] = None
    icms_base_calculo: Optional[float] = None
    icms_reducao: Optional[float] = None
    icms_isento: Optional[float] = None
    icms_outras: Optional[float] = None
    icms_percentual_st: Optional[float] = None
    icms_reducao_st: Optional[float] = None
    icms_subst_tributaria: Optional[float] = None
    icms_base_subst_tributaria: Optional[float] = None

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

    # Reforma Tributária: IBS/CBS gerais do item
    reforma_cst_ibscbs: Optional[str] = None
    reforma_cclasstrib: Optional[str] = None
    reforma_vbc_ibscbs: Optional[float] = None
    reforma_vitem: Optional[float] = None

    # Reforma Tributária: IBS-UF
    reforma_pibsuf_ibsuf: Optional[float] = None
    reforma_pdif_ibsuf: Optional[float] = None
    reforma_vdif_ibsuf: Optional[float] = None
    reforma_vdevtrib_ibsuf: Optional[float] = None
    reforma_predaliq_ibsuf: Optional[float] = None
    reforma_paliqefet_ibsuf: Optional[float] = None
    reforma_vibsuf_ibsuf: Optional[float] = None
    reforma_paliqefetregibsuf: Optional[float] = None
    reforma_vtribregibsuf: Optional[float] = None
    reforma_vtribibsuf_gov: Optional[float] = None
    reforma_vibs_transfcred: Optional[float] = None

    # Reforma Tributária: IBS-Município
    reforma_pibsmun_ibsmun: Optional[float] = None
    reforma_pdif_ibsmun: Optional[float] = None
    reforma_vdif_ibsmun: Optional[float] = None
    reforma_vdevtrib_ibsmun: Optional[float] = None
    reforma_predaliq_ibsmun: Optional[float] = None
    reforma_paliqefet_ibsmun: Optional[float] = None
    reforma_vibsmun_ibsmun: Optional[float] = None
    reforma_paliqefetregibsmun: Optional[float] = None
    reforma_vtribregibsmun: Optional[float] = None
    reforma_vtribibsmun_gov: Optional[float] = None

    # Reforma Tributária: IBS total
    reforma_vibs: Optional[float] = None

    # Reforma Tributária: CBS
    reforma_pcbs_cbs: Optional[float] = None
    reforma_pdif_cbs: Optional[float] = None
    reforma_vdif_cbs: Optional[float] = None
    reforma_vdevtrib_cbs: Optional[float] = None
    reforma_predaliq_cbs: Optional[float] = None
    reforma_paliqefet_cbs: Optional[float] = None
    reforma_vcbs_cbs: Optional[float] = None
    reforma_paliqefetregcbs: Optional[float] = None
    reforma_vtribregcbs: Optional[float] = None
    reforma_vtribcbs_gov: Optional[float] = None
    reforma_vcbs_transfcred: Optional[float] = None

    # Reforma Tributária: registro especial (regime regional)
    reforma_cstreg: Optional[str] = None
    reforma_cclasstribreg: Optional[str] = None

    # Reforma Tributária: crédito presumido IBS/CBS
    reforma_ccredpres_ibs: Optional[str] = None
    reforma_pcredpres_ibs: Optional[float] = None
    reforma_vcredpres_ibs: Optional[float] = None
    reforma_vcredprescondsus_ibs: Optional[float] = None
    reforma_ccredpres_cbs: Optional[str] = None
    reforma_pcredpres_cbs: Optional[float] = None
    reforma_vcredpres_cbs: Optional[float] = None
    reforma_vcredprescondsus_cbs: Optional[float] = None


class ItemEntradaUpdate(ItemEntradaCreate):
    pass


class ItemEntradaOut(ItemEntradaCreate):
    id: int

    class Config:
        from_attributes = True

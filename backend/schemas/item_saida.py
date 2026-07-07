from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ItemSaidaCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Identificação / chave original da linha e da saída (SAIDA ainda sem model)
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None
    cod_saida: Optional[int] = None
    cod_produto: Optional[str] = None
    nitem: Optional[int] = None
    num_item: Optional[str] = None
    lote_produto: Optional[str] = None
    unidade: Optional[str] = None
    pai_filho: Optional[str] = None
    cancelado: Optional[str] = None

    # Quantidades / valores comerciais
    qtde: Optional[float] = None
    qtde_controle: Optional[float] = None
    qtde_embal: Optional[float] = None
    cod_embalagem: Optional[str] = None
    qtde_embalagem: Optional[float] = None
    qtde_faturamento_parcial: Optional[float] = None
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
    comissao_item: Optional[float] = None

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
    icms_fcp: Optional[float] = None

    # Fiscal: ICMS partilha interestadual (DIFAL)
    aliq_uf_dest: Optional[float] = None
    aliq_inter: Optional[str] = None
    perc_partilha: Optional[str] = None
    vl_icms_uf_dest: Optional[float] = None
    vl_icms_uf_rem: Optional[float] = None
    vl_icms_fcp: Optional[float] = None
    credito: Optional[float] = None

    # Fiscal: IPI
    ipi: Optional[float] = None
    ipi_cst: Optional[str] = None
    ipi_valor: Optional[float] = None
    ipi_base_calculo: Optional[float] = None
    calcula_ipi_base: Optional[str] = None
    calcula_ipi_base_subst: Optional[str] = None

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
    aliq_ibpt: Optional[float] = None
    cenq: Optional[str] = None

    # Importação (DI — Declaração de Importação)
    di_doc: Optional[str] = None
    di_dt: Optional[datetime] = None
    desemb_dt: Optional[datetime] = None
    desemb_local: Optional[str] = None
    desemb_uf: Optional[str] = None
    di_exportador: Optional[str] = None
    di_fabricante: Optional[str] = None

    # Referências / classificação (códigos brutos, tabelas mestre ainda sem model)
    cod_romaneio: Optional[int] = None
    cod_classificacao2: Optional[int] = None
    cod_empresa_nao_fiscal: Optional[int] = None
    cod_pre_pedido: Optional[int] = None
    cod_empresa_pre_pedido: Optional[int] = None
    num_pedido: Optional[str] = None
    num_lote_prod_etapas: Optional[str] = None
    ref_fabrica: Optional[str] = None
    cod_cbenef: Optional[int] = None

    # Observação
    obs_produto: Optional[str] = None

    # Reforma Tributária: IBS/CBS gerais do item
    reforma_cst_ibscbs: Optional[str] = None
    reforma_cclasstrib: Optional[str] = None
    reforma_vbc_ibscbs: Optional[float] = None
    reforma_vitem: Optional[float] = None
    reforma_chave_acesso: Optional[str] = None
    reforma_nitem: Optional[int] = None
    reforma_inddoacao: Optional[str] = None

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
    reforma_paliqibsuf_gov: Optional[float] = None
    reforma_vtribibsuf_gov: Optional[float] = None
    reforma_vibs_transfcred: Optional[float] = None
    reforma_vibsestcred: Optional[float] = None

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
    reforma_paliqibsmun_gov: Optional[float] = None
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
    reforma_paliqcbs_gov: Optional[float] = None
    reforma_vtribcbs_gov: Optional[float] = None
    reforma_vcbs_transfcred: Optional[float] = None
    reforma_vcbsestcred: Optional[float] = None

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
    reforma_tpcredpresibszfm: Optional[str] = None
    reforma_vcredpresibszfm: Optional[float] = None

    # Reforma Tributária: IS (Imposto Seletivo)
    reforma_cstis_is: Optional[str] = None
    reforma_cclasstribis_is: Optional[str] = None
    reforma_vbcis_is: Optional[float] = None
    reforma_pis_is: Optional[float] = None
    reforma_pisespec_is: Optional[float] = None
    reforma_utrib_is: Optional[str] = None
    reforma_qtrib_is: Optional[float] = None
    reforma_vis_is: Optional[float] = None


class ItemSaidaUpdate(ItemSaidaCreate):
    pass


class ItemSaidaOut(ItemSaidaCreate):
    id: int

    class Config:
        from_attributes = True

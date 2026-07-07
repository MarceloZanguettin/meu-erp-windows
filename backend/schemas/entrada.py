from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EntradaCreate(BaseModel):
    # Identificação / chave natural do documento de entrada
    cod_empresa: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_fornecedor: Optional[int] = None
    emissao: Optional[datetime] = None
    dt_entrada: Optional[datetime] = None
    modelo: Optional[str] = None
    subserie: Optional[str] = None
    cod_funcionario: Optional[int] = None

    # Compra / condição de pagamento
    cod_compra: Optional[int] = None
    cod_cond_pagto: Optional[str] = None
    cod_tipo_compra: Optional[int] = None

    # Documento vinculado / complementar (2ª nota)
    cod_empresa2: Optional[int] = None
    tipo_doc2: Optional[str] = None
    doc2: Optional[int] = None
    serie2: Optional[str] = None
    cod_fornecedor2: Optional[int] = None
    transfere: Optional[str] = None

    # NF-e / chave de acesso
    chave_nfe: Optional[str] = None
    msg_chave: Optional[str] = None
    arq_xml: Optional[str] = None

    # Fiscal: ICMS / ICMS-ST / IPI / PIS / COFINS
    cod_cfop: Optional[str] = None
    icms_base: Optional[float] = None
    icms_valor: Optional[float] = None
    icms_base_subst: Optional[float] = None
    icms_valor_subst: Optional[float] = None
    icms_reducao: Optional[float] = None
    aliquota: Optional[str] = None
    aliquota_subs: Optional[str] = None
    cst: Optional[str] = None
    ipi_valor: Optional[float] = None
    pis_cst: Optional[str] = None
    pis_valor: Optional[float] = None
    pis_base: Optional[float] = None
    pis_aliquota: Optional[float] = None
    cofins_cst: Optional[str] = None
    cofins_valor: Optional[float] = None
    cofins_base: Optional[float] = None
    cofins_aliquota: Optional[float] = None
    simples: Optional[str] = None
    reter_imposto: Optional[str] = None

    # Valores comerciais / totais
    valor_produtos: Optional[float] = None
    frete: Optional[float] = None
    seguro: Optional[float] = None
    outras: Optional[float] = None
    total_nf: Optional[float] = None
    desc_acres: Optional[float] = None
    outros_custo: Optional[float] = None
    valor_credito_fornecedor: Optional[float] = None

    # Observações
    observacao: Optional[str] = None
    obs_fisco: Optional[str] = None

    # Dados dos volumes transportados (seção NF-e)
    quantidade_volumes: Optional[str] = None
    especie_volumes: Optional[str] = None
    peso_bruto_volumes: Optional[str] = None
    peso_liquido_volumes: Optional[str] = None

    # Transporte
    mod_frete: Optional[str] = None
    mod_transporte: Optional[str] = None
    indicador_nat_frete: Optional[str] = None
    placa1: Optional[str] = None
    placa2: Optional[str] = None
    placa3: Optional[str] = None
    uf_placa1: Optional[str] = None
    uf_placa2: Optional[str] = None
    uf_placa3: Optional[str] = None

    # Auditoria de origem (GENUS)
    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None

    # Histórico / controle
    cod_historico: Optional[str] = None
    cod_controle: Optional[int] = None
    cod_controle_empresa: Optional[int] = None
    cod_controle_tipo: Optional[str] = None
    cod_empresa_nao_fiscal: Optional[int] = None

    # Saída vinculada (devolução)
    cod_saida_vinculada: Optional[int] = None
    cod_empresa_saida_vinculada: Optional[int] = None
    doc_saida_vinculada: Optional[int] = None

    # Produção
    cod_empresa_producao: Optional[int] = None
    codigo_producao: Optional[int] = None
    lote_producao: Optional[str] = None
    cod_empresa_saida_prod: Optional[int] = None
    codigo_saida_prod: Optional[int] = None
    doc_saida_prod: Optional[str] = None

    # Reforma Tributária: gerais / governo
    reforma_totvbcibscbs: Optional[float] = None
    reforma_vnftot: Optional[float] = None
    reforma_tpentegov: Optional[str] = None
    reforma_tpopergov: Optional[str] = None
    reforma_predutorgov: Optional[float] = None

    # Reforma Tributária: totais IBS-UF / IBS-Município / IBS geral
    reforma_totvibsuf_ibsuf: Optional[float] = None
    reforma_totvdif_ibsuf: Optional[float] = None
    reforma_totvdevtrib_ibsuf: Optional[float] = None
    reforma_totvibsmun_ibsmun: Optional[float] = None
    reforma_totvdif_ibsmun: Optional[float] = None
    reforma_totvdevtrib_ibsmun: Optional[float] = None
    reforma_totvibs_ibs: Optional[float] = None
    reforma_totvcredpres_ibs: Optional[float] = None
    reforma_totvcredprescondsus_ibs: Optional[float] = None

    # Reforma Tributária: totais CBS
    reforma_totvcbs_cbs: Optional[float] = None
    reforma_totvdevtrib_cbs: Optional[float] = None
    reforma_totvdif_cbs: Optional[float] = None
    reforma_totvcredpres_cbs: Optional[float] = None
    reforma_totvcredprescondsus_cbs: Optional[float] = None


class EntradaUpdate(EntradaCreate):
    pass


class EntradaOut(EntradaCreate):
    id: int

    class Config:
        from_attributes = True

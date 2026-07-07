from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SaidaCreate(BaseModel):
    # Identificação / chave original da saída no GENUS
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_cliente: Optional[int] = None
    cod_funcionario: Optional[int] = None
    cod_cond_pagto: Optional[str] = None
    emissao: Optional[datetime] = None
    modelo: Optional[str] = None
    status_genus: Optional[str] = None
    cancelado: Optional[str] = None

    # Fiscal: ICMS / ICMS-ST / IPI / PIS / COFINS
    cod_cfop: Optional[str] = None
    cod_cfop2: Optional[str] = None
    icms_base: Optional[float] = None
    icms_valor: Optional[float] = None
    icms_base_subst: Optional[float] = None
    icms_valor_subst: Optional[float] = None
    ipi_valor: Optional[float] = None
    pis_valor: Optional[float] = None
    cofins_valor: Optional[float] = None
    credito_icms: Optional[float] = None
    total_icms_uf_dest: Optional[float] = None
    total_icms_uf_rem: Optional[float] = None
    total_icms_fcp: Optional[float] = None

    # Valores comerciais / totais
    valor_produtos: Optional[float] = None
    frete: Optional[float] = None
    seguro: Optional[float] = None
    outras: Optional[float] = None
    total: Optional[float] = None
    desc_acres: Optional[float] = None
    descto1: Optional[float] = None
    descto2: Optional[float] = None
    descto3: Optional[float] = None
    descto4: Optional[float] = None
    descto5: Optional[float] = None
    perc_divisao: Optional[float] = None
    comissao: Optional[float] = None
    valor_credito: Optional[float] = None

    # Observações
    observacao: Optional[str] = None
    obs_interna: Optional[str] = None
    obs_fisco: Optional[str] = None

    # Transferência entre empresas / identificação do destinatário
    transfere: Optional[str] = None
    cpf_cnpj: Optional[str] = None
    hora: Optional[str] = None
    cod_transfere: Optional[int] = None
    fechar: Optional[str] = None

    # Dados dos volumes transportados (seção NF-e)
    quantidade_volumes: Optional[str] = None
    especie_volumes: Optional[str] = None
    marca_volumes: Optional[str] = None
    numero_volumes: Optional[str] = None
    peso_bruto_volumes: Optional[str] = None
    peso_liquido_volumes: Optional[str] = None

    # Transporte / entrega
    cod_transportador: Optional[int] = None
    frete_conta: Optional[str] = None
    placa: Optional[str] = None
    entregue: Optional[str] = None
    dt_previsao: Optional[datetime] = None

    # ECF / cupom fiscal
    cod_ecf: Optional[int] = None
    ccf: Optional[int] = None
    retirar_estoque: Optional[str] = None
    cod_tipo_venda: Optional[int] = None
    romaneio: Optional[int] = None
    romaneio_lote: Optional[str] = None
    chave_nfe: Optional[str] = None
    cod_agregado: Optional[int] = None
    avista_prazo: Optional[str] = None
    cod_cupom_vinculado: Optional[int] = None

    # Liberação / datas de saída física
    dt_liberado: Optional[datetime] = None
    cod_adm: Optional[int] = None
    dt_saida: Optional[datetime] = None
    hora_saida: Optional[str] = None
    liberado: Optional[str] = None

    # Auditoria de origem (GENUS)
    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None
    email_enviado: Optional[datetime] = None
    email_cod_funcionario: Optional[int] = None

    # Carteira / tabela de preço / classificação
    cod_carteira: Optional[int] = None
    discriminacao: Optional[str] = None
    cod_cliente_entrega: Optional[int] = None
    tipo_comercio: Optional[str] = None
    tipo_nf: Optional[str] = None
    tipo_cliente: Optional[str] = None
    cod_tabela_preco: Optional[int] = None
    cod_orcamento: Optional[int] = None
    devop_simples: Optional[str] = None

    # Ordem de serviço
    cod_ordem_servico: Optional[int] = None
    cod_empresa_ordem_servico: Optional[int] = None
    tipo_ordem_servico: Optional[str] = None

    # Fiscal: serviço (ISS) / retenções (INSS/IR/CSLL/PIS/COFINS)
    vl_base_calculo: Optional[float] = None
    vl_deducao: Optional[float] = None
    vl_aliquota: Optional[float] = None
    vl_inss: Optional[float] = None
    al_inss: Optional[float] = None
    al_ir: Optional[float] = None
    vl_ir: Optional[float] = None
    al_csll: Optional[float] = None
    vl_csll: Optional[float] = None
    al_pis: Optional[float] = None
    al_cofins: Optional[float] = None
    vl_iss: Optional[float] = None
    vl_iss_retido: Optional[float] = None
    vl_servico: Optional[float] = None

    # Referências (saída de origem/vínculo, pedido, empresa não fiscal)
    cod_empresa_ref: Optional[int] = None
    cod_saida_ref: Optional[int] = None
    cod_pedido: Optional[int] = None
    cod_empresa_vinculado: Optional[int] = None
    cod_saida_vinculado: Optional[int] = None
    cod_empresa_nao_fiscal: Optional[int] = None

    # Entrada vinculada (devolução)
    entrada_cod_empresa: Optional[int] = None
    entrada_tipo_doc: Optional[str] = None
    entrada_doc: Optional[int] = None
    entrada_serie: Optional[str] = None
    entrada_cod_fornecedor: Optional[int] = None

    # Retorno CFOP (fechamento fiscal)
    data_retorno_cfop: Optional[datetime] = None
    retorno_fechado_cfop: Optional[str] = None
    data_retorno_fechado_cfop: Optional[datetime] = None

    # Códigos antigos / transferência entre empresas (multi-empresa GENUS)
    cod_antigo_transfere1: Optional[int] = None
    cod_antigo_transfere2: Optional[int] = None
    cod_empresa_transf1: Optional[int] = None
    cod_empresa_transf2: Optional[int] = None
    cod_saida_antigo: Optional[int] = None
    pedido_representante: Optional[str] = None

    # Reforma Tributária: gerais / governo
    reforma_tpnfdebito: Optional[str] = None
    reforma_tpnfcredito: Optional[str] = None
    reforma_tpentegov: Optional[str] = None
    reforma_predutorgov: Optional[float] = None
    reforma_tpopergov: Optional[str] = None
    reforma_refnfeant: Optional[str] = None
    reforma_cod_saida_ant: Optional[int] = None
    reforma_cod_empresa_ant: Optional[int] = None

    # Reforma Tributária: totais IBS-UF
    reforma_totvbcibscbs: Optional[float] = None
    reforma_totvdif_ibsuf: Optional[float] = None
    reforma_totvdevtrib_ibsuf: Optional[float] = None
    reforma_totvibsuf_ibsuf: Optional[float] = None

    # Reforma Tributária: totais IBS-Município
    reforma_totvdif_ibsmun: Optional[float] = None
    reforma_totvdevtrib_ibsmun: Optional[float] = None
    reforma_totvibsmun_ibsmun: Optional[float] = None

    # Reforma Tributária: totais IBS geral / crédito presumido
    reforma_totvibs_ibs: Optional[float] = None
    reforma_totvcredpres_ibs: Optional[float] = None
    reforma_totvcredprescondsus_ibs: Optional[float] = None
    reforma_totvibsestcred: Optional[float] = None

    # Reforma Tributária: totais CBS
    reforma_totvdif_cbs: Optional[float] = None
    reforma_totvdevtrib_cbs: Optional[float] = None
    reforma_totvcbs_cbs: Optional[float] = None
    reforma_totvcredpres_cbs: Optional[float] = None
    reforma_totvcredprescondsus_cbs: Optional[float] = None
    reforma_totvcbsestcred: Optional[float] = None

    # Reforma Tributária: total geral da NF / exceção
    reforma_vnftot: Optional[float] = None
    reforma_excecao: Optional[str] = None
    reforma_excecao_descricao: Optional[str] = None
    reforma_excecao_responsaveis: Optional[str] = None


class SaidaUpdate(SaidaCreate):
    pass


class SaidaOut(SaidaCreate):
    id: int

    class Config:
        from_attributes = True

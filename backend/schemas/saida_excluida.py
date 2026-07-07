from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SaidaExcluidaCreate(BaseModel):
    # Identificação / chave original da saída excluída no GENUS
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_cliente: Optional[int] = None
    cod_funcionario: Optional[int] = None
    cod_cond_pagto: Optional[str] = None
    emissao: Optional[datetime] = None

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

    # Observação
    observacao: Optional[str] = None

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

    # Auditoria de origem (GENUS)
    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None
    email_enviado: Optional[datetime] = None
    email_cod_funcionario: Optional[int] = None

    # Carteira / classificação
    cod_carteira: Optional[int] = None
    discriminacao: Optional[str] = None
    pedido_representante: Optional[str] = None
    cod_cliente_entrega: Optional[int] = None
    tipo_comercio: Optional[str] = None
    tipo_nf: Optional[str] = None
    tipo_cliente: Optional[str] = None

    # Auditoria da exclusão
    dt_exclusao: Optional[datetime] = None


class SaidaExcluidaUpdate(SaidaExcluidaCreate):
    pass


class SaidaExcluidaOut(SaidaExcluidaCreate):
    id: int

    class Config:
        from_attributes = True

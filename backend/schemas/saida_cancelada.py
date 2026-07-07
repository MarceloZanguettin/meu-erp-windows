from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SaidaCanceladaCreate(BaseModel):
    # Identificação / chave original da saída cancelada no GENUS
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_cliente: Optional[int] = None
    cod_funcionario: Optional[int] = None
    cod_cond_pagto: Optional[str] = None
    emissao: Optional[datetime] = None

    # Fiscal: ICMS / IPI
    cod_cfop: Optional[str] = None
    icms_base: Optional[float] = None
    icms_valor: Optional[float] = None
    icms_base_subst: Optional[float] = None
    icms_valor_subst: Optional[float] = None
    ipi_valor: Optional[float] = None

    # Valores comerciais / totais
    valor_produtos: Optional[float] = None
    frete: Optional[float] = None
    seguro: Optional[float] = None
    outras: Optional[float] = None
    total: Optional[float] = None
    desc_acres: Optional[float] = None
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

    # ECF / cupom fiscal / estoque
    cod_ecf: Optional[int] = None
    ccf: Optional[int] = None
    retirar_estoque: Optional[str] = None
    cod_tipo_venda: Optional[int] = None
    chave_nfe: Optional[str] = None

    # Transporte / vínculos
    cod_transportador: Optional[int] = None
    cod_agregado: Optional[int] = None
    avista_prazo: Optional[str] = None
    cod_cupom_vinculado: Optional[int] = None

    # Liberação / datas de saída física
    dt_liberado: Optional[datetime] = None
    cod_adm: Optional[int] = None
    dt_saida: Optional[datetime] = None
    hora_saida: Optional[str] = None

    # Auditoria de origem (GENUS)
    cod_digita: Optional[int] = None


class SaidaCanceladaUpdate(SaidaCanceladaCreate):
    pass


class SaidaCanceladaOut(SaidaCanceladaCreate):
    id: int

    class Config:
        from_attributes = True

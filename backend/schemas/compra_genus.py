from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CompraGenusCreate(BaseModel):
    # Identificação / chave própria do documento de compra
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None
    emissao: Optional[datetime] = None
    cod_funcionario: Optional[int] = None
    cod_fornecedor: Optional[int] = None
    cod_transporte: Optional[int] = None
    cod_destino: Optional[int] = None

    # Condição de pagamento / transporte
    cod_cond_pagto: Optional[str] = None
    placa: Optional[str] = None
    placa2: Optional[str] = None
    tipo_frete: Optional[str] = None
    frete: Optional[float] = None
    conhecimento: Optional[str] = None

    # Valores comerciais / totais
    total: Optional[float] = None
    desc_acres: Optional[float] = None

    # Fluxo de aprovação / compra
    cod_aprovador: Optional[int] = None
    cod_comprador: Optional[int] = None
    dt_compra: Optional[datetime] = None
    dt_aprovacao: Optional[datetime] = None
    dt_entrega: Optional[datetime] = None

    # Recebimento
    cod_recebedor: Optional[int] = None
    dt_recebimento: Optional[datetime] = None

    # Cotação / agregação
    cod_cotacao: Optional[int] = None
    cod_agregado: Optional[int] = None

    # Histórico / observações / status
    cod_historico: Optional[str] = None
    os: Optional[str] = None
    obs: Optional[str] = None
    status: Optional[str] = None

    # E-mail
    email_enviado: Optional[datetime] = None
    email_cod_funcionario: Optional[int] = None


class CompraGenusUpdate(CompraGenusCreate):
    pass


class CompraGenusOut(CompraGenusCreate):
    id: int

    class Config:
        from_attributes = True

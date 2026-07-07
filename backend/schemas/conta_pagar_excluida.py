from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ContaPagarExcluidaCreate(BaseModel):
    # Identificação / chave original do título excluído no GENUS
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_fornecedor: Optional[int] = None
    emissao: Optional[datetime] = None
    data_vencimento: Optional[datetime] = None
    valor: Optional[float] = None
    parcela: Optional[str] = None
    data_pagamento: Optional[datetime] = None
    valor_pago: Optional[float] = None
    cod_conta: Optional[int] = None
    cod_historico: Optional[str] = None
    observacao: Optional[str] = None
    cod_empresa_pag: Optional[int] = None
    duplicata: Optional[str] = None

    # Auditoria de origem (GENUS)
    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None
    linha_digitavel: Optional[str] = None

    # Auditoria da exclusão
    dt_exclusao: Optional[datetime] = None
    valor_documento: Optional[float] = None
    doc_parcela: Optional[str] = None


class ContaPagarExcluidaUpdate(ContaPagarExcluidaCreate):
    pass


class ContaPagarExcluidaOut(ContaPagarExcluidaCreate):
    id: int

    class Config:
        from_attributes = True

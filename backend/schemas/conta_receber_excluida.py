from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ContaReceberExcluidaCreate(BaseModel):
    # Identificação / chave original do título excluído no GENUS
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    cod_saida: Optional[int] = None
    parcela: Optional[str] = None
    cod_cliente: Optional[int] = None
    emissao: Optional[datetime] = None
    data_vencimento: Optional[datetime] = None
    valor: Optional[float] = None
    data_recebimento: Optional[datetime] = None
    valor_pago: Optional[float] = None
    cod_historico: Optional[str] = None
    cod_contas: Optional[int] = None
    dt_digitacao: Optional[datetime] = None
    observacao: Optional[str] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    cod_empresa_rec: Optional[int] = None

    # Boleto / carteira / cobrança
    imp_boleto: Optional[str] = None
    cod_movto: Optional[int] = None
    nosso_numero: Optional[str] = None
    cod_carteira: Optional[int] = None
    cod_fatura: Optional[int] = None
    comissao: Optional[float] = None
    processamento: Optional[datetime] = None

    # SCPC / cartório / protesto (cobrança)
    scpc_enviado: Optional[datetime] = None
    scpc_retirado: Optional[datetime] = None
    carta_cobranca: Optional[datetime] = None
    carta_scpc: Optional[datetime] = None

    # Auditoria de origem (GENUS)
    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None
    valor_credito: Optional[float] = None
    remessa: Optional[int] = None

    # Auditoria da exclusão
    dt_exclusao: Optional[datetime] = None


class ContaReceberExcluidaUpdate(ContaReceberExcluidaCreate):
    pass


class ContaReceberExcluidaOut(ContaReceberExcluidaCreate):
    id: int

    class Config:
        from_attributes = True

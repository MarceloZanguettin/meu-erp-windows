from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FaturaNotaPagarCreate(BaseModel):
    # ── Vínculo resolvível do ERP (ContaPagar já reconhecida como GENUS.PAGAR) ─
    conta_pagar_id: Optional[int] = None

    # ── Identificação própria da linha em GENUS.FATURANOTAPAGAR ────────────
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None

    # ── Campos espelhados de GENUS.PAGAR (título a pagar original) ─────────
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_fornecedor: Optional[int] = None
    emissao: Optional[datetime] = None
    vencimento: Optional[datetime] = None
    valor: Optional[float] = None
    parcela: Optional[str] = None
    dt_pago: Optional[datetime] = None
    valor_pago: Optional[float] = None
    cod_conta: Optional[int] = None
    cod_historico: Optional[str] = None
    obs: Optional[str] = None
    cod_empresa_pag: Optional[int] = None
    duplicata: Optional[str] = None

    # Auditoria de origem (GENUS)
    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None

    # Boleto / controle
    linha_digitavel: Optional[str] = None
    previsao: Optional[str] = None
    cod_controle: Optional[int] = None
    cod_controle_empresa: Optional[int] = None
    cod_controle_tipo: Optional[str] = None
    num_doc: Optional[str] = None
    valor_documento: Optional[float] = None
    conta_cheque: Optional[int] = None
    doc_cheque: Optional[int] = None
    cod_frete: Optional[int] = None
    parc_real: Optional[str] = None
    cod_empresa_entrada: Optional[int] = None
    doc_parcela: Optional[str] = None
    cod_carteira: Optional[int] = None
    cod_fixo: Optional[int] = None
    valor_credito_fornecedor: Optional[float] = None

    # ── Vínculo com a fatura a pagar (GENUS.FATURAPAGAR, ainda não modelada) ─
    cod_fatura_pagar: Optional[int] = None
    cod_fatura_pagar_ant: Optional[int] = None
    cod_empresa_fat_ant: Optional[int] = None

    # ── Vínculo com a nota fiscal de compra/entrada de origem ──────────────
    tipo_doc_entrada: Optional[str] = None
    doc_entrada: Optional[int] = None
    serie_entrada: Optional[str] = None
    cod_fornecedor_entrada: Optional[int] = None

    # ── Vínculo de volta com o título original em PAGAR (ver conta_pagar_id) ─
    cod_pagar: Optional[int] = None
    cod_empresa_pagar: Optional[int] = None


class FaturaNotaPagarUpdate(FaturaNotaPagarCreate):
    pass


class FaturaNotaPagarOut(FaturaNotaPagarCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ChequeEmitidoCreate(BaseModel):
    # ── Vínculo resolvível do ERP (ContaPagar já expandido no Tier 2) ──────
    conta_pagar_id: Optional[int] = None

    # ── Campos migrados de GENUS.CHEQUE_EMITIDO (todos opcionais) ──────────
    cod_empresa: Optional[int] = None
    cod_contas: Optional[int] = None
    cheque: Optional[int] = None
    valor: Optional[float] = None
    para: Optional[datetime] = None
    devolve: Optional[datetime] = None
    dt_baixa: Optional[datetime] = None
    obs: Optional[str] = None
    cod_pagar: Optional[int] = None
    digitado: Optional[datetime] = None
    cod_historico: Optional[str] = None
    nominal: Optional[str] = None
    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None
    emissao: Optional[datetime] = None
    cod_empresa_pagar: Optional[int] = None


class ChequeEmitidoUpdate(ChequeEmitidoCreate):
    pass


class ChequeEmitidoOut(ChequeEmitidoCreate):
    id: int

    class Config:
        from_attributes = True

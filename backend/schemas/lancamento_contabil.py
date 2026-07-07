from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class LancamentoContabilCreate(BaseModel):
    # ── Campos migrados de GENUS.LANCAMENTO (todos opcionais) ─────────────
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    cod_contas: Optional[int] = None
    cod_historico: Optional[str] = None
    valor: Optional[float] = None
    doc: Optional[str] = None
    obs: Optional[str] = None
    dt_movto: Optional[datetime] = None
    usuario: Optional[str] = None
    dt_digitacao: Optional[datetime] = None
    cod_centro_custo: Optional[int] = None
    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None
    cod_comissao_representante: Optional[int] = None
    cod_lanc_credito: Optional[int] = None
    partida_dobrada: Optional[str] = None
    cod_partida_dobrada: Optional[int] = None
    cod_receber: Optional[int] = None
    cod_empresa_receber: Optional[int] = None
    cod_credito_fornecedor: Optional[int] = None
    cod_deposito: Optional[int] = None


class LancamentoContabilUpdate(LancamentoContabilCreate):
    pass


class LancamentoContabilOut(LancamentoContabilCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional
import datetime


class CreditoCreate(BaseModel):
    # ── Campos migrados de GENUS.CREDITO (todos opcionais) ─────────────────
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None
    cod_cliente: Optional[int] = None
    emissao: Optional[datetime.datetime] = None
    valor: Optional[float] = None
    obs: Optional[str] = None
    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime.datetime] = None
    cod_conta: Optional[int] = None
    cod_historico: Optional[str] = None
    cod_saida: Optional[int] = None


class CreditoUpdate(CreditoCreate):
    pass


class CreditoOut(CreditoCreate):
    id: int

    class Config:
        from_attributes = True

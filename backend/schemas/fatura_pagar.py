from pydantic import BaseModel
from typing import Optional
import datetime


class FaturaPagarCreate(BaseModel):
    # ── Campos migrados de GENUS.FATURAPAGAR (todos opcionais) ────────────
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    doc: Optional[int] = None
    emissao: Optional[datetime.datetime] = None
    cod_cond_pagto: Optional[str] = None
    cod_cadastro: Optional[int] = None
    cod_carteira: Optional[int] = None
    data_base: Optional[datetime.datetime] = None
    obs: Optional[str] = None


class FaturaPagarUpdate(FaturaPagarCreate):
    pass


class FaturaPagarOut(FaturaPagarCreate):
    id: int

    class Config:
        from_attributes = True

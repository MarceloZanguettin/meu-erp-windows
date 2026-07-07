from pydantic import BaseModel
from typing import Optional
import datetime


class FaturaCreate(BaseModel):
    # ── Campos migrados de GENUS.FATURA (todos opcionais) ─────────────────
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    emissao: Optional[datetime.datetime] = None
    cod_cond_pagto: Optional[str] = None
    cod_cadastro: Optional[int] = None
    cod_carteira: Optional[int] = None


class FaturaUpdate(FaturaCreate):
    pass


class FaturaOut(FaturaCreate):
    id: int

    class Config:
        from_attributes = True

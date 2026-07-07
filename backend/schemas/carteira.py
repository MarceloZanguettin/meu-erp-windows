from pydantic import BaseModel
from typing import Optional


class CarteiraCreate(BaseModel):
    # ── Campos migrados de GENUS.CARTEIRA (todos opcionais) ────────────────
    codigo: Optional[int] = None
    descricao: Optional[str] = None
    descontada: Optional[str] = None
    float_pagto: Optional[int] = None


class CarteiraUpdate(CarteiraCreate):
    pass


class CarteiraOut(CarteiraCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional


class CadastroCbenefCreate(BaseModel):
    # Campos migrados de GENUS.CADASTROCBENEF
    codigo: Optional[int] = None
    cbenef: Optional[str] = None
    simples_nacional: Optional[str] = None

    cst_00: Optional[str] = None
    cst_02: Optional[str] = None
    cst_10: Optional[str] = None
    cst_15: Optional[str] = None
    cst_20: Optional[str] = None
    cst_30: Optional[str] = None
    cst_40: Optional[str] = None
    cst_41: Optional[str] = None
    cst_50: Optional[str] = None
    cst_51: Optional[str] = None
    cst_53: Optional[str] = None
    cst_60: Optional[str] = None
    cst_61: Optional[str] = None
    cst_70: Optional[str] = None
    cst_90: Optional[str] = None

    dispositivo: Optional[str] = None
    objeto_descricao: Optional[str] = None
    observacao: Optional[str] = None


class CadastroCbenefUpdate(BaseModel):
    codigo: Optional[int] = None
    cbenef: Optional[str] = None
    simples_nacional: Optional[str] = None

    cst_00: Optional[str] = None
    cst_02: Optional[str] = None
    cst_10: Optional[str] = None
    cst_15: Optional[str] = None
    cst_20: Optional[str] = None
    cst_30: Optional[str] = None
    cst_40: Optional[str] = None
    cst_41: Optional[str] = None
    cst_50: Optional[str] = None
    cst_51: Optional[str] = None
    cst_53: Optional[str] = None
    cst_60: Optional[str] = None
    cst_61: Optional[str] = None
    cst_70: Optional[str] = None
    cst_90: Optional[str] = None

    dispositivo: Optional[str] = None
    objeto_descricao: Optional[str] = None
    observacao: Optional[str] = None


class CadastroCbenefOut(CadastroCbenefCreate):
    id: int

    class Config:
        from_attributes = True

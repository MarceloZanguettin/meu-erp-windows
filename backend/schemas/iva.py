from pydantic import BaseModel
from typing import Optional


class IvaCreate(BaseModel):
    # Campos migrados de GENUS.IVA
    cod_classificacao: Optional[int] = None
    estado: Optional[str] = None
    iva: Optional[float] = None


class IvaUpdate(BaseModel):
    cod_classificacao: Optional[int] = None
    estado: Optional[str] = None
    iva: Optional[float] = None


class IvaOut(IvaCreate):
    id: int

    class Config:
        from_attributes = True

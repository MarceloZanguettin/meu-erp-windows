from pydantic import BaseModel
from typing import Optional


class MarcaCreate(BaseModel):
    # Campos migrados de GENUS.MARCA
    codigo: Optional[int] = None
    descricao: Optional[str] = None


class MarcaUpdate(BaseModel):
    codigo: Optional[int] = None
    descricao: Optional[str] = None


class MarcaOut(MarcaCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional


class PaisCreate(BaseModel):
    # Campos migrados de GENUS.PAIS
    codigo: Optional[int] = None
    nome: Optional[str] = None


class PaisUpdate(BaseModel):
    codigo: Optional[int] = None
    nome: Optional[str] = None


class PaisOut(PaisCreate):
    id: int

    class Config:
        from_attributes = True

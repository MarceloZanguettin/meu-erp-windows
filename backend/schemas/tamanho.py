from pydantic import BaseModel
from typing import Optional


class TamanhoCreate(BaseModel):
    # Campos migrados de GENUS.TAMANHO
    codigo: Optional[str] = None
    descricao: Optional[str] = None
    ordem: Optional[int] = None


class TamanhoUpdate(BaseModel):
    codigo: Optional[str] = None
    descricao: Optional[str] = None
    ordem: Optional[int] = None


class TamanhoOut(TamanhoCreate):
    id: int

    class Config:
        from_attributes = True

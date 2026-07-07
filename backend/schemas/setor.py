from pydantic import BaseModel
from typing import Optional


class SetorCreate(BaseModel):
    # Campos migrados de GENUS.SETOR
    codigo: Optional[int] = None
    descricao: Optional[str] = None


class SetorUpdate(BaseModel):
    codigo: Optional[int] = None
    descricao: Optional[str] = None


class SetorOut(SetorCreate):
    id: int

    class Config:
        from_attributes = True

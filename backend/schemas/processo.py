from pydantic import BaseModel
from typing import Optional


class ProcessoCreate(BaseModel):
    # Campos migrados de GENUS.PROCESSO
    codigo: Optional[int] = None
    descricao: Optional[str] = None
    mostrar: Optional[str] = None
    ordem: Optional[int] = None


class ProcessoUpdate(BaseModel):
    codigo: Optional[int] = None
    descricao: Optional[str] = None
    mostrar: Optional[str] = None
    ordem: Optional[int] = None


class ProcessoOut(ProcessoCreate):
    id: int

    class Config:
        from_attributes = True

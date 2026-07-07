from pydantic import BaseModel
from typing import Optional


class EstadoCreate(BaseModel):
    # Campos migrados de GENUS.ESTADO
    sigla: Optional[str] = None
    nome: Optional[str] = None
    icms: Optional[float] = None
    perc_comissao: Optional[float] = None


class EstadoUpdate(BaseModel):
    sigla: Optional[str] = None
    nome: Optional[str] = None
    icms: Optional[float] = None
    perc_comissao: Optional[float] = None


class EstadoOut(EstadoCreate):
    id: int

    class Config:
        from_attributes = True

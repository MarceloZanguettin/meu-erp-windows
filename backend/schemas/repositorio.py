from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RepositorioCreate(BaseModel):
    # Campos migrados de GENUS.REPOSITORIO
    nome: Optional[str] = None
    aq: Optional[str] = None
    versao: Optional[int] = None
    atualiza: Optional[datetime] = None


class RepositorioUpdate(BaseModel):
    nome: Optional[str] = None
    aq: Optional[str] = None
    versao: Optional[int] = None
    atualiza: Optional[datetime] = None


class RepositorioOut(RepositorioCreate):
    id: int

    class Config:
        from_attributes = True

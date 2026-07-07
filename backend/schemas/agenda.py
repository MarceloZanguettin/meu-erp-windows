from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class AgendaCreate(BaseModel):
    # Campos migrados de GENUS.AGENDA
    codigo: Optional[int] = None
    cod_agendador: Optional[int] = None
    cod_para: Optional[int] = None
    data: Optional[datetime] = None
    hora: Optional[str] = None
    texto: Optional[str] = None
    emissao: Optional[datetime] = None
    status: Optional[str] = None


class AgendaUpdate(BaseModel):
    codigo: Optional[int] = None
    cod_agendador: Optional[int] = None
    cod_para: Optional[int] = None
    data: Optional[datetime] = None
    hora: Optional[str] = None
    texto: Optional[str] = None
    emissao: Optional[datetime] = None
    status: Optional[str] = None


class AgendaOut(AgendaCreate):
    id: int

    class Config:
        from_attributes = True

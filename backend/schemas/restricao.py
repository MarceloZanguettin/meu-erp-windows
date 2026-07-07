from pydantic import BaseModel
from typing import Optional


class RestricaoCreate(BaseModel):
    # Campos migrados de GENUS.RESTRICAO
    cpf_cnpj: Optional[str] = None
    nome: Optional[str] = None
    motivo: Optional[str] = None


class RestricaoUpdate(BaseModel):
    cpf_cnpj: Optional[str] = None
    nome: Optional[str] = None
    motivo: Optional[str] = None


class RestricaoOut(RestricaoCreate):
    id: int

    class Config:
        from_attributes = True

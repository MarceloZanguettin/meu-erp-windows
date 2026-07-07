from pydantic import BaseModel
from typing import Optional


class RegraCreate(BaseModel):
    # Campos migrados de GENUS.REGRAS
    codigo: Optional[int] = None
    descricao: Optional[str] = None
    tipo_nf: Optional[str] = None
    tipo_cliente: Optional[str] = None
    cod_empresa: Optional[int] = None
    pessoa: Optional[str] = None
    tipo_apuracao: Optional[str] = None
    nao_contribuinte: Optional[str] = None


class RegraUpdate(BaseModel):
    codigo: Optional[int] = None
    descricao: Optional[str] = None
    tipo_nf: Optional[str] = None
    tipo_cliente: Optional[str] = None
    cod_empresa: Optional[int] = None
    pessoa: Optional[str] = None
    tipo_apuracao: Optional[str] = None
    nao_contribuinte: Optional[str] = None


class RegraOut(RegraCreate):
    id: int

    class Config:
        from_attributes = True

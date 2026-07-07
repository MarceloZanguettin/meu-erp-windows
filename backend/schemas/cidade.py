from pydantic import BaseModel
from typing import Optional


class CidadeCreate(BaseModel):
    # Campos migrados de GENUS.CIDADE
    codigo: Optional[int] = None
    nome: Optional[str] = None
    cod_estado: Optional[str] = None
    qtde_habitante: Optional[int] = None
    cep: Optional[str] = None
    ibge: Optional[str] = None
    cod_pais: Optional[int] = None
    qtde_pontos: Optional[int] = None
    observacao: Optional[str] = None
    meta: Optional[int] = None


class CidadeUpdate(BaseModel):
    codigo: Optional[int] = None
    nome: Optional[str] = None
    cod_estado: Optional[str] = None
    qtde_habitante: Optional[int] = None
    cep: Optional[str] = None
    ibge: Optional[str] = None
    cod_pais: Optional[int] = None
    qtde_pontos: Optional[int] = None
    observacao: Optional[str] = None
    meta: Optional[int] = None


class CidadeOut(CidadeCreate):
    id: int

    class Config:
        from_attributes = True

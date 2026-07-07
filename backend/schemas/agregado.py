from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AgregadoCreate(BaseModel):
    # Vínculo com o cadastro mestre já migrado (GENUS.CADASTRO)
    cadastro_pessoa_id: Optional[int] = None

    # Campos migrados de GENUS.AGREGADOS
    cod_cadastro: Optional[int] = None
    codigo: Optional[int] = None
    tipo: Optional[str] = None
    nome: Optional[str] = None
    data_nascimento: Optional[datetime] = None
    data_casamento: Optional[datetime] = None
    endereco: Optional[str] = None
    numero: Optional[str] = None
    bairro: Optional[str] = None
    cod_cidade: Optional[int] = None
    fone: Optional[str] = None
    insc: Optional[str] = None
    cep: Optional[str] = None
    cnpj: Optional[str] = None
    produtor_rural: Optional[str] = None
    observacao: Optional[str] = None


class AgregadoUpdate(BaseModel):
    cadastro_pessoa_id: Optional[int] = None

    cod_cadastro: Optional[int] = None
    codigo: Optional[int] = None
    tipo: Optional[str] = None
    nome: Optional[str] = None
    data_nascimento: Optional[datetime] = None
    data_casamento: Optional[datetime] = None
    endereco: Optional[str] = None
    numero: Optional[str] = None
    bairro: Optional[str] = None
    cod_cidade: Optional[int] = None
    fone: Optional[str] = None
    insc: Optional[str] = None
    cep: Optional[str] = None
    cnpj: Optional[str] = None
    produtor_rural: Optional[str] = None
    observacao: Optional[str] = None


class AgregadoOut(AgregadoCreate):
    id: int

    class Config:
        from_attributes = True

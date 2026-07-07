from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CotacaoPrecoCreate(BaseModel):
    # Identificação / chave bruta original (PK própria no GENUS: CODIGO)
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None

    # Cabeçalho da cotação
    emissao: Optional[datetime] = None
    descricao: Optional[str] = None
    status: Optional[str] = None
    validade: Optional[datetime] = None

    # Solicitante e aprovação
    cod_funcionario: Optional[int] = None
    cod_aprovador: Optional[int] = None
    data_aprovado: Optional[datetime] = None
    hora_aprovado: Optional[str] = None


class CotacaoPrecoUpdate(CotacaoPrecoCreate):
    pass


class CotacaoPrecoOut(CotacaoPrecoCreate):
    id: int

    class Config:
        from_attributes = True

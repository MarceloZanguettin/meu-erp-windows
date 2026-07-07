from pydantic import BaseModel
from typing import Optional


class TabelaPrecoCreate(BaseModel):
    # Campos migrados de GENUS.TABELAPRECO
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None
    descricao: Optional[str] = None
    percentual: Optional[float] = None
    cod_preco: Optional[int] = None
    ativo: Optional[str] = None
    tipo_calculo: Optional[str] = None
    tipo_comissao: Optional[str] = None
    perc_comissao: Optional[float] = None


class TabelaPrecoUpdate(BaseModel):
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None
    descricao: Optional[str] = None
    percentual: Optional[float] = None
    cod_preco: Optional[int] = None
    ativo: Optional[str] = None
    tipo_calculo: Optional[str] = None
    tipo_comissao: Optional[str] = None
    perc_comissao: Optional[float] = None


class TabelaPrecoOut(TabelaPrecoCreate):
    id: int

    class Config:
        from_attributes = True

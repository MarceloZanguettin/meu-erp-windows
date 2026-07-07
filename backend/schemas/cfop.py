from pydantic import BaseModel
from typing import Optional


class CfopCreate(BaseModel):
    # Campos migrados de GENUS.CFOP
    codigo: Optional[str] = None
    descricao: Optional[str] = None
    mensagem_1: Optional[str] = None
    mensagem_2: Optional[str] = None
    cod_contabil_prazo: Optional[str] = None
    cod_contabil_avista: Optional[str] = None
    credito_icms: Optional[str] = None
    observacao: Optional[str] = None
    obrigatorio_retorno_mercadoria: Optional[str] = None


class CfopUpdate(BaseModel):
    codigo: Optional[str] = None
    descricao: Optional[str] = None
    mensagem_1: Optional[str] = None
    mensagem_2: Optional[str] = None
    cod_contabil_prazo: Optional[str] = None
    cod_contabil_avista: Optional[str] = None
    credito_icms: Optional[str] = None
    observacao: Optional[str] = None
    obrigatorio_retorno_mercadoria: Optional[str] = None


class CfopOut(CfopCreate):
    id: int

    class Config:
        from_attributes = True

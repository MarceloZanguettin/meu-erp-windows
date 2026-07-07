from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class MensagemCreate(BaseModel):
    # Campos migrados de GENUS.MENSAGEM
    codigo: Optional[int] = None
    cod_origem: Optional[int] = None
    cod_destino: Optional[int] = None
    usuario_origem: Optional[int] = None
    usuario_destino: Optional[int] = None
    titulo: Optional[str] = None
    observacao: Optional[str] = None
    chave: Optional[str] = None
    dia: Optional[datetime] = None


class MensagemUpdate(BaseModel):
    codigo: Optional[int] = None
    cod_origem: Optional[int] = None
    cod_destino: Optional[int] = None
    usuario_origem: Optional[int] = None
    usuario_destino: Optional[int] = None
    titulo: Optional[str] = None
    observacao: Optional[str] = None
    chave: Optional[str] = None
    dia: Optional[datetime] = None


class MensagemOut(MensagemCreate):
    id: int

    class Config:
        from_attributes = True

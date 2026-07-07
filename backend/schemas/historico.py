from pydantic import BaseModel
from typing import Optional


class HistoricoCreate(BaseModel):
    # Campos migrados de GENUS.HISTORICO
    codigo: Optional[str] = None
    descricao: Optional[str] = None
    debito_credito: Optional[str] = None
    grau: Optional[str] = None
    situacao: Optional[str] = None
    mostrar_dre: Optional[str] = None
    permissao: Optional[str] = None
    tipo: Optional[str] = None


class HistoricoUpdate(BaseModel):
    codigo: Optional[str] = None
    descricao: Optional[str] = None
    debito_credito: Optional[str] = None
    grau: Optional[str] = None
    situacao: Optional[str] = None
    mostrar_dre: Optional[str] = None
    permissao: Optional[str] = None
    tipo: Optional[str] = None


class HistoricoOut(HistoricoCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional


class TipoVendaCreate(BaseModel):
    # Campos migrados de GENUS.TIPOVENDA
    codigo: Optional[int] = None
    descricao: Optional[str] = None
    retirar_estoque: Optional[str] = None
    gerar_financeiro: Optional[str] = None
    entrada_saida: Optional[str] = None
    mostra_relatorio: Optional[str] = None


class TipoVendaUpdate(BaseModel):
    codigo: Optional[int] = None
    descricao: Optional[str] = None
    retirar_estoque: Optional[str] = None
    gerar_financeiro: Optional[str] = None
    entrada_saida: Optional[str] = None
    mostra_relatorio: Optional[str] = None


class TipoVendaOut(TipoVendaCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional


class NotaXmlEntradaCreate(BaseModel):
    # Vínculo com o cabeçalho de entrada já reconhecido neste ERP
    entrada_id: Optional[int] = None

    # Chave natural original da linha no GENUS (mesma chave composta de ENTRADA)
    cod_empresa: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_fornecedor: Optional[int] = None

    # Dados do XML da NF-e recebida
    chave_nfe: Optional[str] = None
    arq_xml: Optional[str] = None


class NotaXmlEntradaUpdate(NotaXmlEntradaCreate):
    pass


class NotaXmlEntradaOut(NotaXmlEntradaCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional


class EntradaFreteCreate(BaseModel):
    # Vínculo com o cabeçalho de entrada já migrado (ver model Entrada)
    entrada_id: Optional[int] = None

    # Identificação / chave bruta da entrada principal (mirror — ver entrada_id acima)
    cod_empresa: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_fornecedor: Optional[int] = None

    # Documento de frete vinculado (2º conjunto de chave — sem FK própria, ver docstring do model)
    cod_empresa2: Optional[int] = None
    tipo_doc2: Optional[str] = None
    doc2: Optional[int] = None
    serie2: Optional[str] = None
    cod_fornecedor2: Optional[int] = None


class EntradaFreteUpdate(EntradaFreteCreate):
    pass


class EntradaFreteOut(EntradaFreteCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional


class ClassificacaoCreate(BaseModel):
    # Campos migrados de GENUS.CLASSIFICACAO
    codigo: Optional[int] = None
    ncm: Optional[str] = None
    cod_produto_tipo: Optional[int] = None
    aliquota_nacional: Optional[float] = None
    aliquota_importado: Optional[float] = None
    cod_cest: Optional[int] = None
    unidade_exportacao: Optional[str] = None
    reforma_cclasstrib: Optional[str] = None
    descricao_ncm: Optional[str] = None


class ClassificacaoUpdate(BaseModel):
    codigo: Optional[int] = None
    ncm: Optional[str] = None
    cod_produto_tipo: Optional[int] = None
    aliquota_nacional: Optional[float] = None
    aliquota_importado: Optional[float] = None
    cod_cest: Optional[int] = None
    unidade_exportacao: Optional[str] = None
    reforma_cclasstrib: Optional[str] = None
    descricao_ncm: Optional[str] = None


class ClassificacaoOut(ClassificacaoCreate):
    id: int

    class Config:
        from_attributes = True

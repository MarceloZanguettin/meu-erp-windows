from pydantic import BaseModel
from typing import Optional


class RegraClienteCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Campos migrados de GENUS.REGRASCLIENTE
    codigo: Optional[int] = None
    cod_produto: Optional[str] = None
    cod_cliente: Optional[int] = None
    cod_classificacao: Optional[int] = None


class RegraClienteUpdate(BaseModel):
    produto_id: Optional[int] = None

    codigo: Optional[int] = None
    cod_produto: Optional[str] = None
    cod_cliente: Optional[int] = None
    cod_classificacao: Optional[int] = None


class RegraClienteOut(RegraClienteCreate):
    id: int

    class Config:
        from_attributes = True

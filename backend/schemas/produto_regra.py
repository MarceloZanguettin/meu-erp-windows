from pydantic import BaseModel
from typing import Optional


class ProdutoRegraCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Campos migrados de GENUS.PRODUTOREGRAS
    cod_produto: Optional[str] = None
    cod_regras: Optional[int] = None


class ProdutoRegraUpdate(BaseModel):
    produto_id: Optional[int] = None

    cod_produto: Optional[str] = None
    cod_regras: Optional[int] = None


class ProdutoRegraOut(ProdutoRegraCreate):
    id: int

    class Config:
        from_attributes = True

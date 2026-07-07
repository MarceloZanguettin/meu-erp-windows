from pydantic import BaseModel
from typing import Optional


class ProdutoBarraCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Campos migrados de GENUS.PRODUTOBARRA
    cod_produto: Optional[str] = None
    codigo_barra: Optional[str] = None


class ProdutoBarraUpdate(BaseModel):
    produto_id: Optional[int] = None

    cod_produto: Optional[str] = None
    codigo_barra: Optional[str] = None


class ProdutoBarraOut(ProdutoBarraCreate):
    id: int

    class Config:
        from_attributes = True

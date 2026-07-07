from pydantic import BaseModel
from typing import Optional


class ProdutoReferenciaCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Campos migrados de GENUS.PRODUTOREFERENCIA
    cod_produto: Optional[str] = None
    ref_fabrica: Optional[str] = None
    cod_fornecedor: Optional[int] = None


class ProdutoReferenciaUpdate(BaseModel):
    produto_id: Optional[int] = None

    cod_produto: Optional[str] = None
    ref_fabrica: Optional[str] = None
    cod_fornecedor: Optional[int] = None


class ProdutoReferenciaOut(ProdutoReferenciaCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional


class ProdutoProcessoCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Campos migrados de GENUS.PRODUTOPROCESSO
    cod_produto: Optional[str] = None
    cod_processo: Optional[int] = None
    tempo_padrao: Optional[str] = None
    observacao: Optional[str] = None
    valor: Optional[float] = None
    ordem: Optional[int] = None


class ProdutoProcessoUpdate(BaseModel):
    produto_id: Optional[int] = None

    cod_produto: Optional[str] = None
    cod_processo: Optional[int] = None
    tempo_padrao: Optional[str] = None
    observacao: Optional[str] = None
    valor: Optional[float] = None
    ordem: Optional[int] = None


class ProdutoProcessoOut(ProdutoProcessoCreate):
    id: int

    class Config:
        from_attributes = True

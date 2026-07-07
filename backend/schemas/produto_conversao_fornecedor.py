from pydantic import BaseModel
from typing import Optional


class ProdutoConversaoFornecedorCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Campos migrados de GENUS.PRODUTOCONVERSAOFORNECEDOR
    cod_produto: Optional[str] = None
    cod_fornecedor: Optional[int] = None
    fator_conversao: Optional[float] = None
    tipo_conversao: Optional[str] = None


class ProdutoConversaoFornecedorUpdate(BaseModel):
    produto_id: Optional[int] = None

    cod_produto: Optional[str] = None
    cod_fornecedor: Optional[int] = None
    fator_conversao: Optional[float] = None
    tipo_conversao: Optional[str] = None


class ProdutoConversaoFornecedorOut(ProdutoConversaoFornecedorCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional


class CotacaoProdutoCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Vínculo com o cabeçalho da cotação de preço já migrado (ver model CotacaoPreco)
    cotacao_preco_id: Optional[int] = None

    # Identificação / chave bruta original (PK composta no GENUS: CODCOTACAO + CODPRODUTO)
    cod_cotacao: Optional[int] = None
    cod_produto: Optional[str] = None

    # Quantidade solicitada na cotação
    qtde: Optional[float] = None


class CotacaoProdutoUpdate(CotacaoProdutoCreate):
    pass


class CotacaoProdutoOut(CotacaoProdutoCreate):
    id: int

    class Config:
        from_attributes = True

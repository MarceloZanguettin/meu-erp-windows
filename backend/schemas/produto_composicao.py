from pydantic import BaseModel
from typing import Optional


class ProdutoComposicaoCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado (duas FKs — ver models/tabelas.py)
    produto_id: Optional[int] = None          # resolvido de GENUS: CODPRODUTO (produto "pai"/acabado)
    produto_materia_id: Optional[int] = None  # resolvido de GENUS: CODMATERIA (produto "componente"/matéria-prima)

    # Campos migrados de GENUS.PRODUTOCOMPOSICAO
    cod_produto: Optional[str] = None
    cod_materia: Optional[str] = None
    cod_id_genus: Optional[int] = None
    cod_processo: Optional[int] = None
    sequencia: Optional[int] = None
    qtde: Optional[float] = None
    qtde_equivalente: Optional[float] = None
    perda: Optional[float] = None


class ProdutoComposicaoUpdate(ProdutoComposicaoCreate):
    pass


class ProdutoComposicaoOut(ProdutoComposicaoCreate):
    id: int

    class Config:
        from_attributes = True

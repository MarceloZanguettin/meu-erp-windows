from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PrecoProdutoCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Campos migrados de GENUS.PRECO
    cod_produto: Optional[str] = None
    cod_empresa: Optional[int] = None
    cod_tabela_preco: Optional[int] = None
    valor: Optional[float] = None
    percentual: Optional[float] = None
    data_hora_alterado_genus: Optional[datetime] = None


class PrecoProdutoUpdate(BaseModel):
    produto_id: Optional[int] = None

    cod_produto: Optional[str] = None
    cod_empresa: Optional[int] = None
    cod_tabela_preco: Optional[int] = None
    valor: Optional[float] = None
    percentual: Optional[float] = None
    data_hora_alterado_genus: Optional[datetime] = None


class PrecoProdutoOut(PrecoProdutoCreate):
    id: int

    class Config:
        from_attributes = True

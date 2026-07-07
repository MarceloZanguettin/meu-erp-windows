from pydantic import BaseModel
from typing import Optional


class ProdutoFotoCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Campos migrados de GENUS.PRODUTOFOTO
    cod_produto: Optional[str] = None
    # BLOB binário (GENUS: FOTO) representado aqui como string base64,
    # já que a API trafega JSON — a conversão para bytes/BYTEA acontece no
    # controller. Nenhum dado de imagem é importado por este agente.
    foto: Optional[str] = None


class ProdutoFotoUpdate(BaseModel):
    produto_id: Optional[int] = None

    cod_produto: Optional[str] = None
    foto: Optional[str] = None


class ProdutoFotoOut(BaseModel):
    id: int
    produto_id: Optional[int] = None
    cod_produto: Optional[str] = None
    foto: Optional[str] = None

    class Config:
        from_attributes = True

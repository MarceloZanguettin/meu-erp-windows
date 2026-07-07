from pydantic import BaseModel
from typing import Optional


class RegraProdutoClienteCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Campos migrados de GENUS.REGRASPRODCLI
    cod_regras: Optional[int] = None
    cod_produto: Optional[str] = None
    cod_cliente: Optional[int] = None


class RegraProdutoClienteUpdate(BaseModel):
    produto_id: Optional[int] = None

    cod_regras: Optional[int] = None
    cod_produto: Optional[str] = None
    cod_cliente: Optional[int] = None


class RegraProdutoClienteOut(RegraProdutoClienteCreate):
    id: int

    class Config:
        from_attributes = True

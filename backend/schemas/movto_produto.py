from pydantic import BaseModel
from typing import Optional


class MovtoProdutoCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado
    produto_id: Optional[int] = None

    # Campos migrados de GENUS.MOVTOPRODUTO
    cod_movto: Optional[int] = None
    cod_empresa: Optional[int] = None
    cod_produto: Optional[str] = None
    ent_sai: Optional[str] = None
    qtde: Optional[float] = None
    valor: Optional[float] = None
    total: Optional[float] = None
    perc_comissao: Optional[float] = None
    cal_comissao: Optional[float] = None
    val_comissao: Optional[float] = None
    lote_produto: Optional[str] = None

    cod_empresa_producao: Optional[int] = None
    codigo_producao: Optional[int] = None
    lote_producao: Optional[str] = None
    cod_produto_principal_producao: Optional[str] = None


class MovtoProdutoUpdate(MovtoProdutoCreate):
    pass


class MovtoProdutoOut(MovtoProdutoCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional
import datetime


class RequisicaoProdutoCreate(BaseModel):
    # Identificação / chave bruta original (PK própria no GENUS: PK_REQUISICAOPRODUTO)
    codigo: Optional[int] = None

    # Vínculo com o cabeçalho da requisição (ver model RequisicaoMateria)
    requisicao_materia_id: Optional[int] = None
    cod_requisicao: Optional[int] = None
    cod_empresa: Optional[int] = None

    # Vínculo com o produto solicitado (ver model Produto)
    produto_id: Optional[int] = None
    cod_produto: Optional[str] = None

    # Quantidade solicitada / produzida
    qtde: Optional[float] = None
    qtde_produzida: Optional[float] = None

    # Entrada / responsável / custo
    dt_entrada: Optional[datetime.datetime] = None
    cod_funcionario: Optional[int] = None
    custo_total: Optional[float] = None
    diferenca: Optional[float] = None
    obs: Optional[str] = None
    status: Optional[str] = None


class RequisicaoProdutoUpdate(RequisicaoProdutoCreate):
    pass


class RequisicaoProdutoOut(RequisicaoProdutoCreate):
    id: int

    class Config:
        from_attributes = True

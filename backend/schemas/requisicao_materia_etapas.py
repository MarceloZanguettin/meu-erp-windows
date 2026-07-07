from pydantic import BaseModel
from typing import Optional
import datetime


class RequisicaoMateriaEtapasCreate(BaseModel):
    # Identificação / chave bruta original (PK própria no GENUS: PK_REQUISICAOMATERIAETAPAS)
    codigo: Optional[int] = None

    # Vínculo com o item de requisição (ver model RequisicaoProduto; FK própria acrescentada retroativamente)
    requisicao_produto_id: Optional[int] = None
    cod_req_produto: Optional[int] = None

    # Dados da etapa/apontamento parcial
    qtde: Optional[float] = None
    dt_entrada: Optional[datetime.datetime] = None
    custo_total: Optional[float] = None


class RequisicaoMateriaEtapasUpdate(RequisicaoMateriaEtapasCreate):
    pass


class RequisicaoMateriaEtapasOut(RequisicaoMateriaEtapasCreate):
    id: int

    class Config:
        from_attributes = True

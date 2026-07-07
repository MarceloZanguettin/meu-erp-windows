from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProdutoExcluidoCreate(BaseModel):
    # Vínculo com o cadastro de produto já migrado (1:1, ver docstring do model)
    produto_id: Optional[int] = None

    # Campos migrados de GENUS.DEL_PRODUTO
    cod_produto: Optional[str] = None
    descricao: Optional[str] = None
    unidade: Optional[str] = None
    cod_grupo: Optional[int] = None
    cod_subgrupo: Optional[int] = None
    cod_marca: Optional[int] = None
    situacao: Optional[str] = None
    ecf_descricao: Optional[str] = None
    qtde_embalagem: Optional[float] = None
    ncm: Optional[str] = None
    cst: Optional[str] = None
    cod_classificacao: Optional[int] = None
    margem_lucro: Optional[float] = None
    marcador: Optional[str] = None
    csosn: Optional[str] = None
    peso_liquido: Optional[float] = None
    peso_bruto: Optional[float] = None
    codigo_interno: Optional[str] = None
    tipo_produto: Optional[str] = None
    validade_dias: Optional[int] = None
    cubicagem: Optional[float] = None
    observacao: Optional[str] = None
    descricao_interna: Optional[str] = None
    referencia: Optional[str] = None
    multiplo_producao: Optional[int] = None
    descricao_detalhada: Optional[str] = None
    cod_cor: Optional[int] = None
    cod_tamanho: Optional[str] = None
    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None
    cod_funcionario_inclusao: Optional[int] = None
    cod_funcionario_alteracao: Optional[int] = None


class ProdutoExcluidoUpdate(BaseModel):
    produto_id: Optional[int] = None

    cod_produto: Optional[str] = None
    descricao: Optional[str] = None
    unidade: Optional[str] = None
    cod_grupo: Optional[int] = None
    cod_subgrupo: Optional[int] = None
    cod_marca: Optional[int] = None
    situacao: Optional[str] = None
    ecf_descricao: Optional[str] = None
    qtde_embalagem: Optional[float] = None
    ncm: Optional[str] = None
    cst: Optional[str] = None
    cod_classificacao: Optional[int] = None
    margem_lucro: Optional[float] = None
    marcador: Optional[str] = None
    csosn: Optional[str] = None
    peso_liquido: Optional[float] = None
    peso_bruto: Optional[float] = None
    codigo_interno: Optional[str] = None
    tipo_produto: Optional[str] = None
    validade_dias: Optional[int] = None
    cubicagem: Optional[float] = None
    observacao: Optional[str] = None
    descricao_interna: Optional[str] = None
    referencia: Optional[str] = None
    multiplo_producao: Optional[int] = None
    descricao_detalhada: Optional[str] = None
    cod_cor: Optional[int] = None
    cod_tamanho: Optional[str] = None
    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None
    cod_funcionario_inclusao: Optional[int] = None
    cod_funcionario_alteracao: Optional[int] = None


class ProdutoExcluidoOut(ProdutoExcluidoCreate):
    id: int

    class Config:
        from_attributes = True

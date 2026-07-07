from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProdutoCreate(BaseModel):
    # Campos originais do ERP
    nome: str = Field(..., min_length=1, max_length=100)
    preco: float = Field(..., ge=0)
    estoque: Optional[int] = 0
    caracteristicas: Optional[dict] = None

    # Campos comerciais do ERP atual (fora da tabela GENUS.PRODUTO)
    codigo_fornecedor: Optional[str] = None
    categoria: Optional[str] = None
    custo: Optional[float] = None
    preco_minimo: Optional[float] = None
    preco_atacado: Optional[float] = None

    # Identificação (GENUS.PRODUTO)
    codigo: Optional[str] = None
    codigo_interno: Optional[str] = None
    codigo_secundario: Optional[str] = None
    referencia: Optional[str] = None
    descricao_interna: Optional[str] = None
    descricao_detalhada: Optional[str] = None
    ecf_descricao: Optional[str] = None
    situacao: Optional[str] = "A"
    marcador: Optional[str] = None
    observacao: Optional[str] = None

    # Classificação
    cod_grupo: Optional[int] = None
    cod_subgrupo: Optional[int] = None
    cod_marca: Optional[int] = None
    cod_classificacao: Optional[int] = None
    cod_cor: Optional[int] = None
    cod_tamanho: Optional[str] = None
    cod_tamanho_produto: Optional[int] = None
    cod_linha: Optional[int] = None
    cod_grade: Optional[int] = None
    cod_produto_grade: Optional[str] = None
    tipo_produto: Optional[str] = None
    tipo: Optional[str] = None
    tipo_produto_fabrica: Optional[str] = None

    # Fiscal
    ncm: Optional[str] = None
    cst: Optional[str] = None
    csosn: Optional[str] = None
    cfop_dentro_estado: Optional[str] = None
    cfop_fora_estado: Optional[str] = None
    origem_mercadoria: Optional[str] = None
    codigo_anp: Optional[str] = None
    cod_contabil_avista: Optional[str] = None
    cod_contabil_prazo: Optional[str] = None
    reforma_cclasstrib: Optional[str] = None
    cod_cbenef: Optional[int] = None

    # Unidades e conversões
    unidade_venda: Optional[str] = None
    unidade_compra: Optional[str] = None
    qtde_embalagem: Optional[float] = None
    fator_conversao: Optional[float] = None
    tipo_conversao: Optional[str] = None
    multiplo_producao: Optional[float] = None
    kg_por_metro: Optional[float] = None
    fator_unde: Optional[float] = None
    kilos_receita: Optional[float] = None
    seq_codigo_barra: Optional[str] = None

    # Pesos e dimensões
    peso_liquido: Optional[float] = None
    peso_bruto: Optional[float] = None
    altura: Optional[float] = None
    largura: Optional[float] = None
    comprimento: Optional[float] = None
    espessura: Optional[float] = None
    cubicagem: Optional[float] = None
    metros_cubicos: Optional[float] = None

    # Comercial / produção
    margem_lucro: Optional[float] = None
    validade_dias: Optional[int] = None
    hora_padrao: Optional[float] = None
    data_seguro: Optional[datetime] = None
    data_licenciamento: Optional[datetime] = None
    relatorio_tabela_preco: Optional[str] = None

    # Ponteiras
    ponteira_tipo: Optional[str] = None
    ponteira_tipo_box: Optional[str] = None
    ponteira_tipo_decote: Optional[str] = None

    # Transferência entre empresas / código antigo
    cod_empresa_transferencia: Optional[int] = None
    cod_empresa_transf1: Optional[int] = None
    cod_empresa_transf2: Optional[int] = None
    cod_antigo_transfere1: Optional[int] = None
    cod_antigo_transfere2: Optional[int] = None

    # Auditoria de origem (GENUS)
    cod_evento: Optional[int] = None
    cod_alteracao: Optional[int] = None
    cod_funcionario_inclusao: Optional[int] = None
    cod_funcionario_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None
    data_hora_alterado_genus: Optional[datetime] = None


class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    preco: Optional[float] = None
    estoque: Optional[int] = None
    caracteristicas: Optional[dict] = None

    codigo_fornecedor: Optional[str] = None
    categoria: Optional[str] = None
    custo: Optional[float] = None
    preco_minimo: Optional[float] = None
    preco_atacado: Optional[float] = None

    codigo: Optional[str] = None
    codigo_interno: Optional[str] = None
    codigo_secundario: Optional[str] = None
    referencia: Optional[str] = None
    descricao_interna: Optional[str] = None
    descricao_detalhada: Optional[str] = None
    ecf_descricao: Optional[str] = None
    situacao: Optional[str] = None
    marcador: Optional[str] = None
    observacao: Optional[str] = None

    cod_grupo: Optional[int] = None
    cod_subgrupo: Optional[int] = None
    cod_marca: Optional[int] = None
    cod_classificacao: Optional[int] = None
    cod_cor: Optional[int] = None
    cod_tamanho: Optional[str] = None
    cod_tamanho_produto: Optional[int] = None
    cod_linha: Optional[int] = None
    cod_grade: Optional[int] = None
    cod_produto_grade: Optional[str] = None
    tipo_produto: Optional[str] = None
    tipo: Optional[str] = None
    tipo_produto_fabrica: Optional[str] = None

    ncm: Optional[str] = None
    cst: Optional[str] = None
    csosn: Optional[str] = None
    cfop_dentro_estado: Optional[str] = None
    cfop_fora_estado: Optional[str] = None
    origem_mercadoria: Optional[str] = None
    codigo_anp: Optional[str] = None
    cod_contabil_avista: Optional[str] = None
    cod_contabil_prazo: Optional[str] = None
    reforma_cclasstrib: Optional[str] = None
    cod_cbenef: Optional[int] = None

    unidade_venda: Optional[str] = None
    unidade_compra: Optional[str] = None
    qtde_embalagem: Optional[float] = None
    fator_conversao: Optional[float] = None
    tipo_conversao: Optional[str] = None
    multiplo_producao: Optional[float] = None
    kg_por_metro: Optional[float] = None
    fator_unde: Optional[float] = None
    kilos_receita: Optional[float] = None
    seq_codigo_barra: Optional[str] = None

    peso_liquido: Optional[float] = None
    peso_bruto: Optional[float] = None
    altura: Optional[float] = None
    largura: Optional[float] = None
    comprimento: Optional[float] = None
    espessura: Optional[float] = None
    cubicagem: Optional[float] = None
    metros_cubicos: Optional[float] = None

    margem_lucro: Optional[float] = None
    validade_dias: Optional[int] = None
    hora_padrao: Optional[float] = None
    data_seguro: Optional[datetime] = None
    data_licenciamento: Optional[datetime] = None
    relatorio_tabela_preco: Optional[str] = None

    ponteira_tipo: Optional[str] = None
    ponteira_tipo_box: Optional[str] = None
    ponteira_tipo_decote: Optional[str] = None

    cod_empresa_transferencia: Optional[int] = None
    cod_empresa_transf1: Optional[int] = None
    cod_empresa_transf2: Optional[int] = None
    cod_antigo_transfere1: Optional[int] = None
    cod_antigo_transfere2: Optional[int] = None

    cod_evento: Optional[int] = None
    cod_alteracao: Optional[int] = None
    cod_funcionario_inclusao: Optional[int] = None
    cod_funcionario_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None
    data_hora_alterado_genus: Optional[datetime] = None


class ProdutoOut(ProdutoCreate):
    id: int

    class Config:
        from_attributes = True

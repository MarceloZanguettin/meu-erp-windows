from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime


# ── Unidade de Medida ─────────────────────────────────────────────────────────

class UnidadeMedidaCreate(BaseModel):
    sigla: str
    descricao: str


class UnidadeMedidaUpdate(BaseModel):
    sigla: Optional[str] = None
    descricao: Optional[str] = None


class UnidadeMedidaOut(BaseModel):
    id: int
    sigla: str
    descricao: str

    class Config:
        from_attributes = True


# ── Grupo/Subgrupo de Produto ──────────────────────────────────────────────────
# GrupoProduto reconhece tanto GENUS.GRUPO quanto GENUS.SUBGRUPO (esta última
# só tem CODIGO/DESCRI, já cobertos por `codigo`/`nome` — ver docstring do
# model GrupoProduto em backend/models/tabelas.py). Uma linha com
# tipo='subgrupo' representa um registro de GENUS.SUBGRUPO.

class GrupoProdutoCreate(BaseModel):
    nome: str
    tipo: Optional[str] = "grupo"

    # Campos migrados de GENUS.GRUPO (ver docstring do model GrupoProduto em
    # backend/models/tabelas.py — CODIGO é a chave que, no futuro, resolve
    # PRODUTO.CODGRUPO -> GRUPO.CODIGO, ou PRODUTO.CODSUBGRUPO ->
    # SUBGRUPO.CODIGO quando tipo='subgrupo'; nenhuma FK criada agora)
    codigo: Optional[int] = None
    enviar_tablet: Optional[str] = None
    ordem: Optional[int] = None
    cod_grupo_antigo1: Optional[int] = None
    cod_grupo_antigo2: Optional[int] = None


class GrupoProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    tipo: Optional[str] = None

    codigo: Optional[int] = None
    enviar_tablet: Optional[str] = None
    ordem: Optional[int] = None
    cod_grupo_antigo1: Optional[int] = None
    cod_grupo_antigo2: Optional[int] = None


class GrupoProdutoOut(BaseModel):
    id: int
    nome: str
    tipo: str

    codigo: Optional[int] = None
    enviar_tablet: Optional[str] = None
    ordem: Optional[int] = None
    cod_grupo_antigo1: Optional[int] = None
    cod_grupo_antigo2: Optional[int] = None

    class Config:
        from_attributes = True


# ── Forma de Pagamento (= CONDPAGTO no GENUS) ─────────────────────────────────

class FormaPagamentoCreate(BaseModel):
    nome: str
    parcelas: Optional[int] = 1
    dias_primeiro_vencimento: Optional[int] = 0
    intervalo_dias: Optional[int] = 30
    acrescimo_percentual: Optional[float] = 0.0

    # Campos migrados de GENUS.CONDPAGTO (ver docstring do model FormaPagamento
    # em backend/models/tabelas.py)
    codigo: Optional[str] = None
    avista_prazo: Optional[str] = None
    baixa_primeira: Optional[str] = None
    dia: Optional[int] = None


class FormaPagamentoUpdate(BaseModel):
    nome: Optional[str] = None
    parcelas: Optional[int] = None
    dias_primeiro_vencimento: Optional[int] = None
    intervalo_dias: Optional[int] = None
    acrescimo_percentual: Optional[float] = None

    codigo: Optional[str] = None
    avista_prazo: Optional[str] = None
    baixa_primeira: Optional[str] = None
    dia: Optional[int] = None


class FormaPagamentoOut(BaseModel):
    id: int
    nome: str
    parcelas: int
    dias_primeiro_vencimento: int
    intervalo_dias: int
    acrescimo_percentual: float

    codigo: Optional[str] = None
    avista_prazo: Optional[str] = None
    baixa_primeira: Optional[str] = None
    dia: Optional[int] = None

    class Config:
        from_attributes = True


# ── Plano de Contas ───────────────────────────────────────────────────────────

class PlanoContaCreate(BaseModel):
    codigo: str
    descricao: str
    tipo: str
    pai_id: Optional[int] = None


class PlanoContaUpdate(BaseModel):
    codigo: Optional[str] = None
    descricao: Optional[str] = None
    tipo: Optional[str] = None
    pai_id: Optional[int] = None


class PlanoContaOut(BaseModel):
    id: int
    codigo: str
    descricao: str
    tipo: str
    pai_id: Optional[int]

    class Config:
        from_attributes = True


# ── Centro de Custo ───────────────────────────────────────────────────────────

class CentroCustoCreate(BaseModel):
    codigo: str
    nome: str
    ativo: Optional[bool] = True

    # Campos migrados de GENUS.CENTROCUSTO (ver docstring do model CentroCusto
    # em backend/models/tabelas.py — não é o mesmo conceito de "centro de
    # custo" contábil; é a extensão de PRODUTO por empresa/filial do GENUS)
    cod_produto: Optional[str] = None
    cod_empresa: Optional[int] = None
    pertence_empresa: Optional[str] = None

    ecf_aliquota: Optional[str] = None
    custo: Optional[float] = None
    venda: Optional[float] = None
    frete: Optional[float] = None
    minimo: Optional[float] = None
    maximo: Optional[float] = None
    qtde: Optional[float] = None
    consignacao: Optional[float] = None
    valor_promocao: Optional[float] = None
    inicio_promocao: Optional[datetime] = None
    fim_promocao: Optional[datetime] = None
    estoque_cliente: Optional[float] = None
    custo_fixo: Optional[float] = None
    margem_lucro: Optional[float] = None
    comissao: Optional[float] = None
    avista: Optional[float] = None
    comissao_avista: Optional[float] = None
    percentual_avista: Optional[float] = None
    preco_minimo: Optional[float] = None
    percentual_a_prazo: Optional[float] = None
    percentual_minimo: Optional[float] = None
    ultimo_custo: Optional[float] = None
    custo_medio: Optional[float] = None
    preco_sugerido: Optional[float] = None
    unitario_compra: Optional[float] = None
    fornecedor_compra: Optional[int] = None
    mao_de_obra: Optional[float] = None
    custo_materia: Optional[float] = None
    localizacao_produto: Optional[str] = None

    estoque_reservado: Optional[float] = None
    fisico: Optional[float] = None

    reducao_icms: Optional[float] = None
    diferenca_subst: Optional[float] = None
    diferenca_icms: Optional[float] = None
    ipi_entrada: Optional[float] = None
    ipi_cst_entrada: Optional[str] = None
    ipi_cst_saida: Optional[str] = None
    pis_cst: Optional[str] = None
    pis_aliquota: Optional[float] = None
    pis_reais: Optional[float] = None
    pis_cst_entrada: Optional[str] = None
    pis_aliquota_entrada: Optional[float] = None
    pis_reais_entrada: Optional[float] = None
    cofins_cst: Optional[str] = None
    cofins_aliquota: Optional[float] = None
    cofins_reais: Optional[float] = None
    cofins_cst_entrada: Optional[str] = None
    cofins_aliquota_entrada: Optional[float] = None
    cofins_reais_entrada: Optional[float] = None

    tecla_balanca: Optional[int] = None
    tipo_balanca: Optional[str] = None
    cod_balanca: Optional[int] = None
    validade: Optional[int] = None

    data_aquisicao: Optional[datetime] = None
    nota_patrimonio: Optional[int] = None
    cod_patrimonio: Optional[int] = None
    valor_patrimonio: Optional[float] = None
    data_garantia: Optional[datetime] = None
    data_depreciacao: Optional[datetime] = None
    taxa_depreciacao: Optional[float] = None
    valor_depreciacao: Optional[float] = None
    data_revisao: Optional[datetime] = None
    placa: Optional[str] = None
    chassi: Optional[str] = None
    capacidade: Optional[float] = None
    troca_oleo_km: Optional[int] = None
    data_troca_oleo: Optional[datetime] = None

    data_alteracao_genus: Optional[datetime] = None
    data_hora_alterado_genus: Optional[datetime] = None


class CentroCustoUpdate(BaseModel):
    codigo: Optional[str] = None
    nome: Optional[str] = None
    ativo: Optional[bool] = None

    cod_produto: Optional[str] = None
    cod_empresa: Optional[int] = None
    pertence_empresa: Optional[str] = None

    ecf_aliquota: Optional[str] = None
    custo: Optional[float] = None
    venda: Optional[float] = None
    frete: Optional[float] = None
    minimo: Optional[float] = None
    maximo: Optional[float] = None
    qtde: Optional[float] = None
    consignacao: Optional[float] = None
    valor_promocao: Optional[float] = None
    inicio_promocao: Optional[datetime] = None
    fim_promocao: Optional[datetime] = None
    estoque_cliente: Optional[float] = None
    custo_fixo: Optional[float] = None
    margem_lucro: Optional[float] = None
    comissao: Optional[float] = None
    avista: Optional[float] = None
    comissao_avista: Optional[float] = None
    percentual_avista: Optional[float] = None
    preco_minimo: Optional[float] = None
    percentual_a_prazo: Optional[float] = None
    percentual_minimo: Optional[float] = None
    ultimo_custo: Optional[float] = None
    custo_medio: Optional[float] = None
    preco_sugerido: Optional[float] = None
    unitario_compra: Optional[float] = None
    fornecedor_compra: Optional[int] = None
    mao_de_obra: Optional[float] = None
    custo_materia: Optional[float] = None
    localizacao_produto: Optional[str] = None

    estoque_reservado: Optional[float] = None
    fisico: Optional[float] = None

    reducao_icms: Optional[float] = None
    diferenca_subst: Optional[float] = None
    diferenca_icms: Optional[float] = None
    ipi_entrada: Optional[float] = None
    ipi_cst_entrada: Optional[str] = None
    ipi_cst_saida: Optional[str] = None
    pis_cst: Optional[str] = None
    pis_aliquota: Optional[float] = None
    pis_reais: Optional[float] = None
    pis_cst_entrada: Optional[str] = None
    pis_aliquota_entrada: Optional[float] = None
    pis_reais_entrada: Optional[float] = None
    cofins_cst: Optional[str] = None
    cofins_aliquota: Optional[float] = None
    cofins_reais: Optional[float] = None
    cofins_cst_entrada: Optional[str] = None
    cofins_aliquota_entrada: Optional[float] = None
    cofins_reais_entrada: Optional[float] = None

    tecla_balanca: Optional[int] = None
    tipo_balanca: Optional[str] = None
    cod_balanca: Optional[int] = None
    validade: Optional[int] = None

    data_aquisicao: Optional[datetime] = None
    nota_patrimonio: Optional[int] = None
    cod_patrimonio: Optional[int] = None
    valor_patrimonio: Optional[float] = None
    data_garantia: Optional[datetime] = None
    data_depreciacao: Optional[datetime] = None
    taxa_depreciacao: Optional[float] = None
    valor_depreciacao: Optional[float] = None
    data_revisao: Optional[datetime] = None
    placa: Optional[str] = None
    chassi: Optional[str] = None
    capacidade: Optional[float] = None
    troca_oleo_km: Optional[int] = None
    data_troca_oleo: Optional[datetime] = None

    data_alteracao_genus: Optional[datetime] = None
    data_hora_alterado_genus: Optional[datetime] = None


class CentroCustoOut(CentroCustoCreate):
    id: int

    class Config:
        from_attributes = True


# ── Depósito ──────────────────────────────────────────────────────────────────

class DepositoCreate(BaseModel):
    nome: str
    descricao: Optional[str] = None
    ativo: Optional[bool] = True


class DepositoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    ativo: Optional[bool] = None


class DepositoOut(BaseModel):
    id: int
    nome: str
    descricao: Optional[str]
    ativo: bool

    class Config:
        from_attributes = True


# ── Cliente Completo ──────────────────────────────────────────────────────────

class ClienteCompletoCreate(BaseModel):
    tipo_pessoa: Optional[str] = "PJ"
    nome: str
    nome_fantasia: Optional[str] = None
    documento: Optional[str] = None
    rg_ie: Optional[str] = None
    data_nascimento: Optional[datetime] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    celular: Optional[str] = None
    cep: Optional[str] = None
    logradouro: Optional[str] = None
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    uf: Optional[str] = None
    limite_credito: Optional[float] = 0.0
    forma_pagamento_id: Optional[int] = None
    representante_id: Optional[int] = None
    transportadora_id: Optional[int] = None
    observacao: Optional[str] = None
    ativo: Optional[bool] = True

    # Campos migrados de GENUS.CLIENTE (ver docstring do model ClienteCompleto
    # em backend/models/tabelas.py — a entidade completa exige JOIN com
    # CADASTRO via cod_cadastro)
    cod_cadastro: Optional[int] = None
    cod_naturalidade: Optional[int] = None

    limite: Optional[float] = None
    cobranca: Optional[int] = None
    bloqueado: Optional[str] = None

    dependente: Optional[int] = None
    contato: Optional[str] = None

    renda: Optional[float] = None
    trabalho: Optional[str] = None
    fone_trabalho: Optional[str] = None
    data_admissao: Optional[datetime] = None
    contato_trabalho: Optional[str] = None

    orgao_exp: Optional[str] = None
    data_expedicao: Optional[datetime] = None

    cob_endereco: Optional[str] = None
    cob_bairro: Optional[str] = None
    cob_cep: Optional[str] = None
    cob_cod_cidade: Optional[int] = None

    cnae: Optional[str] = None
    cod_representante: Optional[int] = None
    cod_regiao: Optional[int] = None
    cod_cfop: Optional[str] = None
    cod_transportador: Optional[int] = None
    cod_carteira: Optional[int] = None
    cod_contas: Optional[int] = None
    cod_cond_pagto: Optional[str] = None
    tipo_comercio: Optional[str] = None
    agregar_ipi: Optional[str] = None
    reduzir_base_st: Optional[str] = None
    carga_media_trib: Optional[float] = None
    valor_km_rodado: Optional[float] = None
    acrescimo: Optional[float] = None
    cod_alternativo: Optional[int] = None
    cod_tipo_venda: Optional[int] = None
    operadora: Optional[str] = None
    cod_tabela_preco: Optional[int] = None
    prod_rural: Optional[str] = None
    dias_recorrencia: Optional[int] = None
    calcular_difal: Optional[str] = None
    nao_destacar_icms: Optional[str] = None
    reduzir_icms_base_pis_cofins: Optional[str] = None
    reforma_cclasstrib: Optional[str] = None

    data_imp_lgpd: Optional[datetime] = None
    data_dev_lgpd: Optional[datetime] = None
    hora_imp_lgpd: Optional[str] = None
    hora_dev_lgpd: Optional[str] = None
    cod_funcionario_lgpd: Optional[int] = None


class ClienteCompletoUpdate(BaseModel):
    tipo_pessoa: Optional[str] = None
    nome: Optional[str] = None
    nome_fantasia: Optional[str] = None
    documento: Optional[str] = None
    rg_ie: Optional[str] = None
    data_nascimento: Optional[datetime] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    celular: Optional[str] = None
    cep: Optional[str] = None
    logradouro: Optional[str] = None
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    uf: Optional[str] = None
    limite_credito: Optional[float] = None
    forma_pagamento_id: Optional[int] = None
    representante_id: Optional[int] = None
    transportadora_id: Optional[int] = None
    observacao: Optional[str] = None
    ativo: Optional[bool] = None

    cod_cadastro: Optional[int] = None
    cod_naturalidade: Optional[int] = None

    limite: Optional[float] = None
    cobranca: Optional[int] = None
    bloqueado: Optional[str] = None

    dependente: Optional[int] = None
    contato: Optional[str] = None

    renda: Optional[float] = None
    trabalho: Optional[str] = None
    fone_trabalho: Optional[str] = None
    data_admissao: Optional[datetime] = None
    contato_trabalho: Optional[str] = None

    orgao_exp: Optional[str] = None
    data_expedicao: Optional[datetime] = None

    cob_endereco: Optional[str] = None
    cob_bairro: Optional[str] = None
    cob_cep: Optional[str] = None
    cob_cod_cidade: Optional[int] = None

    cnae: Optional[str] = None
    cod_representante: Optional[int] = None
    cod_regiao: Optional[int] = None
    cod_cfop: Optional[str] = None
    cod_transportador: Optional[int] = None
    cod_carteira: Optional[int] = None
    cod_contas: Optional[int] = None
    cod_cond_pagto: Optional[str] = None
    tipo_comercio: Optional[str] = None
    agregar_ipi: Optional[str] = None
    reduzir_base_st: Optional[str] = None
    carga_media_trib: Optional[float] = None
    valor_km_rodado: Optional[float] = None
    acrescimo: Optional[float] = None
    cod_alternativo: Optional[int] = None
    cod_tipo_venda: Optional[int] = None
    operadora: Optional[str] = None
    cod_tabela_preco: Optional[int] = None
    prod_rural: Optional[str] = None
    dias_recorrencia: Optional[int] = None
    calcular_difal: Optional[str] = None
    nao_destacar_icms: Optional[str] = None
    reduzir_icms_base_pis_cofins: Optional[str] = None
    reforma_cclasstrib: Optional[str] = None

    data_imp_lgpd: Optional[datetime] = None
    data_dev_lgpd: Optional[datetime] = None
    hora_imp_lgpd: Optional[str] = None
    hora_dev_lgpd: Optional[str] = None
    cod_funcionario_lgpd: Optional[int] = None


class ClienteCompletoOut(BaseModel):
    id: int
    tipo_pessoa: str
    nome: str
    nome_fantasia: Optional[str]
    documento: Optional[str]
    rg_ie: Optional[str]
    data_nascimento: Optional[datetime]
    email: Optional[str]
    telefone: Optional[str]
    celular: Optional[str]
    cep: Optional[str]
    logradouro: Optional[str]
    numero: Optional[str]
    complemento: Optional[str]
    bairro: Optional[str]
    cidade: Optional[str]
    uf: Optional[str]
    limite_credito: float
    forma_pagamento_id: Optional[int]
    representante_id: Optional[int]
    transportadora_id: Optional[int]
    observacao: Optional[str]
    ativo: bool
    criado_em: Optional[datetime]

    cod_cadastro: Optional[int] = None
    cod_naturalidade: Optional[int] = None

    limite: Optional[float] = None
    cobranca: Optional[int] = None
    bloqueado: Optional[str] = None

    dependente: Optional[int] = None
    contato: Optional[str] = None

    renda: Optional[float] = None
    trabalho: Optional[str] = None
    fone_trabalho: Optional[str] = None
    data_admissao: Optional[datetime] = None
    contato_trabalho: Optional[str] = None

    orgao_exp: Optional[str] = None
    data_expedicao: Optional[datetime] = None

    cob_endereco: Optional[str] = None
    cob_bairro: Optional[str] = None
    cob_cep: Optional[str] = None
    cob_cod_cidade: Optional[int] = None

    cnae: Optional[str] = None
    cod_representante: Optional[int] = None
    cod_regiao: Optional[int] = None
    cod_cfop: Optional[str] = None
    cod_transportador: Optional[int] = None
    cod_carteira: Optional[int] = None
    cod_contas: Optional[int] = None
    cod_cond_pagto: Optional[str] = None
    tipo_comercio: Optional[str] = None
    agregar_ipi: Optional[str] = None
    reduzir_base_st: Optional[str] = None
    carga_media_trib: Optional[float] = None
    valor_km_rodado: Optional[float] = None
    acrescimo: Optional[float] = None
    cod_alternativo: Optional[int] = None
    cod_tipo_venda: Optional[int] = None
    operadora: Optional[str] = None
    cod_tabela_preco: Optional[int] = None
    prod_rural: Optional[str] = None
    dias_recorrencia: Optional[int] = None
    calcular_difal: Optional[str] = None
    nao_destacar_icms: Optional[str] = None
    reduzir_icms_base_pis_cofins: Optional[str] = None
    reforma_cclasstrib: Optional[str] = None

    data_imp_lgpd: Optional[datetime] = None
    data_dev_lgpd: Optional[datetime] = None
    hora_imp_lgpd: Optional[str] = None
    hora_dev_lgpd: Optional[str] = None
    cod_funcionario_lgpd: Optional[int] = None

    class Config:
        from_attributes = True


# ── Fornecedor ────────────────────────────────────────────────────────────────

class FornecedorCreate(BaseModel):
    tipo_pessoa: Optional[str] = "PJ"
    nome: str
    nome_fantasia: Optional[str] = None
    cnpj: Optional[str] = None
    ie: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    celular: Optional[str] = None
    website: Optional[str] = None
    cep: Optional[str] = None
    logradouro: Optional[str] = None
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    uf: Optional[str] = None
    prazo_entrega_dias: Optional[int] = 0
    forma_pagamento_id: Optional[int] = None
    observacao: Optional[str] = None
    ativo: Optional[bool] = True

    # Campos migrados de GENUS.FORNECEDOR (ver docstring do model Fornecedor
    # em backend/models/tabelas.py — a entidade completa exige JOIN com
    # CADASTRO via cod_cadastro)
    cod_cadastro: Optional[int] = None
    filial: Optional[int] = None
    empresa_fornecedor: Optional[str] = None
    contato: Optional[str] = None
    cnae: Optional[str] = None
    cod_historico: Optional[str] = None
    cod_cfop: Optional[str] = None
    cod_cond_pagto: Optional[str] = None
    cod_transporte: Optional[int] = None
    taxa_compra: Optional[float] = None


class FornecedorUpdate(BaseModel):
    tipo_pessoa: Optional[str] = None
    nome: Optional[str] = None
    nome_fantasia: Optional[str] = None
    cnpj: Optional[str] = None
    ie: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    celular: Optional[str] = None
    website: Optional[str] = None
    cep: Optional[str] = None
    logradouro: Optional[str] = None
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    uf: Optional[str] = None
    prazo_entrega_dias: Optional[int] = None
    forma_pagamento_id: Optional[int] = None
    observacao: Optional[str] = None
    ativo: Optional[bool] = None

    cod_cadastro: Optional[int] = None
    filial: Optional[int] = None
    empresa_fornecedor: Optional[str] = None
    contato: Optional[str] = None
    cnae: Optional[str] = None
    cod_historico: Optional[str] = None
    cod_cfop: Optional[str] = None
    cod_cond_pagto: Optional[str] = None
    cod_transporte: Optional[int] = None
    taxa_compra: Optional[float] = None


class FornecedorOut(BaseModel):
    id: int
    tipo_pessoa: str
    nome: str
    nome_fantasia: Optional[str]
    cnpj: Optional[str]
    ie: Optional[str]
    email: Optional[str]
    telefone: Optional[str]
    celular: Optional[str]
    website: Optional[str]
    cep: Optional[str]
    logradouro: Optional[str]
    numero: Optional[str]
    complemento: Optional[str]
    bairro: Optional[str]
    cidade: Optional[str]
    uf: Optional[str]
    prazo_entrega_dias: int
    forma_pagamento_id: Optional[int]
    observacao: Optional[str]
    ativo: bool
    criado_em: Optional[datetime]

    cod_cadastro: Optional[int] = None
    filial: Optional[int] = None
    empresa_fornecedor: Optional[str] = None
    contato: Optional[str] = None
    cnae: Optional[str] = None
    cod_historico: Optional[str] = None
    cod_cfop: Optional[str] = None
    cod_cond_pagto: Optional[str] = None
    cod_transporte: Optional[int] = None
    taxa_compra: Optional[float] = None

    class Config:
        from_attributes = True


# ── Transportadora ────────────────────────────────────────────────────────────

# Campos migrados de GENUS.TRANSPORTADOR comuns a Create/Update/Out (ver
# docstring do model Transportadora em backend/models/tabelas.py — a
# entidade completa exige JOIN com CADASTRO via cod_cadastro)
class _GenusTransportadoraMixin(BaseModel):
    cod_cadastro: Optional[int] = None
    placa: Optional[str] = None
    insc_inss: Optional[str] = None
    insc_iss: Optional[str] = None
    cra_sp: Optional[str] = None
    antt: Optional[str] = None


class TransportadoraCreate(_GenusTransportadoraMixin):
    nome: str
    cnpj: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    cep: Optional[str] = None
    logradouro: Optional[str] = None
    numero: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    uf: Optional[str] = None
    observacao: Optional[str] = None
    ativo: Optional[bool] = True


class TransportadoraUpdate(_GenusTransportadoraMixin):
    nome: Optional[str] = None
    cnpj: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    cep: Optional[str] = None
    logradouro: Optional[str] = None
    numero: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    uf: Optional[str] = None
    observacao: Optional[str] = None
    ativo: Optional[bool] = None


class TransportadoraOut(_GenusTransportadoraMixin):
    id: int
    nome: str
    cnpj: Optional[str]
    email: Optional[str]
    telefone: Optional[str]
    cep: Optional[str]
    logradouro: Optional[str]
    numero: Optional[str]
    bairro: Optional[str]
    cidade: Optional[str]
    uf: Optional[str]
    observacao: Optional[str]
    ativo: bool

    class Config:
        from_attributes = True


# ── Representante ─────────────────────────────────────────────────────────────

# Campos migrados de GENUS.REPRESENTANTE comuns a Create/Update/Out (ver
# docstring do model Representante em backend/models/tabelas.py — a
# entidade completa exige JOIN com CADASTRO via cod_cadastro)
class _GenusRepresentanteMixin(BaseModel):
    cod_cadastro: Optional[int] = None
    cod_empresa: Optional[int] = None
    banco: Optional[str] = None
    agencia: Optional[str] = None
    digito_agencia: Optional[str] = None
    conta: Optional[int] = None
    digito_conta: Optional[str] = None
    contato: Optional[str] = None
    comissao: Optional[float] = None
    dt_admissao: Optional[datetime] = None
    dt_demissao: Optional[datetime] = None
    cod_supervisor: Optional[int] = None
    cod_gerente: Optional[int] = None
    nivel_hierarquico: Optional[str] = None
    tipo_comissao: Optional[str] = None


class RepresentanteCreate(_GenusRepresentanteMixin):
    nome: str
    cpf_cnpj: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    celular: Optional[str] = None
    comissao_percentual: Optional[float] = 0.0
    meta_mensal: Optional[float] = 0.0
    ativo: Optional[bool] = True


class RepresentanteUpdate(_GenusRepresentanteMixin):
    nome: Optional[str] = None
    cpf_cnpj: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    celular: Optional[str] = None
    comissao_percentual: Optional[float] = None
    meta_mensal: Optional[float] = None
    ativo: Optional[bool] = None


class RepresentanteOut(_GenusRepresentanteMixin):
    id: int
    nome: str
    cpf_cnpj: Optional[str]
    email: Optional[str]
    telefone: Optional[str]
    celular: Optional[str]
    comissao_percentual: float
    meta_mensal: float
    ativo: bool

    class Config:
        from_attributes = True


# ── Funcionário ───────────────────────────────────────────────────────────────

# Campos migrados de GENUS.FUNCIONARIO comuns a Create/Update/Out (ver
# docstring do model Funcionario em backend/models/tabelas.py — a entidade
# completa exige JOIN com CADASTRO via cod_cadastro)
class _GenusFuncionarioMixin(BaseModel):
    cod_cadastro: Optional[int] = None
    cod_empresa: Optional[int] = None
    cadastro_cliente: Optional[str] = None

    nivel: Optional[str] = None
    senha: Optional[str] = None
    usuario: Optional[str] = None
    cod_grupo_menu: Optional[int] = None
    alterar_login: Optional[str] = None
    bloq_visualizar_funcionarios: Optional[str] = None

    banco: Optional[str] = None
    agencia: Optional[str] = None
    digito_agencia: Optional[str] = None
    conta: Optional[str] = None
    digito_conta: Optional[str] = None

    cod_contas: Optional[int] = None
    caixa: Optional[str] = None

    smtp_porta: Optional[int] = None
    smtp_host: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_username: Optional[str] = None
    from_address: Optional[str] = None
    from_name: Optional[str] = None
    autenticar_email_ssl: Optional[str] = None

    cod_cargo: Optional[int] = None
    cod_funcao: Optional[int] = None
    cod_setor: Optional[int] = None
    n_carteira: Optional[str] = None
    camisa: Optional[str] = None
    sapato: Optional[str] = None
    calca: Optional[str] = None

    horas_trabalhadas: Optional[str] = None
    horas_efetivas: Optional[str] = None
    data_demissao: Optional[datetime] = None

    ctps: Optional[str] = None
    serie: Optional[str] = None
    emissao_ctps: Optional[datetime] = None
    uf_ctps: Optional[str] = None
    cbo: Optional[str] = None

    vendedor: Optional[str] = None

    exibe_dados: Optional[str] = None
    liberar_pre_pedido: Optional[str] = None
    consultar_produto: Optional[str] = None
    receber_cotacao_email: Optional[str] = None
    permitir_anexo_cliente: Optional[str] = None
    permitir_inativar_clientes: Optional[str] = None
    permitir_campo_bloqueado_cliente: Optional[str] = None
    aprovar_pre_pedido: Optional[str] = None
    visualizar_cotacao_preco: Optional[str] = None
    alterar_limite_cliente: Optional[str] = None
    permitir_imprimir_lgpd_cliente: Optional[str] = None
    permitir_anexo_funcionario: Optional[str] = None

    permitir_acessar_cond_pagamento: Optional[str] = None
    permitir_alterar_juros: Optional[str] = None
    permitir_baixar_alterar_parcelas: Optional[str] = None
    permitir_tornar_parcelas_pendentes: Optional[str] = None
    permitir_redefinir_parcelas: Optional[str] = None
    permitir_excluir_pagar_receber: Optional[str] = None

    permitir_visualizar_custo: Optional[str] = None
    permitir_alterar_romaneio_fechado: Optional[str] = None
    permitir_excluir_romaneio: Optional[str] = None
    permitir_alterar_unit_saidas: Optional[str] = None
    acessar_menu_batelada: Optional[str] = None

    cod_antigo_transfere1: Optional[int] = None
    cod_antigo_transfere2: Optional[int] = None
    cod_empresa_transf1: Optional[int] = None
    cod_empresa_transf2: Optional[int] = None


class FuncionarioCreate(_GenusFuncionarioMixin):
    nome: str
    cpf: Optional[str] = None
    rg: Optional[str] = None
    data_nascimento: Optional[datetime] = None
    data_admissao: Optional[datetime] = None
    cargo: Optional[str] = None
    departamento: Optional[str] = None
    salario: Optional[float] = 0.0
    email: Optional[str] = None
    telefone: Optional[str] = None
    cep: Optional[str] = None
    logradouro: Optional[str] = None
    numero: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    uf: Optional[str] = None
    ativo: Optional[bool] = True


class FuncionarioUpdate(_GenusFuncionarioMixin):
    nome: Optional[str] = None
    cpf: Optional[str] = None
    rg: Optional[str] = None
    data_nascimento: Optional[datetime] = None
    data_admissao: Optional[datetime] = None
    cargo: Optional[str] = None
    departamento: Optional[str] = None
    salario: Optional[float] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    cep: Optional[str] = None
    logradouro: Optional[str] = None
    numero: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    uf: Optional[str] = None
    ativo: Optional[bool] = None


class FuncionarioOut(_GenusFuncionarioMixin):
    id: int
    nome: str
    cpf: Optional[str]
    rg: Optional[str]
    data_nascimento: Optional[datetime]
    data_admissao: Optional[datetime]
    cargo: Optional[str]
    departamento: Optional[str]
    salario: float
    email: Optional[str]
    telefone: Optional[str]
    cep: Optional[str]
    logradouro: Optional[str]
    numero: Optional[str]
    bairro: Optional[str]
    cidade: Optional[str]
    uf: Optional[str]
    ativo: bool

    class Config:
        from_attributes = True


# ── Perfil de Acesso ──────────────────────────────────────────────────────────

class PerfilAcessoCreate(BaseModel):
    nome: str
    descricao: Optional[str] = None
    permissoes: Optional[Dict[str, Any]] = {}


class PerfilAcessoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    permissoes: Optional[Dict[str, Any]] = None


class PerfilAcessoOut(BaseModel):
    id: int
    nome: str
    descricao: Optional[str]
    permissoes: Optional[Dict[str, Any]]

    class Config:
        from_attributes = True

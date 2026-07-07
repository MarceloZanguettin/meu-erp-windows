from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Orçamento ─────────────────────────────────────────────────────────────────

class ItemOrcamentoCreate(BaseModel):
    produto_id: Optional[int] = None
    descricao: str
    quantidade: float
    preco_unitario: float
    desconto_percentual: Optional[float] = 0.0
    unidade: Optional[str] = None


class ItemOrcamentoOut(BaseModel):
    id: int
    orcamento_id: int
    produto_id: Optional[int]
    descricao: str
    quantidade: float
    preco_unitario: float
    desconto_percentual: float
    unidade: Optional[str]

    class Config:
        from_attributes = True


# Campos migrados de GENUS.ORCAMENTO, compartilhados por Create/Update/Out
# (ver comentários "# GENUS: COLUNA" em models/tabelas.py::Orcamento)
class _OrcamentoGenusMixin(BaseModel):
    cod_empresa: Optional[int] = None
    codigo_genus: Optional[int] = None
    cod_cliente: Optional[int] = None

    cod_cond_pagto: Optional[str] = None
    cod_funcionario: Optional[int] = None
    avista_prazo: Optional[str] = None
    dt_pedido: Optional[datetime] = None
    liberado: Optional[str] = None
    dt_liberado: Optional[datetime] = None
    cod_adm: Optional[int] = None

    cli_endereco: Optional[str] = None
    cli_numero: Optional[str] = None
    cli_cod_cidade: Optional[int] = None
    cli_cep: Optional[str] = None
    cli_fone: Optional[str] = None
    cli_contato: Optional[str] = None
    cli_bairro: Optional[str] = None
    cli_cpf_cnpj: Optional[str] = None

    frete: Optional[float] = None
    cod_transportador: Optional[int] = None
    tipo_frete: Optional[str] = None
    cod_tabela_preco: Optional[int] = None

    status_genus: Optional[str] = None
    motivo: Optional[str] = None
    prazo_entrega: Optional[datetime] = None

    cod_agregado: Optional[int] = None
    especie: Optional[str] = None


class OrcamentoCreate(_OrcamentoGenusMixin):
    cliente_id: Optional[int] = None
    nome_cliente: Optional[str] = None
    data_validade: Optional[datetime] = None
    forma_pagamento_id: Optional[int] = None
    representante_id: Optional[int] = None
    desconto_percentual: Optional[float] = 0.0
    observacao: Optional[str] = None
    itens: List[ItemOrcamentoCreate] = []


class OrcamentoUpdate(_OrcamentoGenusMixin):
    cliente_id: Optional[int] = None
    nome_cliente: Optional[str] = None
    data_validade: Optional[datetime] = None
    status: Optional[str] = None
    forma_pagamento_id: Optional[int] = None
    representante_id: Optional[int] = None
    desconto_percentual: Optional[float] = None
    observacao: Optional[str] = None
    itens: Optional[List[ItemOrcamentoCreate]] = None


class OrcamentoOut(_OrcamentoGenusMixin):
    id: int
    numero: str
    cliente_id: Optional[int]
    nome_cliente: Optional[str]
    data_emissao: datetime
    data_validade: Optional[datetime]
    status: str
    forma_pagamento_id: Optional[int]
    representante_id: Optional[int]
    desconto_percentual: float
    total: float
    observacao: Optional[str]
    itens: List[ItemOrcamentoOut] = []

    class Config:
        from_attributes = True


# ── Pedido de Venda ───────────────────────────────────────────────────────────

class ItemPedidoVendaCreate(BaseModel):
    produto_id: Optional[int] = None
    descricao: str
    quantidade: float
    preco_unitario: float
    desconto_percentual: Optional[float] = 0.0
    unidade: Optional[str] = None


class ItemPedidoVendaOut(BaseModel):
    id: int
    pedido_id: int
    produto_id: Optional[int]
    descricao: str
    quantidade: float
    preco_unitario: float
    desconto_percentual: float
    unidade: Optional[str]

    class Config:
        from_attributes = True


# Campos migrados de GENUS.PEDIDO, compartilhados por Create/Update/Out
# (ver comentários "# GENUS: COLUNA" em models/tabelas.py::PedidoVenda)
class _PedidoVendaGenusMixin(BaseModel):
    cod_empresa: Optional[int] = None
    codigo_genus: Optional[int] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_cliente: Optional[int] = None
    cod_representante: Optional[int] = None
    cod_cond_pagto: Optional[str] = None
    cod_chave: Optional[int] = None

    cod_cfop: Optional[str] = None
    cod_cfop2: Optional[str] = None
    icms_base: Optional[float] = None
    icms_valor: Optional[float] = None
    icms_base_subst: Optional[float] = None
    icms_valor_subst: Optional[float] = None
    ipi_valor: Optional[float] = None
    credito_icms: Optional[float] = None
    tipo_nf: Optional[str] = None
    tipo_cliente: Optional[str] = None
    cte: Optional[int] = None
    numero_nf: Optional[int] = None
    total_nf: Optional[float] = None

    valor_produtos: Optional[float] = None
    quantidade_genus: Optional[str] = None
    peso_bruto_genus: Optional[str] = None
    peso_liquido_genus: Optional[str] = None
    valor_unit: Optional[float] = None
    qtde_kg: Optional[float] = None
    valor_kg: Optional[float] = None

    frete: Optional[float] = None
    seguro: Optional[float] = None
    outras_despesas: Optional[float] = None
    cod_transportador: Optional[int] = None
    frete_conta: Optional[str] = None
    tipo_frete: Optional[str] = None
    perc_frete: Optional[float] = None
    valor_frete: Optional[float] = None
    frete_interno: Optional[float] = None
    tipo_transporte: Optional[str] = None
    local_entrega: Optional[str] = None
    voltagem: Optional[int] = None

    desc_acres: Optional[float] = None
    descto1: Optional[float] = None
    descto2: Optional[float] = None
    descto3: Optional[float] = None
    descto4: Optional[float] = None
    descto5: Optional[float] = None
    perc_desconto: Optional[float] = None
    desconto_interno: Optional[float] = None
    perc_divisao: Optional[float] = None
    comissao: Optional[float] = None

    avista_prazo: Optional[str] = None
    vencimento: Optional[datetime] = None
    cod_contas: Optional[int] = None
    cod_carteira: Optional[int] = None
    cod_tabela_preco: Optional[int] = None
    cod_tipo_venda: Optional[int] = None
    lote: Optional[str] = None

    tipo_pedido: Optional[str] = None
    tipo: Optional[str] = None
    tipo_pre_pedido: Optional[str] = None
    cod_tipo_ocorrencia: Optional[int] = None
    status_genus: Optional[str] = None
    excluido: Optional[str] = None
    telemarketing: Optional[str] = None
    contato: Optional[str] = None

    liberado: Optional[str] = None
    cod_liberacao: Optional[int] = None
    dt_liberacao: Optional[datetime] = None
    cod_aprovacao: Optional[int] = None
    dt_aprovacao: Optional[datetime] = None
    motivo_bloqueio: Optional[str] = None
    antes_bloqueado: Optional[str] = None
    orcamento_negado: Optional[str] = None
    motivo_orcamento_negado: Optional[str] = None
    cod_func_orcamento_negado: Optional[int] = None

    liberado_para_producao: Optional[str] = None
    producao_etapas: Optional[str] = None
    cod_movto_grade: Optional[int] = None
    cod_agregado: Optional[int] = None
    cod_empresa_saida_prod: Optional[int] = None
    codigo_saida_prod: Optional[int] = None
    doc_saida_prod: Optional[str] = None

    faturado: Optional[str] = None
    obs_interna: Optional[str] = None
    pedido_representante: Optional[str] = None

    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None


class PedidoVendaCreate(_PedidoVendaGenusMixin):
    orcamento_id: Optional[int] = None
    cliente_id: Optional[int] = None
    nome_cliente: Optional[str] = None
    data_entrega_prevista: Optional[datetime] = None
    forma_pagamento_id: Optional[int] = None
    representante_id: Optional[int] = None
    transportadora_id: Optional[int] = None
    desconto_percentual: Optional[float] = 0.0
    observacao: Optional[str] = None
    itens: List[ItemPedidoVendaCreate] = []


class PedidoVendaUpdate(_PedidoVendaGenusMixin):
    cliente_id: Optional[int] = None
    nome_cliente: Optional[str] = None
    data_entrega_prevista: Optional[datetime] = None
    status: Optional[str] = None
    forma_pagamento_id: Optional[int] = None
    representante_id: Optional[int] = None
    transportadora_id: Optional[int] = None
    desconto_percentual: Optional[float] = None
    observacao: Optional[str] = None
    itens: Optional[List[ItemPedidoVendaCreate]] = None


class PedidoVendaOut(_PedidoVendaGenusMixin):
    id: int
    numero: str
    orcamento_id: Optional[int]
    cliente_id: Optional[int]
    nome_cliente: Optional[str]
    data_emissao: datetime
    data_entrega_prevista: Optional[datetime]
    data_faturamento: Optional[datetime]
    status: str
    forma_pagamento_id: Optional[int]
    representante_id: Optional[int]
    transportadora_id: Optional[int]
    desconto_percentual: float
    total: float
    observacao: Optional[str]
    itens: List[ItemPedidoVendaOut] = []

    class Config:
        from_attributes = True

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


# ── Grupo de Produto ──────────────────────────────────────────────────────────

class GrupoProdutoCreate(BaseModel):
    nome: str
    tipo: Optional[str] = "grupo"


class GrupoProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    tipo: Optional[str] = None


class GrupoProdutoOut(BaseModel):
    id: int
    nome: str
    tipo: str

    class Config:
        from_attributes = True


# ── Forma de Pagamento ────────────────────────────────────────────────────────

class FormaPagamentoCreate(BaseModel):
    nome: str
    parcelas: Optional[int] = 1
    dias_primeiro_vencimento: Optional[int] = 0
    intervalo_dias: Optional[int] = 30
    acrescimo_percentual: Optional[float] = 0.0


class FormaPagamentoUpdate(BaseModel):
    nome: Optional[str] = None
    parcelas: Optional[int] = None
    dias_primeiro_vencimento: Optional[int] = None
    intervalo_dias: Optional[int] = None
    acrescimo_percentual: Optional[float] = None


class FormaPagamentoOut(BaseModel):
    id: int
    nome: str
    parcelas: int
    dias_primeiro_vencimento: int
    intervalo_dias: int
    acrescimo_percentual: float

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


class CentroCustoUpdate(BaseModel):
    codigo: Optional[str] = None
    nome: Optional[str] = None
    ativo: Optional[bool] = None


class CentroCustoOut(BaseModel):
    id: int
    codigo: str
    nome: str
    ativo: bool

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

    class Config:
        from_attributes = True


# ── Transportadora ────────────────────────────────────────────────────────────

class TransportadoraCreate(BaseModel):
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


class TransportadoraUpdate(BaseModel):
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


class TransportadoraOut(BaseModel):
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

class RepresentanteCreate(BaseModel):
    nome: str
    cpf_cnpj: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    celular: Optional[str] = None
    comissao_percentual: Optional[float] = 0.0
    meta_mensal: Optional[float] = 0.0
    ativo: Optional[bool] = True


class RepresentanteUpdate(BaseModel):
    nome: Optional[str] = None
    cpf_cnpj: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    celular: Optional[str] = None
    comissao_percentual: Optional[float] = None
    meta_mensal: Optional[float] = None
    ativo: Optional[bool] = None


class RepresentanteOut(BaseModel):
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

class FuncionarioCreate(BaseModel):
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


class FuncionarioUpdate(BaseModel):
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


class FuncionarioOut(BaseModel):
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

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CadastroPessoaCreate(BaseModel):
    # Identificação
    codigo: Optional[int] = None
    cpf_cnpj: Optional[str] = None
    data_cadastro: Optional[datetime] = None
    nome: str = Field(..., min_length=1, max_length=45)
    fantasia: Optional[str] = None
    pessoa: Optional[str] = None
    situacao: Optional[str] = "A"

    # Endereço
    endereco: Optional[str] = None
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
    cod_cidade: Optional[int] = None
    cep: Optional[str] = None

    # Contato
    site: Optional[str] = None
    email: Optional[str] = None
    email_financeiro: Optional[str] = None
    fone: Optional[str] = None
    fone2: Optional[str] = None
    celular: Optional[str] = None
    mobile: Optional[str] = None
    referencia_comercial: Optional[str] = None
    observacao: Optional[str] = None

    # Dados pessoais (pessoa física)
    data_nascimento: Optional[datetime] = None
    local_nascimento: Optional[str] = None
    pais_nacionalidade: Optional[int] = None
    nome_pai: Optional[str] = None
    nome_mae: Optional[str] = None
    rg_insc: Optional[str] = None
    orgao_uf_rg: Optional[str] = None
    data_emissao_rg: Optional[datetime] = None
    passaporte: Optional[str] = None
    escolaridade: Optional[str] = None
    cor: Optional[str] = None
    deficiencia: Optional[str] = None
    estado_civil: Optional[str] = None
    sexo: Optional[str] = None
    reter_ir: Optional[str] = None

    # Fiscal
    insc_suframa: Optional[str] = None
    zona_franca: Optional[str] = None
    apuracao: Optional[str] = None

    # Transferência entre empresas / código antigo
    cod_empresa_transferencia: Optional[int] = None
    cod_empresa_transf1: Optional[int] = None
    cod_empresa_transf2: Optional[int] = None
    cod_antigo_transfere: Optional[int] = None
    cod_antigo_transfere1: Optional[int] = None
    cod_antigo_transfere2: Optional[int] = None

    # Auditoria de origem (GENUS)
    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None


class CadastroPessoaUpdate(BaseModel):
    codigo: Optional[int] = None
    cpf_cnpj: Optional[str] = None
    data_cadastro: Optional[datetime] = None
    nome: Optional[str] = None
    fantasia: Optional[str] = None
    pessoa: Optional[str] = None
    situacao: Optional[str] = None

    endereco: Optional[str] = None
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
    cod_cidade: Optional[int] = None
    cep: Optional[str] = None

    site: Optional[str] = None
    email: Optional[str] = None
    email_financeiro: Optional[str] = None
    fone: Optional[str] = None
    fone2: Optional[str] = None
    celular: Optional[str] = None
    mobile: Optional[str] = None
    referencia_comercial: Optional[str] = None
    observacao: Optional[str] = None

    data_nascimento: Optional[datetime] = None
    local_nascimento: Optional[str] = None
    pais_nacionalidade: Optional[int] = None
    nome_pai: Optional[str] = None
    nome_mae: Optional[str] = None
    rg_insc: Optional[str] = None
    orgao_uf_rg: Optional[str] = None
    data_emissao_rg: Optional[datetime] = None
    passaporte: Optional[str] = None
    escolaridade: Optional[str] = None
    cor: Optional[str] = None
    deficiencia: Optional[str] = None
    estado_civil: Optional[str] = None
    sexo: Optional[str] = None
    reter_ir: Optional[str] = None

    insc_suframa: Optional[str] = None
    zona_franca: Optional[str] = None
    apuracao: Optional[str] = None

    cod_empresa_transferencia: Optional[int] = None
    cod_empresa_transf1: Optional[int] = None
    cod_empresa_transf2: Optional[int] = None
    cod_antigo_transfere: Optional[int] = None
    cod_antigo_transfere1: Optional[int] = None
    cod_antigo_transfere2: Optional[int] = None

    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None


class CadastroPessoaOut(CadastroPessoaCreate):
    id: int

    class Config:
        from_attributes = True

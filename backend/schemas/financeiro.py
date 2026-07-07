from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ── Empresa ────────────────────────────────────────────────────────────────
# Campos migrados de GENUS.EMPRESA comuns a Create/Update/Out (ver docstring
# do model Empresa em backend/models/tabelas.py — diferente das demais
# entidades GENUS já migradas nesta sessão, EMPRESA não tem CODCADASTRO,
# então não exige JOIN com CADASTRO).
class _GenusEmpresaMixin(BaseModel):
    codigo: Optional[int] = None
    razao: Optional[str] = None
    fantasia: Optional[str] = None
    cod_cidade: Optional[int] = None
    endereco: Optional[str] = None
    numero: Optional[str] = None
    bairro: Optional[str] = None
    cep: Optional[str] = None
    cnpj: Optional[str] = None
    insc: Optional[str] = None
    fone: Optional[str] = None
    fax: Optional[str] = None
    email: Optional[str] = None
    www: Optional[str] = None
    simples: Optional[str] = None
    serie: Optional[str] = None
    credito_icms: Optional[float] = None
    tipo_comercio: Optional[str] = None
    cnae: Optional[str] = None
    insc_municipal: Optional[str] = None
    arq_banco: Optional[str] = None

    pis: Optional[float] = None
    cofins: Optional[float] = None
    ir: Optional[float] = None
    contrib_social: Optional[float] = None
    propaganda: Optional[float] = None
    comissao: Optional[float] = None
    fretes: Optional[float] = None
    outros: Optional[float] = None
    simples_percento: Optional[float] = None
    iss: Optional[float] = None
    embalagens: Optional[float] = None
    juros: Optional[float] = None

    smtp_porta: Optional[int] = None
    smtp_host: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_username: Optional[str] = None
    from_address: Optional[str] = None
    from_name: Optional[str] = None
    autenticar_email_ssl: Optional[str] = None

    cnpj_cont: Optional[str] = None
    nome_cont: Optional[str] = None
    cpf_cnpj_cont: Optional[str] = None
    crc_cont: Optional[str] = None
    cep_cont: Optional[str] = None
    endereco_cont: Optional[str] = None
    num_cont: Optional[str] = None
    bairro_cont: Optional[str] = None
    fone_cont: Optional[str] = None
    fax_cont: Optional[str] = None
    email_cont: Optional[str] = None
    cod_cidade_cont: Optional[int] = None

    regime_apuracao: Optional[str] = None
    regime_tributacao: Optional[str] = None
    atividade_municipal: Optional[str] = None
    atividade_federal: Optional[str] = None
    aliq_municipal: Optional[float] = None
    classif_comercial: Optional[str] = None
    cod_gare_icms: Optional[str] = None
    icms_pis_cofins_entrada: Optional[str] = None
    icms_pis_cofins_saida: Optional[str] = None
    calcular_icms_dentro_estado: Optional[str] = None
    reforma_tributaria: Optional[str] = None

    dias_vencimento: Optional[int] = None
    mora: Optional[float] = None
    multa: Optional[float] = None
    inss: Optional[float] = None
    fundo_garantia: Optional[float] = None

    num_certificado: Optional[str] = None
    caminho_logo: Optional[str] = None
    caminho_xml: Optional[str] = None
    salvar_xml: Optional[str] = None
    senha_padrao: Optional[str] = None
    rntrc: Optional[str] = None
    foto_logo: Optional[str] = None
    situacao: Optional[str] = None

    ult_nsu: Optional[str] = None
    max_nsu: Optional[str] = None
    data_ultima_consulta_nsu: Optional[datetime] = None
    hora_ultima_consulta_nsu: Optional[str] = None

    ult_nsu_cte: Optional[str] = None
    max_nsu_cte: Optional[str] = None
    data_ultima_consulta_nsu_cte: Optional[datetime] = None
    hora_ultima_consulta_nsu_cte: Optional[str] = None

    client_id_gmail: Optional[str] = None
    client_secret_gmail: Optional[str] = None
    token_gmail: Optional[str] = None
    refresh_token_gmail: Optional[str] = None
    codigo_gmail: Optional[str] = None


class EmpresaCreate(_GenusEmpresaMixin):
    nome: str


class EmpresaUpdate(_GenusEmpresaMixin):
    nome: Optional[str] = None


class EmpresaOut(_GenusEmpresaMixin):
    id: int
    nome: str

    class Config:
        from_attributes = True


class ContaBancariaOut(BaseModel):
    id: int
    empresa_id: int
    banco: str
    numero_conta: Optional[str]

    class Config:
        from_attributes = True


class ContaBancariaCreate(BaseModel):
    empresa_id: int
    banco: str
    numero_conta: Optional[str] = None


class ContaPagarCreate(BaseModel):
    empresa_id: int
    conta_bancaria_id: Optional[int] = None
    descricao: str
    valor: float
    data_vencimento: datetime
    observacao: Optional[str] = None

    # ── Campos migrados de GENUS.PAGAR (todos opcionais) ──────────────────
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_fornecedor: Optional[int] = None
    emissao: Optional[datetime] = None
    parcela: Optional[str] = None
    valor_pago: Optional[float] = None
    cod_conta: Optional[int] = None
    cod_historico: Optional[str] = None
    cod_empresa_pag: Optional[int] = None
    duplicata: Optional[str] = None

    linha_digitavel: Optional[str] = None
    previsao: Optional[str] = None
    cod_controle: Optional[int] = None
    cod_controle_empresa: Optional[int] = None
    cod_controle_tipo: Optional[str] = None
    num_doc: Optional[str] = None
    valor_documento: Optional[float] = None
    conta_cheque: Optional[int] = None
    doc_cheque: Optional[int] = None
    cod_frete: Optional[int] = None
    parc_real: Optional[str] = None
    cod_empresa_entrada: Optional[int] = None
    doc_parcela: Optional[str] = None
    cod_carteira: Optional[int] = None
    cod_fixo: Optional[int] = None
    valor_credito_fornecedor: Optional[float] = None
    cod_fatura_pagar: Optional[int] = None

    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None


class ContaPagarUpdate(BaseModel):
    conta_bancaria_id: Optional[int] = None
    descricao: Optional[str] = None
    valor: Optional[float] = None
    data_vencimento: Optional[datetime] = None
    observacao: Optional[str] = None

    # ── Campos migrados de GENUS.PAGAR (todos opcionais) ──────────────────
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_fornecedor: Optional[int] = None
    emissao: Optional[datetime] = None
    parcela: Optional[str] = None
    valor_pago: Optional[float] = None
    cod_conta: Optional[int] = None
    cod_historico: Optional[str] = None
    cod_empresa_pag: Optional[int] = None
    duplicata: Optional[str] = None

    linha_digitavel: Optional[str] = None
    previsao: Optional[str] = None
    cod_controle: Optional[int] = None
    cod_controle_empresa: Optional[int] = None
    cod_controle_tipo: Optional[str] = None
    num_doc: Optional[str] = None
    valor_documento: Optional[float] = None
    conta_cheque: Optional[int] = None
    doc_cheque: Optional[int] = None
    cod_frete: Optional[int] = None
    parc_real: Optional[str] = None
    cod_empresa_entrada: Optional[int] = None
    doc_parcela: Optional[str] = None
    cod_carteira: Optional[int] = None
    cod_fixo: Optional[int] = None
    valor_credito_fornecedor: Optional[float] = None
    cod_fatura_pagar: Optional[int] = None

    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None


class ContaPagarOut(BaseModel):
    id: int
    empresa_id: int
    conta_bancaria_id: Optional[int]
    descricao: str
    valor: float
    data_vencimento: datetime
    data_pagamento: Optional[datetime]
    status: str
    observacao: Optional[str]
    postergado: bool = False
    criado_em: Optional[datetime] = None
    importado_excel: bool = False

    # ── Campos migrados de GENUS.PAGAR (todos opcionais) ──────────────────
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    serie: Optional[str] = None
    cod_fornecedor: Optional[int] = None
    emissao: Optional[datetime] = None
    parcela: Optional[str] = None
    valor_pago: Optional[float] = None
    cod_conta: Optional[int] = None
    cod_historico: Optional[str] = None
    cod_empresa_pag: Optional[int] = None
    duplicata: Optional[str] = None

    linha_digitavel: Optional[str] = None
    previsao: Optional[str] = None
    cod_controle: Optional[int] = None
    cod_controle_empresa: Optional[int] = None
    cod_controle_tipo: Optional[str] = None
    num_doc: Optional[str] = None
    valor_documento: Optional[float] = None
    conta_cheque: Optional[int] = None
    doc_cheque: Optional[int] = None
    cod_frete: Optional[int] = None
    parc_real: Optional[str] = None
    cod_empresa_entrada: Optional[int] = None
    doc_parcela: Optional[str] = None
    cod_carteira: Optional[int] = None
    cod_fixo: Optional[int] = None
    valor_credito_fornecedor: Optional[float] = None
    cod_fatura_pagar: Optional[int] = None

    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None

    class Config:
        from_attributes = True


class ContaReceberCreate(BaseModel):
    empresa_id: int
    conta_bancaria_id: Optional[int] = None
    descricao: str
    valor: float
    data_vencimento: datetime
    observacao: Optional[str] = None

    # ── Campos migrados de GENUS.RECEBER (todos opcionais) ────────────────
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    cod_saida: Optional[int] = None
    parcela: Optional[str] = None
    cod_cliente: Optional[int] = None
    emissao: Optional[datetime] = None
    valor_pago: Optional[float] = None
    cod_historico: Optional[str] = None
    cod_contas: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    cod_empresa_rec: Optional[int] = None
    imp_boleto: Optional[str] = None
    cod_movto: Optional[int] = None

    nosso_numero: Optional[str] = None
    cod_carteira: Optional[int] = None
    cod_fatura: Optional[int] = None
    comissao: Optional[float] = None
    processamento: Optional[datetime] = None
    remessa: Optional[int] = None
    lote: Optional[int] = None
    cod_retorno: Optional[int] = None
    banco_remessa: Optional[str] = None
    num_transacao: Optional[str] = None
    valor_financeiro: Optional[float] = None
    obs_boleto: Optional[str] = None
    valor_deposito: Optional[float] = None

    scpc_enviado: Optional[datetime] = None
    scpc_retirado: Optional[datetime] = None
    carta_cobranca: Optional[datetime] = None
    carta_scpc: Optional[datetime] = None
    data_protesto: Optional[datetime] = None
    protocolo_protesto: Optional[str] = None
    obs_protesto: Optional[str] = None
    obs_retira_protesto: Optional[str] = None
    valor_cartorio: Optional[float] = None

    data_multa: Optional[datetime] = None
    multa: Optional[float] = None
    mora: Optional[float] = None
    desconto: Optional[float] = None
    data_desconto: Optional[datetime] = None
    valor_multa: Optional[float] = None
    valor_mora: Optional[float] = None
    valor_desconto: Optional[float] = None

    pis_cofins: Optional[float] = None
    iss: Optional[float] = None

    ocorrencia: Optional[str] = None
    funcionario_baixa: Optional[int] = None
    cod_frete: Optional[int] = None
    cod_representante: Optional[int] = None
    cod_locacao: Optional[int] = None
    cod_empresa_saida: Optional[int] = None
    cod_fixo: Optional[int] = None

    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None
    valor_credito: Optional[float] = None
    cod_antigo_receber: Optional[int] = None


class ContaReceberUpdate(BaseModel):
    conta_bancaria_id: Optional[int] = None
    descricao: Optional[str] = None
    valor: Optional[float] = None
    data_vencimento: Optional[datetime] = None
    observacao: Optional[str] = None

    # ── Campos migrados de GENUS.RECEBER (todos opcionais) ────────────────
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    cod_saida: Optional[int] = None
    parcela: Optional[str] = None
    cod_cliente: Optional[int] = None
    emissao: Optional[datetime] = None
    valor_pago: Optional[float] = None
    cod_historico: Optional[str] = None
    cod_contas: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    cod_empresa_rec: Optional[int] = None
    imp_boleto: Optional[str] = None
    cod_movto: Optional[int] = None

    nosso_numero: Optional[str] = None
    cod_carteira: Optional[int] = None
    cod_fatura: Optional[int] = None
    comissao: Optional[float] = None
    processamento: Optional[datetime] = None
    remessa: Optional[int] = None
    lote: Optional[int] = None
    cod_retorno: Optional[int] = None
    banco_remessa: Optional[str] = None
    num_transacao: Optional[str] = None
    valor_financeiro: Optional[float] = None
    obs_boleto: Optional[str] = None
    valor_deposito: Optional[float] = None

    scpc_enviado: Optional[datetime] = None
    scpc_retirado: Optional[datetime] = None
    carta_cobranca: Optional[datetime] = None
    carta_scpc: Optional[datetime] = None
    data_protesto: Optional[datetime] = None
    protocolo_protesto: Optional[str] = None
    obs_protesto: Optional[str] = None
    obs_retira_protesto: Optional[str] = None
    valor_cartorio: Optional[float] = None

    data_multa: Optional[datetime] = None
    multa: Optional[float] = None
    mora: Optional[float] = None
    desconto: Optional[float] = None
    data_desconto: Optional[datetime] = None
    valor_multa: Optional[float] = None
    valor_mora: Optional[float] = None
    valor_desconto: Optional[float] = None

    pis_cofins: Optional[float] = None
    iss: Optional[float] = None

    ocorrencia: Optional[str] = None
    funcionario_baixa: Optional[int] = None
    cod_frete: Optional[int] = None
    cod_representante: Optional[int] = None
    cod_locacao: Optional[int] = None
    cod_empresa_saida: Optional[int] = None
    cod_fixo: Optional[int] = None

    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None
    valor_credito: Optional[float] = None
    cod_antigo_receber: Optional[int] = None


class ContaReceberOut(BaseModel):
    id: int
    empresa_id: int
    conta_bancaria_id: Optional[int]
    descricao: str
    valor: float
    data_vencimento: datetime
    data_recebimento: Optional[datetime]
    status: str
    observacao: Optional[str]
    postergado: bool = False
    criado_em: Optional[datetime] = None
    importado_excel: bool = False

    # ── Campos migrados de GENUS.RECEBER (todos opcionais) ────────────────
    cod_empresa: Optional[int] = None
    codigo: Optional[int] = None
    cod_saida: Optional[int] = None
    parcela: Optional[str] = None
    cod_cliente: Optional[int] = None
    emissao: Optional[datetime] = None
    valor_pago: Optional[float] = None
    cod_historico: Optional[str] = None
    cod_contas: Optional[int] = None
    tipo_doc: Optional[str] = None
    doc: Optional[int] = None
    cod_empresa_rec: Optional[int] = None
    imp_boleto: Optional[str] = None
    cod_movto: Optional[int] = None

    nosso_numero: Optional[str] = None
    cod_carteira: Optional[int] = None
    cod_fatura: Optional[int] = None
    comissao: Optional[float] = None
    processamento: Optional[datetime] = None
    remessa: Optional[int] = None
    lote: Optional[int] = None
    cod_retorno: Optional[int] = None
    banco_remessa: Optional[str] = None
    num_transacao: Optional[str] = None
    valor_financeiro: Optional[float] = None
    obs_boleto: Optional[str] = None
    valor_deposito: Optional[float] = None

    scpc_enviado: Optional[datetime] = None
    scpc_retirado: Optional[datetime] = None
    carta_cobranca: Optional[datetime] = None
    carta_scpc: Optional[datetime] = None
    data_protesto: Optional[datetime] = None
    protocolo_protesto: Optional[str] = None
    obs_protesto: Optional[str] = None
    obs_retira_protesto: Optional[str] = None
    valor_cartorio: Optional[float] = None

    data_multa: Optional[datetime] = None
    multa: Optional[float] = None
    mora: Optional[float] = None
    desconto: Optional[float] = None
    data_desconto: Optional[datetime] = None
    valor_multa: Optional[float] = None
    valor_mora: Optional[float] = None
    valor_desconto: Optional[float] = None

    pis_cofins: Optional[float] = None
    iss: Optional[float] = None

    ocorrencia: Optional[str] = None
    funcionario_baixa: Optional[int] = None
    cod_frete: Optional[int] = None
    cod_representante: Optional[int] = None
    cod_locacao: Optional[int] = None
    cod_empresa_saida: Optional[int] = None
    cod_fixo: Optional[int] = None

    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime] = None
    valor_credito: Optional[float] = None
    cod_antigo_receber: Optional[int] = None

    class Config:
        from_attributes = True


class SaldoDiarioOut(BaseModel):
    id: int
    conta_bancaria_id: int
    data: datetime
    saldo: float
    coluna_excel: Optional[str] = None

    class Config:
        from_attributes = True

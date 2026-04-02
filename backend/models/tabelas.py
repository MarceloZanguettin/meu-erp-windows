from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Boolean
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    documento = Column(String(20), unique=True) # CPF/CNPJ

class Produto(Base):
    __tablename__ = "produtos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    preco = Column(Float, nullable=False)
    estoque = Column(Integer, default=0)
    # Aqui guardamos cor, tamanho, etc, como um JSON (flexibilidade)
    caracteristicas = Column(JSON)

class Pedido(Base):
    __tablename__ = "pedidos"
    id = Column(Integer, primary_key=True, index=True)
    data = Column(DateTime, default=datetime.datetime.utcnow)
    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    total = Column(Float)

    # Relacionamentos (Estilo OneToMany do Java)
    cliente = relationship("Cliente")
    itens = relationship("ItemPedido", back_populates="pedido")

class ItemPedido(Base):
    __tablename__ = "itens_pedido"
    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"))
    produto_id = Column(Integer, ForeignKey("produtos.id"))
    quantidade = Column(Integer)
    preco_unitario = Column(Float)

    pedido = relationship("Pedido", back_populates="itens")
class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(100), nullable=False) # Em produção, o ideal é usar hash
    permissao = Column(String(50), default="user") # Ex: admin, user, gerente

class Empresa(Base):
    __tablename__ = "empresas"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)

    contas_bancarias = relationship("ContaBancaria", back_populates="empresa")
    contas_pagar = relationship("ContaPagar", back_populates="empresa")
    contas_receber = relationship("ContaReceber", back_populates="empresa")

class ContaBancaria(Base):
    __tablename__ = "contas_bancarias"
    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    banco = Column(String(100), nullable=False)
    numero_conta = Column(String(50), nullable=True)

    empresa = relationship("Empresa", back_populates="contas_bancarias")
    contas_pagar = relationship("ContaPagar", back_populates="conta_bancaria")
    contas_receber = relationship("ContaReceber", back_populates="conta_bancaria")

class ContaPagar(Base):
    __tablename__ = "contas_pagar"
    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    conta_bancaria_id = Column(Integer, ForeignKey("contas_bancarias.id"), nullable=True)
    descricao = Column(String(200), nullable=False)
    valor = Column(Float, nullable=False)
    data_vencimento = Column(DateTime, nullable=False)
    data_pagamento = Column(DateTime, nullable=True)
    status = Column(String(20), default="pendente")  # pendente / pago
    observacao = Column(String(500), nullable=True)

    empresa = relationship("Empresa", back_populates="contas_pagar")
    conta_bancaria = relationship("ContaBancaria", back_populates="contas_pagar")

class ContaReceber(Base):
    __tablename__ = "contas_receber"
    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    conta_bancaria_id = Column(Integer, ForeignKey("contas_bancarias.id"), nullable=True)
    descricao = Column(String(200), nullable=False)
    valor = Column(Float, nullable=False)
    data_vencimento = Column(DateTime, nullable=False)
    data_recebimento = Column(DateTime, nullable=True)
    status = Column(String(20), default="pendente")  # pendente / recebido
    observacao = Column(String(500), nullable=True)

    empresa = relationship("Empresa", back_populates="contas_receber")
    conta_bancaria = relationship("ContaBancaria", back_populates="contas_receber")


# ── Novos modelos — Fase 1 e Fase 2 ──────────────────────────────────────────

class UnidadeMedida(Base):
    __tablename__ = "unidades_medida"
    id = Column(Integer, primary_key=True, index=True)
    sigla = Column(String(10), nullable=False, unique=True)   # UN, KG, CX, L, M2
    descricao = Column(String(100), nullable=False)


class GrupoProduto(Base):
    __tablename__ = "grupos_produto"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    tipo = Column(String(20), default="grupo")   # grupo | subgrupo | categoria


class FormaPagamento(Base):
    __tablename__ = "formas_pagamento"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)       # À vista, 30/60/90, Boleto...
    parcelas = Column(Integer, default=1)
    dias_primeiro_vencimento = Column(Integer, default=0)
    intervalo_dias = Column(Integer, default=30)
    acrescimo_percentual = Column(Float, default=0.0)


class PlanoConta(Base):
    __tablename__ = "plano_contas"
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(20), nullable=False, unique=True)   # Ex: 1.1.1
    descricao = Column(String(200), nullable=False)
    tipo = Column(String(20), nullable=False)    # receita | despesa | ativo | passivo
    pai_id = Column(Integer, ForeignKey("plano_contas.id"), nullable=True)


class CentroCusto(Base):
    __tablename__ = "centros_custo"
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(20), nullable=False, unique=True)
    nome = Column(String(100), nullable=False)
    ativo = Column(Boolean, default=True)


class Deposito(Base):
    __tablename__ = "depositos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    descricao = Column(String(200), nullable=True)
    ativo = Column(Boolean, default=True)


class Transportadora(Base):
    __tablename__ = "transportadoras"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    cnpj = Column(String(20), unique=True, nullable=True)
    email = Column(String(150), nullable=True)
    telefone = Column(String(20), nullable=True)
    cep = Column(String(10), nullable=True)
    logradouro = Column(String(200), nullable=True)
    numero = Column(String(20), nullable=True)
    bairro = Column(String(100), nullable=True)
    cidade = Column(String(100), nullable=True)
    uf = Column(String(2), nullable=True)
    observacao = Column(String(500), nullable=True)
    ativo = Column(Boolean, default=True)


class Representante(Base):
    __tablename__ = "representantes"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    cpf_cnpj = Column(String(20), unique=True, nullable=True)
    email = Column(String(150), nullable=True)
    telefone = Column(String(20), nullable=True)
    celular = Column(String(20), nullable=True)
    comissao_percentual = Column(Float, default=0.0)
    meta_mensal = Column(Float, default=0.0)
    ativo = Column(Boolean, default=True)


class ClienteCompleto(Base):
    """Cliente completo — substitui gradualmente a tabela clientes simples"""
    __tablename__ = "clientes_completo"
    id = Column(Integer, primary_key=True, index=True)
    # Identificação
    tipo_pessoa = Column(String(2), default="PJ")   # PF | PJ
    nome = Column(String(150), nullable=False)
    nome_fantasia = Column(String(150), nullable=True)
    documento = Column(String(20), unique=True, nullable=True)   # CPF ou CNPJ
    rg_ie = Column(String(30), nullable=True)                    # RG ou IE
    data_nascimento = Column(DateTime, nullable=True)
    # Contato
    email = Column(String(150), nullable=True)
    telefone = Column(String(20), nullable=True)
    celular = Column(String(20), nullable=True)
    # Endereço
    cep = Column(String(10), nullable=True)
    logradouro = Column(String(200), nullable=True)
    numero = Column(String(20), nullable=True)
    complemento = Column(String(100), nullable=True)
    bairro = Column(String(100), nullable=True)
    cidade = Column(String(100), nullable=True)
    uf = Column(String(2), nullable=True)
    # Comercial
    limite_credito = Column(Float, default=0.0)
    forma_pagamento_id = Column(Integer, ForeignKey("formas_pagamento.id"), nullable=True)
    representante_id = Column(Integer, ForeignKey("representantes.id"), nullable=True)
    transportadora_id = Column(Integer, ForeignKey("transportadoras.id"), nullable=True)
    observacao = Column(String(500), nullable=True)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, default=datetime.datetime.utcnow)


class Fornecedor(Base):
    __tablename__ = "fornecedores"
    id = Column(Integer, primary_key=True, index=True)
    tipo_pessoa = Column(String(2), default="PJ")
    nome = Column(String(150), nullable=False)
    nome_fantasia = Column(String(150), nullable=True)
    cnpj = Column(String(20), unique=True, nullable=True)
    ie = Column(String(30), nullable=True)
    email = Column(String(150), nullable=True)
    telefone = Column(String(20), nullable=True)
    celular = Column(String(20), nullable=True)
    website = Column(String(200), nullable=True)
    cep = Column(String(10), nullable=True)
    logradouro = Column(String(200), nullable=True)
    numero = Column(String(20), nullable=True)
    complemento = Column(String(100), nullable=True)
    bairro = Column(String(100), nullable=True)
    cidade = Column(String(100), nullable=True)
    uf = Column(String(2), nullable=True)
    prazo_entrega_dias = Column(Integer, default=0)
    forma_pagamento_id = Column(Integer, ForeignKey("formas_pagamento.id"), nullable=True)
    observacao = Column(String(500), nullable=True)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, default=datetime.datetime.utcnow)


class Funcionario(Base):
    __tablename__ = "funcionarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    cpf = Column(String(14), unique=True, nullable=True)
    rg = Column(String(20), nullable=True)
    data_nascimento = Column(DateTime, nullable=True)
    data_admissao = Column(DateTime, nullable=True)
    cargo = Column(String(100), nullable=True)
    departamento = Column(String(100), nullable=True)
    salario = Column(Float, default=0.0)
    email = Column(String(150), nullable=True)
    telefone = Column(String(20), nullable=True)
    cep = Column(String(10), nullable=True)
    logradouro = Column(String(200), nullable=True)
    numero = Column(String(20), nullable=True)
    bairro = Column(String(100), nullable=True)
    cidade = Column(String(100), nullable=True)
    uf = Column(String(2), nullable=True)
    ativo = Column(Boolean, default=True)


class PerfilAcesso(Base):
    __tablename__ = "perfis_acesso"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False, unique=True)   # admin, gerente, operador, vendedor
    descricao = Column(String(300), nullable=True)
    permissoes = Column(JSON, default=dict)   # {"cadastros": "rw", "financeiro": "r", ...}


class MovimentoEstoque(Base):
    __tablename__ = "movimentos_estoque"
    id = Column(Integer, primary_key=True, index=True)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=False)
    deposito_id = Column(Integer, ForeignKey("depositos.id"), nullable=True)
    tipo = Column(String(20), nullable=False)      # entrada | saida | ajuste | transferencia
    quantidade = Column(Float, nullable=False)
    custo_unitario = Column(Float, nullable=True)
    documento_ref = Column(String(100), nullable=True)   # NF, PedidoCompra, PedidoVenda
    observacao = Column(String(300), nullable=True)
    data = Column(DateTime, default=datetime.datetime.utcnow)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)


class SolicitacaoCompra(Base):
    __tablename__ = "solicitacoes_compra"
    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String(20), nullable=False, unique=True)
    data = Column(DateTime, default=datetime.datetime.utcnow)
    solicitante = Column(String(150), nullable=True)
    centro_custo_id = Column(Integer, ForeignKey("centros_custo.id"), nullable=True)
    status = Column(String(20), default="pendente")   # pendente | aprovada | cancelada
    observacao = Column(String(500), nullable=True)
    itens = relationship("ItemSolicitacao", back_populates="solicitacao", cascade="all, delete-orphan")


class ItemSolicitacao(Base):
    __tablename__ = "itens_solicitacao"
    id = Column(Integer, primary_key=True, index=True)
    solicitacao_id = Column(Integer, ForeignKey("solicitacoes_compra.id"), nullable=False)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True)
    descricao = Column(String(200), nullable=False)
    quantidade = Column(Float, nullable=False)
    unidade = Column(String(10), nullable=True)
    solicitacao = relationship("SolicitacaoCompra", back_populates="itens")


class PedidoCompra(Base):
    __tablename__ = "pedidos_compra"
    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String(20), nullable=False, unique=True)
    fornecedor_id = Column(Integer, ForeignKey("fornecedores.id"), nullable=False)
    data_emissao = Column(DateTime, default=datetime.datetime.utcnow)
    data_entrega_prevista = Column(DateTime, nullable=True)
    data_recebimento = Column(DateTime, nullable=True)
    status = Column(String(20), default="aberto")   # aberto | recebido_parcial | recebido | cancelado
    forma_pagamento_id = Column(Integer, ForeignKey("formas_pagamento.id"), nullable=True)
    total = Column(Float, default=0.0)
    observacao = Column(String(500), nullable=True)
    itens = relationship("ItemPedidoCompra", back_populates="pedido", cascade="all, delete-orphan")
    fornecedor = relationship("Fornecedor")


class ItemPedidoCompra(Base):
    __tablename__ = "itens_pedido_compra"
    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos_compra.id"), nullable=False)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True)
    descricao = Column(String(200), nullable=False)
    quantidade = Column(Float, nullable=False)
    quantidade_recebida = Column(Float, default=0.0)
    preco_unitario = Column(Float, nullable=False)
    unidade = Column(String(10), nullable=True)
    pedido = relationship("PedidoCompra", back_populates="itens")


class Orcamento(Base):
    __tablename__ = "orcamentos"
    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String(20), nullable=False, unique=True)
    cliente_id = Column(Integer, ForeignKey("clientes_completo.id"), nullable=True)
    nome_cliente = Column(String(150), nullable=True)   # para orcamento rápido sem cadastro
    data_emissao = Column(DateTime, default=datetime.datetime.utcnow)
    data_validade = Column(DateTime, nullable=True)
    status = Column(String(20), default="aberto")   # aberto | aprovado | recusado | convertido
    forma_pagamento_id = Column(Integer, ForeignKey("formas_pagamento.id"), nullable=True)
    representante_id = Column(Integer, ForeignKey("representantes.id"), nullable=True)
    desconto_percentual = Column(Float, default=0.0)
    total = Column(Float, default=0.0)
    observacao = Column(String(500), nullable=True)
    itens = relationship("ItemOrcamento", back_populates="orcamento", cascade="all, delete-orphan")


class ItemOrcamento(Base):
    __tablename__ = "itens_orcamento"
    id = Column(Integer, primary_key=True, index=True)
    orcamento_id = Column(Integer, ForeignKey("orcamentos.id"), nullable=False)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True)
    descricao = Column(String(200), nullable=False)
    quantidade = Column(Float, nullable=False)
    preco_unitario = Column(Float, nullable=False)
    desconto_percentual = Column(Float, default=0.0)
    unidade = Column(String(10), nullable=True)
    orcamento = relationship("Orcamento", back_populates="itens")


class PedidoVenda(Base):
    __tablename__ = "pedidos_venda"
    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String(20), nullable=False, unique=True)
    orcamento_id = Column(Integer, ForeignKey("orcamentos.id"), nullable=True)
    cliente_id = Column(Integer, ForeignKey("clientes_completo.id"), nullable=True)
    nome_cliente = Column(String(150), nullable=True)
    data_emissao = Column(DateTime, default=datetime.datetime.utcnow)
    data_entrega_prevista = Column(DateTime, nullable=True)
    data_faturamento = Column(DateTime, nullable=True)
    status = Column(String(20), default="aberto")   # aberto | faturado | cancelado | entregue
    forma_pagamento_id = Column(Integer, ForeignKey("formas_pagamento.id"), nullable=True)
    representante_id = Column(Integer, ForeignKey("representantes.id"), nullable=True)
    transportadora_id = Column(Integer, ForeignKey("transportadoras.id"), nullable=True)
    desconto_percentual = Column(Float, default=0.0)
    total = Column(Float, default=0.0)
    observacao = Column(String(500), nullable=True)
    itens = relationship("ItemPedidoVenda", back_populates="pedido", cascade="all, delete-orphan")


class ItemPedidoVenda(Base):
    __tablename__ = "itens_pedido_venda"
    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos_venda.id"), nullable=False)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True)
    descricao = Column(String(200), nullable=False)
    quantidade = Column(Float, nullable=False)
    preco_unitario = Column(Float, nullable=False)
    desconto_percentual = Column(Float, default=0.0)
    unidade = Column(String(10), nullable=True)
    pedido = relationship("PedidoVenda", back_populates="itens")

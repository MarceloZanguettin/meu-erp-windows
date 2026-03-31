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

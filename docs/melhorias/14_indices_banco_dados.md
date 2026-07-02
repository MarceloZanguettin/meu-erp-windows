# Melhoria 14 — Performance: Índices no Banco de Dados

**Categoria**: Performance  
**Prioridade**: 🟢 Baixo  
**Esforço estimado**: 30 minutos  
**Risco se ignorado**: Com crescimento de dados, queries de listagem e filtro ficam exponencialmente mais lentas (full table scan)

---

## Problema

Os modelos ORM em `backend/models/tabelas.py` definem as chaves primárias (autoindexadas) e foreign keys, mas não definem índices nas colunas mais consultadas nos filtros:

```python
# backend/models/tabelas.py (ATUAL — sem índices)
class ContaPagar(Base):
    __tablename__ = "contas_pagar"
    id = Column(Integer, primary_key=True)        # ← Indexado automaticamente
    empresa_id = Column(Integer, ForeignKey(...))  # ← FK, mas sem índice explícito
    data_vencimento = Column(Date)                 # ← Filtro frequente — SEM ÍNDICE
    status = Column(String)                        # ← Filtro frequente — SEM ÍNDICE
    conta_bancaria_id = Column(Integer, ForeignKey(...))  # ← FK — SEM ÍNDICE
```

### Impacto em números

Com 10.000 registros em `contas_pagar`:

| Query | Sem índice | Com índice |
|-------|-----------|-----------|
| `WHERE status = 'pendente'` | ~50ms (full scan) | ~1ms (index scan) |
| `WHERE data_vencimento BETWEEN ...` | ~80ms | ~2ms |
| `WHERE empresa_id = 1 AND status = 'pendente'` | ~100ms | ~1ms |

---

## Solução — Índices via `__table_args__`

### Passo 1 — Atualizar `backend/models/tabelas.py`

#### ContaPagar e ContaReceber (mais críticos)

```python
# backend/models/tabelas.py (PROPOSTO)
from sqlalchemy import Column, Integer, String, Date, Boolean, Numeric, ForeignKey, Index

class ContaPagar(Base):
    __tablename__ = "contas_pagar"
    
    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    conta_bancaria_id = Column(Integer, ForeignKey("contas_bancarias.id"), nullable=True)
    descricao = Column(String(500))
    valor = Column(Numeric(12, 2))
    data_vencimento = Column(Date, nullable=False)
    data_pagamento = Column(Date, nullable=True)
    status = Column(String(20), default="pendente")  # pendente | pago
    postergado = Column(Boolean, default=False)
    criado_em = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    empresa = relationship("Empresa", back_populates="contas_pagar")
    conta_bancaria = relationship("ContaBancaria")
    
    __table_args__ = (
        # Filtro mais comum: listar pendentes de uma empresa
        Index("ix_cp_empresa_status", "empresa_id", "status"),
        
        # Filtro por período de vencimento (relatórios, calendário)
        Index("ix_cp_vencimento", "data_vencimento"),
        
        # Filtro combinado mais frequente (empresa + período + status)
        Index("ix_cp_empresa_vencimento_status", "empresa_id", "data_vencimento", "status"),
        
        # Filtro por conta bancária
        Index("ix_cp_conta_bancaria", "conta_bancaria_id"),
    )


class ContaReceber(Base):
    __tablename__ = "contas_receber"
    
    # ... colunas ...
    
    __table_args__ = (
        Index("ix_cr_empresa_status", "empresa_id", "status"),
        Index("ix_cr_vencimento", "data_vencimento"),
        Index("ix_cr_empresa_vencimento_status", "empresa_id", "data_vencimento", "status"),
        Index("ix_cr_conta_bancaria", "conta_bancaria_id"),
    )
```

#### Movimentos de Estoque

```python
class MovimentoEstoque(Base):
    __tablename__ = "movimentos_estoque"
    
    # ... colunas ...
    
    __table_args__ = (
        # Filtro por produto (saldo atual por produto)
        Index("ix_me_produto", "produto_id"),
        
        # Filtro por depósito e produto (posição de estoque)
        Index("ix_me_produto_deposito", "produto_id", "deposito_id"),
        
        # Filtro por data (relatórios de movimentação)
        Index("ix_me_data", "data"),
        
        # Filtro por tipo de movimento
        Index("ix_me_tipo", "tipo"),
    )
```

#### SolicitacaoCompra e PedidoCompra

```python
class SolicitacaoCompra(Base):
    __tablename__ = "solicitacoes_compra"
    
    __table_args__ = (
        # Número único do documento
        Index("ix_sc_numero", "numero", unique=True),
        
        # Listagem por status
        Index("ix_sc_status", "status"),
        
        # Filtro por data de criação
        Index("ix_sc_data", "data"),
    )


class PedidoCompra(Base):
    __tablename__ = "pedidos_compra"
    
    __table_args__ = (
        Index("ix_pc_numero", "numero", unique=True),
        Index("ix_pc_fornecedor_status", "fornecedor_id", "status"),
        Index("ix_pc_status", "status"),
        Index("ix_pc_data_emissao", "data_emissao"),
    )
```

#### Orçamentos e Pedidos de Venda

```python
class Orcamento(Base):
    __tablename__ = "orcamentos"
    
    __table_args__ = (
        Index("ix_orc_numero", "numero", unique=True),
        Index("ix_orc_cliente_status", "cliente_id", "status"),
        Index("ix_orc_status", "status"),
        Index("ix_orc_data_emissao", "data_emissao"),
    )


class PedidoVenda(Base):
    __tablename__ = "pedidos_venda"
    
    __table_args__ = (
        Index("ix_pv_numero", "numero", unique=True),
        Index("ix_pv_cliente_status", "cliente_id", "status"),
        Index("ix_pv_status", "status"),
        Index("ix_pv_data_emissao", "data_emissao"),
    )
```

#### Usuários

```python
class Usuario(Base):
    __tablename__ = "usuarios"
    
    # Username já deve ser único (para busca no login)
    __table_args__ = (
        Index("ix_usuario_username", "username", unique=True),
    )
```

#### ClienteCompleto e Fornecedor (busca textual)

```python
class ClienteCompleto(Base):
    __tablename__ = "clientes_completo"
    
    __table_args__ = (
        # Busca por documento (CPF/CNPJ)
        Index("ix_cliente_documento", "documento"),
        
        # Busca por nome (ILIKE usa índice parcialmente em Postgres)
        # Para busca full-text eficiente, considerar pg_trgm no futuro
        Index("ix_cliente_nome", "nome"),
    )


class Fornecedor(Base):
    __tablename__ = "fornecedores"
    
    __table_args__ = (
        Index("ix_fornecedor_cnpj", "cnpj"),
        Index("ix_fornecedor_nome", "nome"),
    )
```

---

### Passo 2 — Aplicar via migration Alembic

```bash
# Após atualizar os modelos:
cd backend
alembic revision --autogenerate -m "adicionar indices de performance"
# Revisar o arquivo gerado em alembic/versions/

alembic upgrade head
```

### Passo 3 — Verificar índices criados no PostgreSQL

```sql
-- Ver todos os índices do banco
SELECT
    t.tablename,
    i.indexname,
    ix.indisunique,
    array_agg(a.attname ORDER BY k.n) as colunas
FROM pg_indexes i
JOIN pg_class c ON c.relname = i.indexname
JOIN pg_index ix ON ix.indexrelid = c.oid
JOIN pg_class t2 ON t2.oid = ix.indrelid
JOIN pg_tables t ON t.tablename = t2.relname
JOIN pg_attribute a ON a.attrelid = t2.oid
JOIN generate_subscripts(ix.indkey, 1) AS k(n) ON a.attnum = ix.indkey[k.n]
WHERE t.schemaname = 'public'
  AND t.tablename IN ('contas_pagar', 'contas_receber', 'movimentos_estoque')
GROUP BY t.tablename, i.indexname, ix.indisunique
ORDER BY t.tablename, i.indexname;
```

### Passo 4 — Analisar queries lentas com EXPLAIN

```sql
-- Verificar se o índice está sendo usado
EXPLAIN ANALYZE
SELECT * FROM contas_pagar
WHERE empresa_id = 1
  AND status = 'pendente'
  AND data_vencimento BETWEEN '2026-01-01' AND '2026-12-31';

-- Saída com índice: "Index Scan using ix_cp_empresa_vencimento_status"
-- Saída sem índice: "Seq Scan on contas_pagar" (ruim — full table scan)
```

---

## Índices adicionados por tabela (resumo)

| Tabela | Índices | Benefício |
|--------|---------|---------|
| `contas_pagar` | empresa+status, vencimento, empresa+vencimento+status, conta_bancaria | Filtros de dashboard financeiro |
| `contas_receber` | empresa+status, vencimento, empresa+vencimento+status, conta_bancaria | Filtros de dashboard financeiro |
| `movimentos_estoque` | produto, produto+deposito, data, tipo | Posição de estoque e relatórios |
| `solicitacoes_compra` | numero(unique), status, data | Busca por número e listagem |
| `pedidos_compra` | numero(unique), fornecedor+status, data | Busca e filtros de compras |
| `orcamentos` | numero(unique), cliente+status, data | Busca e funil de vendas |
| `pedidos_venda` | numero(unique), cliente+status, data | Busca e rastreamento |
| `usuarios` | username(unique) | Login eficiente |
| `clientes_completo` | documento, nome | Busca de clientes |
| `fornecedores` | cnpj, nome | Busca de fornecedores |

---

## Benefícios

- Queries de listagem com filtro de 100ms → 1-3ms com volume real de dados
- Dashboard financeiro renderiza instantaneamente mesmo com 100.000 lançamentos
- Índices únicos em números de documento evitam duplicatas a nível de banco
- Melhora o tempo de resposta percebido pelo usuário sem nenhuma mudança de código de aplicação

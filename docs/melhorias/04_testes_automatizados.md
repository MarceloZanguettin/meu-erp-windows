# Melhoria 04 — Qualidade: Testes Automatizados

**Categoria**: Qualidade  
**Prioridade**: 🟠 Alto  
**Esforço estimado**: 8 horas  
**Risco se ignorado**: Regressões só são detectadas em produção, aumentando custo de correção

---

## Problema

O projeto não possui nenhum arquivo de teste — sem `pytest`, sem `vitest`, sem nenhuma configuração de testing. Qualquer mudança no código pode quebrar funcionalidades existentes sem aviso.

```
# Estrutura atual — PROBLEMA
backend/
├── tests/    ← NÃO EXISTE
frontend/
└── __tests__/ ← NÃO EXISTE
```

### Áreas de maior risco sem testes

1. **Autenticação**: Login com credenciais inválidas, bloqueio por força bruta, expiração de JWT
2. **Financeiro**: Marcar conta como paga/recebida, estorno, filtros por data
3. **Vendas**: Orçamento → PedidoVenda → Faturamento (fluxo com movimentação de estoque)
4. **Compras**: SolicitaçãoCompra → aprovação → PedidoCompra → recebimento (entrada de estoque)
5. **Estoque**: Saldo não pode ficar negativo

---

## Solução — Backend (pytest)

### Passo 1 — Instalar dependências de teste

```bash
pip install pytest pytest-asyncio httpx factory-boy

# Adicionar ao requirements.txt:
pytest==8.3.2
pytest-asyncio==0.23.8
httpx==0.27.2         # ASGI test client (sem precisar de servidor real)
factory-boy==3.3.1    # Geração de dados de teste
```

### Passo 2 — Criar estrutura de diretórios

```
backend/
└── tests/
    ├── __init__.py
    ├── conftest.py              # Fixtures compartilhadas (banco, cliente HTTP)
    ├── test_auth.py             # Testes de autenticação
    ├── test_financeiro.py       # Testes de contas pagar/receber
    ├── test_vendas.py           # Testes de orçamento e pedidos de venda
    ├── test_compras.py          # Testes de solicitações e pedidos de compra
    └── test_estoque.py          # Testes de movimentação de estoque
```

### Passo 3 — Criar `backend/tests/conftest.py`

```python
# backend/tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base, get_db
from main import app

# Banco SQLite em memória para testes (sem PostgreSQL necessário)
SQLALCHEMY_DATABASE_URL_TEST = "sqlite:///./test.db"

engine_test = create_engine(
    SQLALCHEMY_DATABASE_URL_TEST,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


@pytest.fixture(scope="session", autouse=True)
def criar_tabelas():
    """Cria todas as tabelas antes dos testes e limpa depois."""
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture(scope="function")
def db():
    """Sessão de banco limpa para cada teste."""
    connection = engine_test.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db):
    """Cliente HTTP com banco de teste injetado."""
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def token_admin(client):
    """Retorna token JWT de administrador para testes autenticados."""
    response = client.post("/api/login", json={
        "username": "admin",
        "password": "admin"
    })
    return response.json()["access_token"]


@pytest.fixture
def headers_admin(token_admin):
    """Headers com autenticação de admin."""
    return {"Authorization": f"Bearer {token_admin}"}
```

### Passo 4 — Criar `backend/tests/test_auth.py`

```python
# backend/tests/test_auth.py
import pytest


def test_login_sucesso(client):
    """Login com credenciais válidas retorna token."""
    response = client.post("/api/login", json={
        "username": "admin",
        "password": "admin"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["username"] == "admin"


def test_login_senha_errada(client):
    """Login com senha inválida retorna 401."""
    response = client.post("/api/login", json={
        "username": "admin",
        "password": "senha-errada"
    })
    assert response.status_code == 401


def test_login_usuario_inexistente(client):
    """Login com usuário que não existe retorna 401."""
    response = client.post("/api/login", json={
        "username": "nao-existe",
        "password": "qualquer"
    })
    assert response.status_code == 401


def test_login_campos_obrigatorios(client):
    """Login sem username retorna 422 (validação Pydantic)."""
    response = client.post("/api/login", json={"password": "admin"})
    assert response.status_code == 422


def test_rota_protegida_sem_token(client):
    """Acesso a rota protegida sem token retorna 401."""
    response = client.get("/financeiro/contas-pagar")
    assert response.status_code == 401


def test_rota_protegida_token_invalido(client):
    """Token forjado/expirado retorna 401."""
    response = client.get(
        "/financeiro/contas-pagar",
        headers={"Authorization": "Bearer token-invalido"}
    )
    assert response.status_code == 401


def test_status_endpoint(client):
    """Endpoint de status retorna 200."""
    response = client.get("/api/status")
    assert response.status_code == 200
```

### Passo 5 — Criar `backend/tests/test_financeiro.py`

```python
# backend/tests/test_financeiro.py
import pytest
from datetime import date, timedelta


@pytest.fixture
def empresa_e_conta(client, headers_admin, db):
    """Cria empresa e conta bancária para testes financeiros."""
    from models.tabelas import Empresa, ContaBancaria
    
    empresa = Empresa(nome="Empresa Teste")
    db.add(empresa)
    db.flush()
    
    conta = ContaBancaria(
        banco="Banco Teste",
        agencia="0001",
        numero="12345-6",
        empresa_id=empresa.id
    )
    db.add(conta)
    db.commit()
    
    return empresa, conta


def test_listar_empresas(client, headers_admin):
    """GET /financeiro/empresas retorna lista."""
    response = client.get("/financeiro/empresas", headers=headers_admin)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_criar_conta_pagar(client, headers_admin, empresa_e_conta):
    """POST /financeiro/contas-pagar cria nova conta."""
    empresa, conta = empresa_e_conta
    response = client.post(
        "/financeiro/contas-pagar",
        headers=headers_admin,
        json={
            "descricao": "Aluguel Janeiro",
            "valor": 1500.00,
            "data_vencimento": str(date.today() + timedelta(days=10)),
            "empresa_id": empresa.id,
            "conta_bancaria_id": conta.id
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["descricao"] == "Aluguel Janeiro"
    assert data["status"] == "pendente"


def test_marcar_conta_paga(client, headers_admin, empresa_e_conta, db):
    """PATCH /financeiro/contas-pagar/{id}/pagar altera status para 'pago'."""
    empresa, conta = empresa_e_conta
    
    # Criar conta
    response = client.post(
        "/financeiro/contas-pagar",
        headers=headers_admin,
        json={
            "descricao": "Fornecedor XYZ",
            "valor": 500.00,
            "data_vencimento": str(date.today()),
            "empresa_id": empresa.id,
            "conta_bancaria_id": conta.id
        }
    )
    conta_id = response.json()["id"]
    
    # Marcar como paga
    response = client.patch(
        f"/financeiro/contas-pagar/{conta_id}/pagar",
        headers=headers_admin
    )
    assert response.status_code == 200
    assert response.json()["status"] == "pago"
    assert response.json()["data_pagamento"] is not None


def test_estornar_conta_paga(client, headers_admin, empresa_e_conta):
    """PATCH /financeiro/contas-pagar/{id}/estornar volta status para 'pendente'."""
    empresa, conta = empresa_e_conta
    
    # Criar e pagar
    create_resp = client.post(
        "/financeiro/contas-pagar",
        headers=headers_admin,
        json={
            "descricao": "Para estornar",
            "valor": 100.00,
            "data_vencimento": str(date.today()),
            "empresa_id": empresa.id,
            "conta_bancaria_id": conta.id
        }
    )
    conta_id = create_resp.json()["id"]
    client.patch(f"/financeiro/contas-pagar/{conta_id}/pagar", headers=headers_admin)
    
    # Estornar
    response = client.patch(
        f"/financeiro/contas-pagar/{conta_id}/estornar",
        headers=headers_admin
    )
    assert response.status_code == 200
    assert response.json()["status"] == "pendente"


def test_deletar_conta_inexistente(client, headers_admin):
    """DELETE em ID inválido retorna 404."""
    response = client.delete(
        "/financeiro/contas-pagar/99999",
        headers=headers_admin
    )
    assert response.status_code == 404
```

### Passo 6 — Criar `backend/tests/test_vendas.py`

```python
# backend/tests/test_vendas.py
import pytest
from datetime import date


@pytest.fixture
def produto_e_cliente(db):
    """Cria produto com estoque e cliente para testes de venda."""
    from models.tabelas import Produto, Cliente
    
    produto = Produto(
        nome="Produto Teste",
        preco=100.00,
        estoque=50
    )
    cliente = Cliente(nome="Cliente Teste", cpf_cnpj="00000000000")
    
    db.add(produto)
    db.add(cliente)
    db.commit()
    db.refresh(produto)
    db.refresh(cliente)
    
    return produto, cliente


def test_criar_orcamento(client, headers_admin, produto_e_cliente):
    """POST /vendas/orcamentos cria orçamento com itens."""
    produto, cliente = produto_e_cliente
    response = client.post(
        "/vendas/orcamentos",
        headers=headers_admin,
        json={
            "cliente_id": cliente.id,
            "nome_cliente": cliente.nome,
            "data_emissao": str(date.today()),
            "data_validade": str(date.today()),
            "itens": [{
                "produto_id": produto.id,
                "descricao": produto.nome,
                "quantidade": 5,
                "preco_unitario": 100.00,
                "unidade": "UN"
            }]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "aberto"
    assert data["total"] == 500.00


def test_converter_orcamento_em_pedido(client, headers_admin, produto_e_cliente):
    """PATCH /vendas/orcamentos/{id}/converter gera PedidoVenda."""
    produto, cliente = produto_e_cliente
    
    # Criar orçamento
    orc_resp = client.post(
        "/vendas/orcamentos",
        headers=headers_admin,
        json={
            "cliente_id": cliente.id,
            "nome_cliente": cliente.nome,
            "data_emissao": str(date.today()),
            "data_validade": str(date.today()),
            "itens": [{
                "produto_id": produto.id,
                "descricao": produto.nome,
                "quantidade": 2,
                "preco_unitario": 100.00,
                "unidade": "UN"
            }]
        }
    )
    orc_id = orc_resp.json()["id"]
    
    # Converter em pedido
    response = client.patch(
        f"/vendas/orcamentos/{orc_id}/converter",
        headers=headers_admin
    )
    assert response.status_code == 200
    assert response.json()["status"] == "aberto"
    # Orçamento deve ficar como convertido
    orc_final = client.get(f"/vendas/orcamentos", headers=headers_admin).json()
    orc = next(o for o in orc_final if o["id"] == orc_id)
    assert orc["status"] == "convertido"
```

---

## Solução — Frontend (Vitest)

### Passo 1 — Instalar dependências

```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Passo 2 — Configurar `vite.config.js`

```javascript
// frontend/vite.config.js (adicionar seção test)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
  }
})
```

### Passo 3 — Criar `frontend/src/test-setup.js`

```javascript
// frontend/src/test-setup.js
import '@testing-library/jest-dom'
```

### Passo 4 — Teste do Zustand store

```javascript
// frontend/src/__tests__/uiStore.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useUIStore } from '../store/uiStore'

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({ notificacoes: [], usuario: null })
  })

  it('adiciona e remove notificação', () => {
    const { result } = renderHook(() => useUIStore())
    
    act(() => result.current.addNotificacao('Sucesso!', 'success'))
    expect(result.current.notificacoes).toHaveLength(1)
    
    const id = result.current.notificacoes[0].id
    act(() => result.current.removeNotificacao(id))
    expect(result.current.notificacoes).toHaveLength(0)
  })

  it('seta e limpa usuário', () => {
    const { result } = renderHook(() => useUIStore())
    
    act(() => result.current.setUsuario({ username: 'admin', permissao: 'admin' }))
    expect(result.current.usuario.username).toBe('admin')
    
    act(() => result.current.setUsuario(null))
    expect(result.current.usuario).toBeNull()
  })
})
```

### Passo 5 — Scripts de teste no `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Executar os testes

```bash
# Backend
cd backend
python -m pytest tests/ -v

# Backend com cobertura
python -m pytest tests/ --cov=. --cov-report=html

# Frontend
cd frontend
npm run test

# Frontend com cobertura
npm run test:coverage
```

---

## Benefícios

- Regressões detectadas antes de chegar à produção
- Cada novo endpoint pode ter teste antes de entrar em produção (TDD)
- CI/CD pode bloquear merge de PRs com testes falhando (ver melhoria 08)
- Documentação viva: testes descrevem o comportamento esperado de cada rota

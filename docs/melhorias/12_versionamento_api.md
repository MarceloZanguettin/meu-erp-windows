# Melhoria 12 — Manutenibilidade: Versionamento da API

**Categoria**: Manutenibilidade  
**Prioridade**: 🟢 Baixo  
**Esforço estimado**: 30 minutos  
**Risco se ignorado**: Qualquer mudança de contrato na API quebra clientes existentes sem possibilidade de transição gradual

---

## Problema

Todas as rotas da API não possuem versão:

```
GET  /financeiro/contas-pagar
POST /cadastros/clientes
POST /api/login
GET  /estoque/posicao
```

Se no futuro for necessário alterar o formato de uma resposta (por exemplo, mudar `cpf_cnpj` para campos separados `cpf` e `cnpj` em clientes), todos os clientes que consumem a API (frontend, integrações futuras) quebram imediatamente.

---

## Solução — Prefixo de versão `/api/v1/`

### Estratégia adotada

A abordagem mais simples e amplamente adotada é adicionar a versão no path:

```
/api/v1/financeiro/contas-pagar   ← Nova versão
/api/v1/cadastros/clientes
/api/v1/auth/login
```

Quando houver mudanças incompatíveis no futuro:
```
/api/v2/financeiro/contas-pagar   ← Nova versão com contrato diferente
/api/v1/financeiro/contas-pagar   ← Versão anterior mantida por 6 meses (deprecation period)
```

### Passo 1 — Atualizar o prefixo dos routers em `backend/main.py`

```python
# backend/main.py (PROPOSTO)
from fastapi import FastAPI

API_V1_PREFIX = "/api/v1"

app = FastAPI(
    title="ERP API",
    version="1.0.0",
    description="ERP Desktop — API REST",
    docs_url="/api/docs",          # Swagger UI
    redoc_url="/api/redoc",        # ReDoc
    openapi_url="/api/openapi.json"
)

# Rotas com versionamento
app.include_router(auth_router,      prefix=f"{API_V1_PREFIX}")          # /api/v1/login
app.include_router(financeiro_router, prefix=f"{API_V1_PREFIX}/financeiro")  # /api/v1/financeiro
app.include_router(cadastro_router,  prefix=f"{API_V1_PREFIX}/cadastros")
app.include_router(estoque_router,   prefix=f"{API_V1_PREFIX}/estoque")
app.include_router(compras_router,   prefix=f"{API_V1_PREFIX}/compras")
app.include_router(vendas_router,    prefix=f"{API_V1_PREFIX}/vendas")
app.include_router(usuarios_router,  prefix=f"{API_V1_PREFIX}/usuarios")
app.include_router(pedido_router,    prefix=f"{API_V1_PREFIX}")
app.include_router(sistema_router,   prefix=f"{API_V1_PREFIX}")           # /api/v1/status, /api/v1/health
```

### Passo 2 — Atualizar a baseURL no frontend

```javascript
// frontend/src/services/api.js (ou onde axios é configurado)
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8050/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

```javascript
// frontend/.env.example
VITE_API_URL=http://localhost:8050/api/v1
```

```javascript
// frontend/.env.production
VITE_API_URL=https://erp.suaempresa.com.br/api/v1
```

### Passo 3 — Atualizar chamadas de serviço no frontend

```javascript
// Antes (ATUAL):
const response = await axios.get('http://localhost:8050/financeiro/contas-pagar')

// Depois (PROPOSTO — usando a instância configurada):
import api from '@/services/api'
const response = await api.get('/financeiro/contas-pagar')
// URL final: http://localhost:8050/api/v1/financeiro/contas-pagar
```

### Passo 4 — Adicionar cabeçalho de versão nas respostas

```python
# backend/core/request_logging.py (adicionar ao middleware)
async def dispatch(self, request: Request, call_next) -> Response:
    response = await call_next(request)
    response.headers["X-API-Version"] = "1.0.0"  # ← Informa a versão ao cliente
    return response
```

---

## Como lidar com versões futuras

Quando houver breaking changes, criar um router v2 paralelo:

```python
# backend/main.py
# Manter v1 funcionando enquanto v2 é desenvolvida
app.include_router(financeiro_router_v1, prefix="/api/v1/financeiro")
app.include_router(financeiro_router_v2, prefix="/api/v2/financeiro")
```

Anunciar deprecation no cabeçalho:
```python
# No router v1 (após v2 estar estável)
response.headers["Deprecation"] = "true"
response.headers["Sunset"] = "2027-01-01"  # Data de remoção
response.headers["Link"] = '</api/v2/financeiro/contas-pagar>; rel="successor-version"'
```

---

## URLs afetadas

| URL Atual | URL Proposta |
|-----------|-------------|
| `POST /api/login` | `POST /api/v1/login` |
| `GET /api/status` | `GET /api/v1/status` |
| `GET /financeiro/empresas` | `GET /api/v1/financeiro/empresas` |
| `GET /financeiro/contas-pagar` | `GET /api/v1/financeiro/contas-pagar` |
| `GET /cadastros/clientes` | `GET /api/v1/cadastros/clientes` |
| `GET /estoque/movimentos` | `GET /api/v1/estoque/movimentos` |
| `GET /compras/solicitacoes` | `GET /api/v1/compras/solicitacoes` |
| `GET /vendas/orcamentos` | `GET /api/v1/vendas/orcamentos` |
| `POST /pedidos/` | `POST /api/v1/pedidos/` |

---

## Documentação automática (Swagger)

Com FastAPI, ao adicionar o prefixo, a documentação Swagger em `/api/docs` reflete automaticamente as novas URLs versionadas — sem nenhum esforço adicional.

```
http://localhost:8050/api/docs      ← Swagger UI com todos os endpoints v1
http://localhost:8050/api/redoc     ← ReDoc alternativo
```

---

## Benefícios

- Mudanças no contrato da API não quebram clientes existentes
- Período de transição controlado (v1 e v2 coexistem)
- Facilita integração com sistemas externos no futuro
- Documentação Swagger claramente versionada
- Cabeçalho `X-API-Version` permite que o frontend saiba com qual versão está falando

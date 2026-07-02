# Melhoria 02 — Segurança: CORS Aberto para Qualquer Origem

**Categoria**: Segurança  
**Prioridade**: 🔴 Crítico  
**Esforço estimado**: 5 minutos  
**Risco se ignorado**: Requisições cross-origin de qualquer domínio malicioso são aceitas pelo backend

---

## Problema

Em `backend/main.py`, o middleware CORS está configurado com `allow_origins=["*"]`, o que significa que qualquer site na internet pode fazer requisições ao backend:

```python
# backend/main.py (ATUAL — PROBLEMA)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # ← QUALQUER domínio pode acessar
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Por que isso é problemático

- **CSRF (Cross-Site Request Forgery)**: Um site malicioso pode fazer o navegador de um usuário autenticado enviar requisições ao ERP sem que o usuário saiba
- **Data exfiltration**: Scripts em páginas de terceiros podem consultar dados financeiros se o usuário estiver logado
- **`allow_credentials=True` + `allow_origins=["*"]`**: Esta combinação específica é rejeitada por navegadores modernos (viola a spec do CORS), podendo causar falhas inesperadas

---

## Solução

### Passo 1 — Definir origens permitidas via variável de ambiente

Adicionar ao `backend/.env.example`:

```bash
# Origens permitidas pelo CORS (separadas por vírgula)
# Produção: apenas o domínio real da aplicação
# Desenvolvimento: localhost nas portas usadas
CORS_ORIGINS=http://localhost:8000,http://localhost:5173
```

### Passo 2 — Atualizar `backend/main.py`

```python
# backend/main.py (PROPOSTO)
import os
from fastapi.middleware.cors import CORSMiddleware

# Lê origens do ambiente ou usa padrão de desenvolvimento
_cors_raw = os.getenv("CORS_ORIGINS", "http://localhost:8000,http://localhost:5173")
ALLOWED_ORIGINS = [origin.strip() for origin in _cors_raw.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,    # ← Lista restrita de origens
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)
```

### Passo 3 — Valores por ambiente

**Desenvolvimento local** (`backend/.env`):
```bash
CORS_ORIGINS=http://localhost:8000,http://localhost:5173
```

**Produção** (variável de ambiente do servidor):
```bash
CORS_ORIGINS=https://erp.suaempresa.com.br
```

**Desktop com Eel** (sem rede externa):

Quando o Eel serve o frontend em `localhost:8000`, o CORS já é irrelevante porque o frontend e o backend estão na mesma máquina. Mesmo assim, manter a restrição por boas práticas:
```bash
CORS_ORIGINS=http://localhost:8000
```

---

## Contexto adicional — Eel vs. modo web

Este ERP usa Eel para rodar como aplicativo desktop. Nesse cenário:
- O frontend é servido pelo Eel em `localhost:8000`
- O backend FastAPI fica em `localhost:8050`
- O CORS é necessário porque são portas diferentes (origens diferentes)

Se no futuro o ERP for implantado como aplicação web, o CORS se torna crítico para bloquear outros domínios.

---

## Verificação após implementação

```bash
# Testar que uma origem desconhecida é bloqueada
curl -X GET http://localhost:8050/api/status \
  -H "Origin: http://site-malicioso.com" \
  -v 2>&1 | grep -E "Access-Control|HTTP"

# Saída esperada: sem cabeçalho Access-Control-Allow-Origin
# (origem não está na lista permitida)

# Testar que a origem local funciona
curl -X GET http://localhost:8050/api/status \
  -H "Origin: http://localhost:5173" \
  -v 2>&1 | grep "Access-Control-Allow-Origin"

# Saída esperada:
# Access-Control-Allow-Origin: http://localhost:5173
```

---

## Benefícios

- Bloqueia requisições cross-origin de domínios não autorizados
- Elimina risco de CSRF em modo web
- Configurável por ambiente sem mudar código
- Segue o princípio do menor privilégio

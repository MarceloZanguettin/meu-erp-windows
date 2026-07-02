# Melhoria 07 — Infraestrutura: Containerização com Docker

**Categoria**: Infraestrutura  
**Prioridade**: 🟡 Médio  
**Esforço estimado**: 3 horas  
**Risco se ignorado**: O projeto só funciona na máquina do desenvolvedor com PostgreSQL local configurado manualmente

---

## Problema

O projeto não possui `Dockerfile` nem `docker-compose.yml`. Para rodar em qualquer ambiente além da máquina de desenvolvimento é necessário:

1. Instalar Python + criar venv manualmente
2. Instalar PostgreSQL e criar banco `erp_db`
3. Configurar usuário e senha do banco
4. Instalar Node.js + npm
5. Configurar variáveis de ambiente
6. Rodar scripts de migração e seed

Isso cria a "funciona na minha máquina" — ambiente impossível de replicar de forma confiável.

---

## Solução — Docker + docker-compose

### Arquitetura containerizada

```
┌─────────────────────────────────────────────────────┐
│  docker-compose.yml                                  │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │   postgres   │  │   backend    │  │ frontend │  │
│  │  port: 5432  │  │  port: 8050  │  │ port:5173│  │
│  │  volume:     │  │  depends_on: │  │          │  │
│  │  pg_data     │  │  postgres    │  │          │  │
│  └──────────────┘  └──────────────┘  └──────────┘  │
│                                                      │
│  Network: erp_network                                │
└─────────────────────────────────────────────────────┘
```

### Passo 1 — Criar `backend/Dockerfile`

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema (psycopg2 precisa de libpq)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependências Python primeiro (aproveitamento de cache Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Porta que o FastAPI usa
EXPOSE 8050

# Não rodar como root
RUN useradd -m -u 1000 erp && chown -R erp:erp /app
USER erp

# Comando de inicialização
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8050"]
```

### Passo 2 — Criar `frontend/Dockerfile`

```dockerfile
# frontend/Dockerfile

# Estágio 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar manifesto de dependências primeiro (cache)
COPY package*.json ./
RUN npm ci

# Copiar código e buildar
COPY . .
RUN npm run build

# Estágio 2: Servidor de produção (nginx)
FROM nginx:alpine

# Copiar build do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração nginx para SPA (redireciona tudo para index.html)
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
```

### Passo 3 — Criar `docker-compose.yml` na raiz

```yaml
# docker-compose.yml
version: "3.9"

services:

  # ─── Banco de dados ────────────────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    container_name: erp-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: erp_db
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}   # Obrigatório — sem default
    volumes:
      - pg_data:/var/lib/postgresql/data       # Dados persistem entre restarts
    ports:
      - "5432:5432"                            # Expor para ferramentas externas (ex: pgAdmin)
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres} -d erp_db"]
      interval: 5s
      timeout: 5s
      retries: 10
    networks:
      - erp_network

  # ─── Backend FastAPI ────────────────────────────────────────────────
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: erp-backend
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD}@postgres:5432/erp_db
      SECRET_KEY: ${SECRET_KEY}
      ACCESS_TOKEN_EXPIRE_MINUTES: ${ACCESS_TOKEN_EXPIRE_MINUTES:-480}
      CORS_ORIGINS: ${CORS_ORIGINS:-http://localhost:5173,http://localhost:80}
    ports:
      - "8050:8050"
    depends_on:
      postgres:
        condition: service_healthy    # Só sobe quando o banco está pronto
    networks:
      - erp_network
    volumes:
      - ./backend:/app                # Desenvolvimento: hot-reload com bind mount
    command: >
      sh -c "alembic upgrade head &&
             uvicorn main:app --host 0.0.0.0 --port 8050 --reload"

  # ─── Frontend React ─────────────────────────────────────────────────
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: erp-frontend
    restart: unless-stopped
    ports:
      - "5173:80"                     # Acessível em localhost:5173
    depends_on:
      - backend
    networks:
      - erp_network

# ─── Volumes ──────────────────────────────────────────────────────────
volumes:
  pg_data:
    name: erp_postgres_data

# ─── Redes ────────────────────────────────────────────────────────────
networks:
  erp_network:
    name: erp_network
    driver: bridge
```

### Passo 4 — Criar `docker-compose.dev.yml` para desenvolvimento

```yaml
# docker-compose.dev.yml (sobrescreve para dev)
version: "3.9"

services:
  backend:
    command: uvicorn main:app --host 0.0.0.0 --port 8050 --reload
    volumes:
      - ./backend:/app   # Hot-reload: mudanças no código refletem imediatamente

  frontend:
    # Em dev, usar Vite diretamente (não nginx)
    build:
      context: ./frontend
      target: ""        # Ignorar estágio nginx
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    command: npm run dev -- --host
    volumes:
      - ./frontend/src:/app/src  # Hot-reload
      - /app/node_modules        # Não sobrescrever node_modules do container
```

`frontend/Dockerfile.dev`:
```dockerfile
# frontend/Dockerfile.dev
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

### Passo 5 — Criar `.env` de exemplo para Docker

```bash
# .env.docker.example (na raiz — para o docker-compose)
# Copiar para .env e preencher

# Banco de dados
POSTGRES_USER=postgres
POSTGRES_PASSWORD=SENHA_SEGURA_AQUI

# JWT
SECRET_KEY=GERE_COM_python_-c_"import_secrets;_print(secrets.token_hex(32))"
ACCESS_TOKEN_EXPIRE_MINUTES=480

# CORS
CORS_ORIGINS=http://localhost:5173
```

### Passo 6 — Comandos de uso

```bash
# ─── Primeira vez ────────────────────────────────────────────────────
cp .env.docker.example .env
# Editar .env com senhas reais

# Build e subir todos os serviços
docker compose up --build

# ─── Uso diário ──────────────────────────────────────────────────────
docker compose up -d              # Subir em background
docker compose down               # Derrubar
docker compose logs -f backend    # Ver logs do backend
docker compose logs -f frontend   # Ver logs do frontend

# ─── Banco de dados ──────────────────────────────────────────────────
# Acessar PostgreSQL dentro do container
docker compose exec postgres psql -U postgres -d erp_db

# Rodar migrations manualmente
docker compose exec backend alembic upgrade head

# Rodar seeds
docker compose exec backend python seed_financeiro.py

# ─── Desenvolvimento ─────────────────────────────────────────────────
# Combinar arquivos para dev com hot-reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# ─── Manutenção ──────────────────────────────────────────────────────
# Remover volumes (limpa banco!)
docker compose down -v

# Ver estado dos containers
docker compose ps

# Rebuildar apenas o backend
docker compose build backend
```

---

## .dockerignore

Criar `.dockerignore` na raiz e em `backend/`:

```
# .dockerignore (raiz)
venv/
__pycache__/
*.pyc
.env
.git
node_modules/
frontend/dist/
docs/
```

```
# backend/.dockerignore
venv/
__pycache__/
*.pyc
.env
tests/
*.db
```

---

## Nota sobre Eel (modo desktop)

O Eel (que abre janela Chrome desktop) **não funciona em container** — ele precisa de um browser instalado na máquina host.

Para rodar com Docker, o backend deve funcionar **apenas como API REST** (sem Eel). A UI seria acessada via browser em `http://localhost:5173`.

Proposta de flag para habilitar/desabilitar Eel:
```python
# backend/main.py
import os

USE_EEL = os.getenv("USE_EEL", "true").lower() == "true"

@app.on_event("startup")
async def startup():
    if USE_EEL:
        # Iniciar Eel (modo desktop)
        ...
    # else: apenas API (modo web/docker)
```

No `docker-compose.yml`:
```yaml
backend:
  environment:
    USE_EEL: "false"   # Container não usa Eel
```

---

## Benefícios

- Ambiente idêntico em qualquer máquina (dev, staging, produção)
- PostgreSQL containerizado — sem instalação local
- Migrations aplicadas automaticamente no startup
- Banco persistente via Docker volumes
- Hot-reload em desenvolvimento
- Base para deploy em cloud (AWS ECS, Azure Container Apps, etc.)

# Melhoria 08 — Automação: CI/CD com GitHub Actions

**Categoria**: Automação / Entrega Contínua  
**Prioridade**: 🟡 Médio  
**Esforço estimado**: 2 horas  
**Risco se ignorado**: Bugs e erros de sintaxe chegam à produção sem barreira automática

---

## Problema

Não existe nenhum diretório `.github/workflows/` no repositório. Cada mudança de código é integrada manualmente, sem validação automatizada:

```
# Estado atual — sem CI/CD
git push origin main
    ↓
Código vai direto para main sem verificação
    ↓
Bugs só são descobertos em produção
```

---

## Solução — GitHub Actions

### Arquitetura proposta

```
┌─────────────────────────────────────────────────────────────┐
│  Desenvolvedor faz git push / abre Pull Request              │
│                            ↓                                  │
│  GitHub Actions — ci.yml                                     │
│                                                              │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │  Job: backend   │    │  Job: frontend   │  (paralelo)     │
│  │                 │    │                  │                 │
│  │ 1. pip install  │    │ 1. npm ci        │                 │
│  │ 2. pytest       │    │ 2. npm run lint  │                 │
│  │ 3. ruff lint    │    │ 3. npm run build │                 │
│  └─────────────────┘    └──────────────────┘                │
│              ↓                  ↓                            │
│         ✅ Pass           ✅ Pass                            │
│              └──────────────────┘                            │
│                       ↓                                      │
│              Merge liberado                                   │
└─────────────────────────────────────────────────────────────┘
```

### Passo 1 — Criar estrutura de diretórios

```bash
mkdir -p .github/workflows
```

### Passo 2 — Criar `.github/workflows/ci.yml`

```yaml
# .github/workflows/ci.yml
name: CI — Backend + Frontend

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:

  # ─── Backend ──────────────────────────────────────────────────────
  backend:
    name: Backend (Python)
    runs-on: ubuntu-latest

    services:
      # PostgreSQL para testes de integração
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: erp_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://postgres:postgres_test@localhost:5432/erp_test
      SECRET_KEY: ci-test-key-32-characters-minimum-here
      ACCESS_TOKEN_EXPIRE_MINUTES: 60

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Configurar Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: "pip"
          cache-dependency-path: backend/requirements.txt

      - name: Instalar dependências
        run: |
          python -m pip install --upgrade pip
          pip install -r backend/requirements.txt

      - name: Lint (ruff)
        run: |
          pip install ruff
          ruff check backend/ --ignore E501
        continue-on-error: false

      - name: Testes (pytest)
        working-directory: backend
        run: |
          pytest tests/ -v --tb=short
        env:
          PYTHONPATH: .

      - name: Upload relatório de cobertura
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report-backend
          path: backend/htmlcov/
          if-no-files-found: ignore

  # ─── Frontend ─────────────────────────────────────────────────────
  frontend:
    name: Frontend (React/Vite)
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: frontend

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Configurar Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Instalar dependências
        run: npm ci

      - name: Lint (ESLint)
        run: npm run lint

      - name: Testes (Vitest)
        run: npm run test
        continue-on-error: false

      - name: Build de produção
        run: npm run build

      - name: Verificar tamanho do bundle
        run: |
          du -sh dist/
          # Falhar se bundle passar de 5MB
          size=$(du -s dist/ | cut -f1)
          if [ "$size" -gt 5120 ]; then
            echo "Bundle muito grande: ${size}KB (limite: 5120KB)"
            exit 1
          fi
```

### Passo 3 — Criar `.github/workflows/security.yml` (análise de segurança)

```yaml
# .github/workflows/security.yml
name: Segurança

on:
  push:
    branches: [main]
  schedule:
    - cron: "0 8 * * 1"  # Toda segunda-feira às 8h

jobs:
  audit-python:
    name: Auditoria Python (pip-audit)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install pip-audit
      - run: pip-audit -r backend/requirements.txt

  audit-npm:
    name: Auditoria npm
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm audit --audit-level=high

  secret-scan:
    name: Varredura de segredos (Trufflehog)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Escanear por credenciais no histórico
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
```

### Passo 4 — Criar `.github/workflows/release.yml` (deploy manual)

```yaml
# .github/workflows/release.yml
name: Deploy (Manual)

on:
  workflow_dispatch:        # Acionado manualmente no GitHub
    inputs:
      environment:
        description: "Ambiente de deploy"
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  deploy:
    name: Deploy para ${{ github.event.inputs.environment }}
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}

    steps:
      - uses: actions/checkout@v4

      - name: Build do frontend
        working-directory: frontend
        run: |
          npm ci
          npm run build

      - name: Notificar deploy
        run: |
          echo "Fazendo deploy para ${{ github.event.inputs.environment }}"
          echo "Commit: ${{ github.sha }}"
          # Adicionar aqui: rsync, scp, kubectl apply, etc.
```

### Passo 5 — Configurar Branch Protection no GitHub

No GitHub, ir em: `Settings → Branches → Add rule` para a branch `main`:

```
Branch name pattern: main

☑ Require a pull request before merging
  ☑ Require approvals: 1

☑ Require status checks to pass before merging
  Status checks obrigatórios:
    ✓ Backend (Python)
    ✓ Frontend (React/Vite)

☑ Require branches to be up to date before merging

☑ Do not allow bypassing the above settings
```

### Passo 6 — Adicionar `ruff` como linter Python

```bash
pip install ruff

# Criar pyproject.toml ou ruff.toml na raiz do backend
```

```toml
# backend/ruff.toml
line-length = 100
target-version = "py311"

[lint]
select = ["E", "F", "W", "I"]   # pycodestyle, pyflakes, isort
ignore = [
    "E501",   # Linha muito longa (já configurado pelo line-length)
    "F401",   # Import não usado (remover gradualmente)
]
```

---

## Status badges no README

Adicionar no `README.md` (ou `CLAUDE.md`):

```markdown
[![CI](https://github.com/MarceloZanguettin/meu-erp-windows/actions/workflows/ci.yml/badge.svg)](https://github.com/MarceloZanguettin/meu-erp-windows/actions/workflows/ci.yml)
[![Security](https://github.com/MarceloZanguettin/meu-erp-windows/actions/workflows/security.yml/badge.svg)](https://github.com/MarceloZanguettin/meu-erp-windows/actions/workflows/security.yml)
```

---

## Segredos necessários no GitHub

Configurar em `Settings → Secrets and variables → Actions`:

| Nome do Secret | Valor |
|---------------|-------|
| `POSTGRES_PASSWORD` | Senha do banco de testes |
| `SECRET_KEY` | Chave JWT para testes |

Esses valores são usados apenas nos workflows, nunca expostos nos logs.

---

## Fluxo de trabalho com CI/CD

```
Desenvolvedor                    GitHub Actions
─────────────                    ──────────────
git checkout -b feat/nova-rota
# ... edita código ...
git commit -m "feat: nova rota"
git push origin feat/nova-rota
                                ← Roda CI automaticamente
                                ← ✅ Backend pass
                                ← ✅ Frontend pass
Abre Pull Request
# Code review por outro dev
Merge no main
                                ← Roda CI no main
                                ← ✅ Todos os checks passam
                                ← Código seguro para deploy
```

---

## Benefícios

- Bugs de sintaxe e regressões detectados antes do merge
- Linter garante consistência de estilo
- Vulnerabilidades de dependências detectadas semanalmente
- Histórico de execuções de CI no GitHub para debugging
- Branch protection impede push direto na main com falhas
- Base para deploy automatizado (CD) no futuro

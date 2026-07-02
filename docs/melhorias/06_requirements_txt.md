# Melhoria 06 — Reprodutibilidade: Arquivo requirements.txt

**Categoria**: Reprodutibilidade  
**Prioridade**: 🟠 Alto  
**Esforço estimado**: 10 minutos  
**Risco se ignorado**: Impossível replicar o ambiente em outro computador ou servidor sem saber quais pacotes instalar

---

## Problema

As dependências Python do backend estão apenas dentro do diretório `venv/` local — que não é commitado no git:

```
# Estrutura atual — PROBLEMA
meu-erp-windows/
├── venv/          ← Local, não vai pro git (.gitignore)
│   └── Lib/
│       └── site-packages/  ← Pacotes aqui, mas invisíveis
├── backend/
│   └── (sem requirements.txt)
└── frontend/
    └── package.json  ← Frontend tem, backend não
```

### Consequências

1. **Novo desenvolvedor**: precisa adivinhar quais pacotes instalar
2. **Outro computador**: sem `requirements.txt`, o ambiente não pode ser replicado
3. **Docker**: `Dockerfile` precisaria de `requirements.txt` (ver melhoria 07)
4. **CI/CD**: pipeline não consegue instalar dependências (ver melhoria 08)
5. **Conflitos de versão**: sem versões fixas, `pip install fastapi` pode instalar uma versão diferente e quebrar

---

## Solução

### Opção A — requirements.txt simples (mínimo viável)

```bash
# Ativar venv
source venv/Scripts/activate  # Windows

# Exportar todas as dependências instaladas com versões exatas
cd backend
pip freeze > requirements.txt
```

Resultado esperado (aproximado):
```
# backend/requirements.txt
annotated-types==0.7.0
anyio==4.4.0
bcrypt==4.2.0
cffi==1.17.1
click==8.1.7
colorama==0.4.6
cryptography==43.0.3
ecdsa==0.19.0
email_validator==2.2.0
fastapi==0.115.0
greenlet==3.1.1
h11==0.14.0
httpcore==1.0.6
httpx==0.27.2
idna==3.10
iniconfig==2.0.0
packaging==24.1
passlib[bcrypt]==1.7.4
pluggy==1.5.0
psycopg2-binary==2.9.9
pyasn1==0.6.1
pycparser==2.22
pydantic==2.9.2
pydantic-core==2.23.4
pydantic-settings==2.5.2
pytest==8.3.2
python-dotenv==1.0.1
python-jose[cryptography]==3.3.0
python-multipart==0.0.12
rsa==4.9
six==1.16.0
sniffio==1.3.1
SQLAlchemy==2.0.35
starlette==0.41.0
typing_extensions==4.12.2
uvicorn==0.31.0
```

### Opção B — pip-tools (recomendado para produção)

`pip-tools` separa as dependências diretas (que você escolheu) das transitivas (instaladas automaticamente):

```bash
pip install pip-tools
```

Criar `backend/requirements.in` (dependências diretas):
```
# backend/requirements.in — APENAS o que você usa diretamente
fastapi
uvicorn[standard]
sqlalchemy
psycopg2-binary
python-dotenv
passlib[bcrypt]
python-jose[cryptography]
pydantic[email]
python-multipart
eel
redis[hiredis]

# Testes (apenas em dev)
pytest
pytest-asyncio
httpx
```

Gerar o `requirements.txt` com versões fixas:
```bash
cd backend
pip-compile requirements.in --output-file requirements.txt
```

Atualizar dependências:
```bash
pip-compile --upgrade requirements.in
```

### Separar dependências de produção e desenvolvimento

```
backend/
├── requirements.txt          # Produção (gerado por pip-compile)
├── requirements.in           # Diretas de produção
├── requirements-dev.txt      # Desenvolvimento (pytest, httpx, etc.)
└── requirements-dev.in       # Diretas de desenvolvimento
```

`requirements-dev.in`:
```
-r requirements.in     # Inclui todas de produção
pytest
pytest-asyncio
httpx
factory-boy
```

Gerar:
```bash
pip-compile requirements-dev.in --output-file requirements-dev.txt
```

### Instalar em novo ambiente

```bash
# Clonar o projeto
git clone https://github.com/MarceloZanguettin/meu-erp-windows.git
cd meu-erp-windows

# Criar venv
python -m venv venv
source venv/Scripts/activate  # Windows

# Instalar dependências de produção
pip install -r backend/requirements.txt

# Ou de desenvolvimento
pip install -r backend/requirements-dev.txt
```

### Atualizar o README / CLAUDE.md

Adicionar instrução de setup:
```markdown
## Setup — Primeira vez

```bash
# Backend
python -m venv venv
source venv/Scripts/activate  # Windows / source venv/bin/activate  # Linux
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env  # Preencher com valores reais

# Frontend
cd frontend && npm install
```
```

---

## Verificação após implementação

```bash
# Em uma pasta limpa (sem venv), testar se as dependências instalam corretamente
python -m venv venv_teste
source venv_teste/Scripts/activate
pip install -r backend/requirements.txt
python -c "from fastapi import FastAPI; from sqlalchemy import create_engine; print('OK')"
# Saída esperada: OK

# Limpar venv de teste
deactivate
rm -rf venv_teste
```

---

## Benefícios

- Qualquer desenvolvedor consegue configurar o ambiente com um único comando
- Docker pode instalar as dependências (ver melhoria 07)
- CI/CD consegue instalar e rodar os testes (ver melhoria 08)
- Versões fixas garantem comportamento consistente entre ambientes
- Facilita auditoria de segurança (verificar se pacotes têm vulnerabilidades conhecidas com `pip audit`)

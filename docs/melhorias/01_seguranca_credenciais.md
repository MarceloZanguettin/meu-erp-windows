# Melhoria 01 — Segurança: Credenciais Expostas no Repositório

**Categoria**: Segurança  
**Prioridade**: 🔴 Crítico  
**Esforço estimado**: 30 minutos  
**Risco se ignorado**: Acesso não autorizado ao banco de dados e comprometimento de tokens JWT

---

## Problema

O arquivo `backend/.env` contém credenciais reais commitadas no repositório git:

```
# backend/.env (ATUAL — PROBLEMA)
DATABASE_URL=postgresql://postgres:marcelo123@localhost:5432/erp_db
SECRET_KEY=meu-erp-windows-secret-key-trocar-em-producao-2026
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

### Por que isso é crítico

- Qualquer pessoa com acesso ao repositório (público ou privado) pode ver a senha do banco
- Se o repositório for público ou vazar, as credenciais ficam permanentemente expostas no histórico git — mesmo que o arquivo seja removido depois
- A `SECRET_KEY` do JWT permite forjar tokens de autenticação para qualquer usuário
- O comentário "trocar-em-producao-2026" indica que a chave atual está sendo usada em produção

### Arquivos afetados

- `backend/.env` — contém credenciais reais
- `.gitignore` — precisa garantir que `.env` está ignorado
- Repositório git — o histórico pode conter commits anteriores com credenciais

---

## Solução

### Passo 1 — Verificar se `.env` está no `.gitignore`

Abrir `.gitignore` na raiz do projeto e confirmar que existe a linha:

```gitignore
# Variáveis de ambiente (nunca commitar)
backend/.env
.env
*.env
```

### Passo 2 — Criar o arquivo `.env.example`

Criar `backend/.env.example` com valores fictícios como documentação:

```bash
# backend/.env.example
# Copie este arquivo para backend/.env e preencha com seus valores reais
# NUNCA commite o arquivo .env

# Conexão com PostgreSQL
# Formato: postgresql://usuario:senha@host:porta/nome_banco
DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/erp_db

# Chave secreta para assinatura JWT
# Gere uma chave segura com: python -c "import secrets; print(secrets.token_hex(32))"
# Mínimo: 32 caracteres aleatórios
SECRET_KEY=GERE_UMA_CHAVE_SEGURA_COM_32_CARACTERES_MINIMO

# Tempo de expiração do token JWT em minutos (padrão: 480 = 8 horas)
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

### Passo 3 — Remover `.env` do histórico git (se já commitado)

Se o arquivo `.env` já foi commitado em algum momento, usar BFG Repo-Cleaner ou `git filter-branch` para remover do histórico:

```bash
# Opção 1: BFG Repo-Cleaner (mais simples)
# Baixar BFG: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .env
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push origin --force

# Opção 2: git filter-branch (nativo)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

# Após remover do histórico: trocar TODAS as credenciais comprometidas
# (mesmo removendo do git, a senha pode estar em outros lugares)
```

### Passo 4 — Trocar todas as credenciais comprometidas

Independentemente de limpar o histórico, as credenciais expostas devem ser trocadas:

1. **Senha do PostgreSQL**: Alterar no pgAdmin ou psql
   ```sql
   ALTER USER postgres WITH PASSWORD 'nova-senha-forte-aqui';
   ```

2. **SECRET_KEY do JWT**: Gerar nova chave e atualizar o `.env` local
   ```python
   # Executar no terminal Python para gerar uma chave segura
   import secrets
   print(secrets.token_hex(32))
   # Exemplo de saída: a3f8c2d1e4b9f7a6c5d3e2f1a8b7c9d4e5f2a1b3c6d8e9f0a2b4c5d7e8f9a0b1
   ```

### Passo 5 — Para ambientes de produção

Em produção, não usar arquivo `.env`. Usar variáveis de ambiente do sistema operacional:

**Windows (PowerShell)**:
```powershell
[System.Environment]::SetEnvironmentVariable("DATABASE_URL", "postgresql://...", "Machine")
[System.Environment]::SetEnvironmentVariable("SECRET_KEY", "...", "Machine")
```

**Linux/Ubuntu**:
```bash
# /etc/environment ou /etc/profile.d/erp.sh
export DATABASE_URL="postgresql://..."
export SECRET_KEY="..."
```

**Docker** (ver melhoria 07):
```yaml
# docker-compose.yml
services:
  backend:
    environment:
      DATABASE_URL: ${DATABASE_URL}
      SECRET_KEY: ${SECRET_KEY}
```

**Azure/AWS**: Usar Azure Key Vault ou AWS Secrets Manager e injetar via SDK.

---

## Verificação após implementação

```bash
# 1. Confirmar que .env não está sendo rastreado
git status backend/.env
# Saída esperada: nada (arquivo ignorado)

# 2. Confirmar que .env.example foi adicionado
git status backend/.env.example
# Saída esperada: arquivo aparece como novo (untracked ou staged)

# 3. Confirmar que .env não aparece no histórico recente
git log --all --full-history -- backend/.env
# Saída esperada: nenhum commit listado
```

---

## Benefícios

- Elimina risco imediato de acesso não autorizado ao banco de dados
- Protege tokens JWT contra falsificação
- Facilita onboarding de novos desenvolvedores (`.env.example` como guia)
- Base para implementar gestão de segredos em produção

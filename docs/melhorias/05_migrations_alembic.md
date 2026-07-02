# Melhoria 05 — Confiabilidade: Migrations com Alembic

**Categoria**: Confiabilidade  
**Prioridade**: 🟠 Alto  
**Esforço estimado**: 2 horas  
**Risco se ignorado**: Mudanças de schema em produção exigem downtime manual e podem resultar em perda de dados

---

## Problema

O projeto usa `Base.metadata.create_all()` no startup e scripts de migração manuais avulsos:

```python
# backend/main.py (ATUAL — PROBLEMA)
@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)  # ← Só cria tabelas novas, não altera existentes
```

Além de scripts manuais sem controle de versão:
```
backend/
├── migrate.py              # Reset completo (DROP ALL + CREATE ALL) — destrói dados!
├── migrate_criado_em.py    # Adiciona coluna criado_em manualmente
├── migrate_excel.py        # Migração avulsa
└── migrate_postergado.py   # Migração avulsa
```

### Por que isso é crítico

1. **`create_all()` não modifica tabelas existentes**: Se você adicionar uma coluna em um modelo ORM, a tabela real no banco não é atualizada automaticamente — só novas colunas são criadas se a tabela não existir
2. **`migrate.py` com DROP ALL é destrutivo**: O script de "migração" apaga todos os dados para recriar as tabelas
3. **Sem histórico auditável**: Não dá para saber qual versão do schema está em cada ambiente
4. **Dificulta rollback**: Se uma migração quebrar, não há como reverter de forma controlada

---

## Solução — Alembic

Alembic é o sistema de migrations oficial do SQLAlchemy. Gera arquivos de migração versionados que podem ser aplicados ou revertidos incrementalmente.

### Passo 1 — Instalar Alembic

```bash
# Ativar venv
source venv/Scripts/activate  # Windows

pip install alembic

# Adicionar ao requirements.txt:
alembic==1.13.2
```

### Passo 2 — Inicializar Alembic dentro do backend

```bash
cd backend
alembic init alembic
```

Isso cria:
```
backend/
├── alembic/
│   ├── versions/          # Arquivos de migração (versionados no git)
│   ├── env.py             # Configuração de ambiente
│   └── script.py.mako     # Template para novos arquivos de migração
└── alembic.ini            # Configuração principal
```

### Passo 3 — Configurar `backend/alembic.ini`

Alterar a linha de conexão para ler do `.env`:

```ini
# backend/alembic.ini
[alembic]
# Deixar vazio — será configurado via env.py
script_location = alembic
sqlalchemy.url =
```

### Passo 4 — Configurar `backend/alembic/env.py`

```python
# backend/alembic/env.py
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# Carregar .env
load_dotenv()

# Importar modelos para autogeração de migrations
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.tabelas import Base

config = context.config

# Injetar DATABASE_URL do .env
config.set_main_option("sqlalchemy.url", os.environ["DATABASE_URL"])

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata  # ← Aponta para os modelos ORM


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

### Passo 5 — Gerar a migration inicial (schema atual)

```bash
cd backend
# Gera arquivo de migração baseado nos modelos ORM atuais
alembic revision --autogenerate -m "schema inicial completo"
```

Isso cria um arquivo em `alembic/versions/XXXX_schema_inicial_completo.py` com o schema inteiro.

### Passo 6 — Aplicar a migration ao banco

```bash
# Aplicar todas as migrations pendentes
alembic upgrade head

# Ver versão atual do schema no banco
alembic current

# Ver histórico de migrations
alembic history --verbose
```

### Passo 7 — Atualizar `backend/main.py`

```python
# backend/main.py (PROPOSTO)
from alembic.config import Config
from alembic import command

@app.on_event("startup")
async def startup_event():
    # Aplica migrations pendentes no startup
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    print("✓ Migrations aplicadas com sucesso")
```

### Passo 8 — Workflow para adicionar uma nova coluna

Exemplo: adicionar campo `observacao` na tabela `ContaPagar`:

```python
# 1. Editar o modelo ORM
# backend/models/tabelas.py
class ContaPagar(Base):
    # ... colunas existentes ...
    observacao = Column(String(500), nullable=True)  # ← Nova coluna

# 2. Gerar migration automática
# cd backend
# alembic revision --autogenerate -m "add observacao to contas_pagar"

# 3. Revisar o arquivo gerado em alembic/versions/XXXX_add_observacao.py
# def upgrade() -> None:
#     op.add_column('contas_pagar', sa.Column('observacao', sa.String(500), nullable=True))
#
# def downgrade() -> None:
#     op.drop_column('contas_pagar', 'observacao')

# 4. Aplicar no ambiente de dev
# alembic upgrade head

# 5. Commitar o arquivo de migration no git
# git add alembic/versions/XXXX_add_observacao.py
# git commit -m "migration: add observacao to contas_pagar"
```

---

## Fluxo de deploy com Alembic

```
Desenvolvedor local          Servidor de produção
─────────────────────        ──────────────────────
1. Altera modelo ORM         
2. alembic revision          
   --autogenerate            
3. Revisa migration          
4. alembic upgrade head      
5. Testa localmente          
6. git commit + push         
                             7. git pull
                             8. alembic upgrade head  ← Aplica só o diff
                             9. Restart do backend
```

---

## Comandos úteis

```bash
# Aplicar migrations até uma versão específica
alembic upgrade +1              # Próxima migration
alembic upgrade abc123          # Até uma revisão específica

# Reverter migrations
alembic downgrade -1            # Reverter última migration
alembic downgrade base          # Voltar ao zero (DROP ALL)

# Verificar estado
alembic current                 # Versão atual no banco
alembic history                 # Histórico de migrations
alembic show abc123             # Detalhes de uma migration

# Gerar migration vazia (para dados/seeds controlados)
alembic revision -m "seed dados iniciais"
```

---

## Benefícios

- Histórico completo de mudanças de schema no git
- Rollback controlado em caso de problemas
- Múltiplos ambientes (dev/staging/prod) na mesma versão de schema
- Elimina necessidade de scripts manuais avulsos
- Aplicação automática no startup sem destruir dados

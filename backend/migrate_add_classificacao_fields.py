"""
Migração aditiva: cria/expande a tabela `classificacoes` com as colunas do
modelo Classificacao (campos migrados da tabela CLASSIFICACAO do GENUS),
sem apagar nada.

Diferente de migrate.py (que reseta o banco inteiro com drop_all/create_all),
este script só roda ALTER TABLE ... ADD COLUMN IF NOT EXISTS para colunas que
ainda não existem. É seguro rodar quantas vezes for preciso — nenhuma coluna
ou linha existente é removida ou sobrescrita.

Execute com: python migrate_add_classificacao_fields.py (dentro da pasta backend, com o venv ativo)
"""
import sys
import os
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import inspect, text
from database import engine
import models.tabelas  # noqa: F401 - registra os models no metadata
from models.tabelas import Classificacao

inspector = inspect(engine)
tabela = Classificacao.__tablename__

if tabela not in inspector.get_table_names():
    print(f"Tabela '{tabela}' ainda não existe no banco — será criada normalmente "
          f"pelo create_all() do main.py, com todas as colunas já inclusas. Nada a fazer aqui.")
    sys.exit(0)

colunas_existentes = {c["name"] for c in inspector.get_columns(tabela)}

adicionadas = []
with engine.begin() as conn:
    for coluna in Classificacao.__table__.columns:
        if coluna.name in colunas_existentes:
            continue
        tipo_sql = coluna.type.compile(dialect=engine.dialect)
        conn.execute(text(f'ALTER TABLE {tabela} ADD COLUMN IF NOT EXISTS "{coluna.name}" {tipo_sql}'))
        adicionadas.append(coluna.name)

if adicionadas:
    print(f"✅ {len(adicionadas)} coluna(s) adicionada(s) em '{tabela}':")
    for nome in adicionadas:
        print(f"   - {nome}")
else:
    print("Nenhuma coluna nova — tabela já está atualizada.")

print("Nenhum dado existente em classificacoes (ou em qualquer outra tabela) foi apagado ou alterado.")

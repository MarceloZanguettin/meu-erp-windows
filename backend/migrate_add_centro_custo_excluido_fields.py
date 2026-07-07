"""
Migração aditiva: cria/expande a tabela `centros_custo_excluidos` (modelo
CentroCustoExcluido — campos migrados da tabela DEL_CENTROCUSTO do GENUS),
sem apagar nada.

Diferente de migrate.py (que reseta o banco inteiro com drop_all/create_all),
este script só cria a tabela se ela ainda não existir (via create_all, que só
adiciona tabelas ausentes — nunca dropa ou altera tabelas já existentes) e,
se a tabela já existir, só roda ALTER TABLE ... ADD COLUMN IF NOT EXISTS para
colunas que ainda não existem. É seguro rodar quantas vezes for preciso —
nenhuma coluna ou linha existente é removida ou sobrescrita.

Execute com: python migrate_add_centro_custo_excluido_fields.py (dentro da pasta backend, com o venv ativo)
"""
import sys
import os
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import inspect, text
from database import engine, Base
import models.tabelas  # noqa: F401 - registra os models no metadata
from models.tabelas import CentroCustoExcluido

inspector = inspect(engine)
tabela = CentroCustoExcluido.__tablename__

if tabela not in inspector.get_table_names():
    print(f"Tabela '{tabela}' ainda não existe no banco — criando agora via "
          f"create_all() (operação aditiva: cria apenas a tabela ausente, "
          f"nunca dropa ou altera nenhuma tabela já existente).")
    Base.metadata.create_all(bind=engine, tables=[CentroCustoExcluido.__table__])
    print(f"Tabela '{tabela}' criada com sucesso, com todas as colunas já incluídas.")
    sys.exit(0)

colunas_existentes = {c["name"] for c in inspector.get_columns(tabela)}

adicionadas = []
with engine.begin() as conn:
    for coluna in CentroCustoExcluido.__table__.columns:
        if coluna.name in colunas_existentes:
            continue
        tipo_sql = coluna.type.compile(dialect=engine.dialect)
        conn.execute(text(f'ALTER TABLE {tabela} ADD COLUMN IF NOT EXISTS "{coluna.name}" {tipo_sql}'))
        adicionadas.append(coluna.name)

if adicionadas:
    print(f"{len(adicionadas)} coluna(s) adicionada(s) em '{tabela}':")
    for nome in adicionadas:
        print(f"   - {nome}")
else:
    print("Nenhuma coluna nova — tabela já está atualizada.")

print(f"Nenhum dado existente em {tabela} (ou em qualquer outra tabela) foi apagado ou alterado.")

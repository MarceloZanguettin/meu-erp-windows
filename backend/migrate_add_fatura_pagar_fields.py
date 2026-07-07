"""
Migração aditiva: cria/expande a tabela `faturas_pagar` com as colunas do
modelo FaturaPagar (campos migrados da tabela FATURAPAGAR do GENUS), sem
apagar nada.

Diferente de migrate.py (que reseta o banco inteiro com drop_all/create_all),
este script só cria a tabela se ela ainda não existir (via create_all, que só
adiciona tabelas ausentes — nunca dropa ou altera tabelas já existentes) e,
se a tabela já existir, só roda ALTER TABLE ... ADD COLUMN IF NOT EXISTS para
colunas que ainda não existem. É seguro rodar quantas vezes for preciso —
nenhuma coluna ou linha existente é removida ou sobrescrita.

Este script também garante a coluna `fatura_pagar_id` (nova FK adicionada em
`faturas_nota_pagar`, resolvendo FaturaNotaPagar.cod_fatura_pagar contra esta
tabela), da mesma forma aditiva.

Execute com: python migrate_add_fatura_pagar_fields.py (dentro da pasta
backend, com o venv ativo)
"""
import sys
import os
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import inspect, text
from database import engine, Base
import models.tabelas  # noqa: F401 - registra os models no metadata
from models.tabelas import FaturaPagar, FaturaNotaPagar

inspector = inspect(engine)


def migrar_tabela(model):
    """Cria a tabela do model se ela não existir, ou adiciona (aditivamente)
    as colunas do model que ainda não existirem numa tabela já existente."""
    tabela = model.__tablename__

    if tabela not in inspector.get_table_names():
        print(f"Tabela '{tabela}' ainda não existe no banco — criando agora via "
              f"create_all() (operação aditiva: cria apenas a tabela ausente, "
              f"nunca dropa ou altera nenhuma tabela já existente).")
        Base.metadata.create_all(bind=engine, tables=[model.__table__])
        print(f"Tabela '{tabela}' criada com sucesso, com todas as colunas já incluídas.")
        return

    colunas_existentes = {c["name"] for c in inspector.get_columns(tabela)}

    adicionadas = []
    with engine.begin() as conn:
        for coluna in model.__table__.columns:
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
        print(f"Nenhuma coluna nova em '{tabela}' — já está atualizada.")


migrar_tabela(FaturaPagar)
migrar_tabela(FaturaNotaPagar)

print("Nenhum dado existente em faturas_pagar, faturas_nota_pagar (ou em "
      "qualquer outra tabela) foi apagado ou alterado.")

"""
Migração aditiva: cria/expande a tabela `cadastros_contato` com as colunas do
modelo CadastroContato (campos migrados da tabela CADASTROCONTATO do GENUS),
sem apagar nada.

Diferente de migrate.py (que reseta o banco inteiro com drop_all/create_all),
este script só faz duas coisas, ambas aditivas e seguras de repetir:

1. Se a tabela `cadastros_contato` ainda não existir, cria SOMENTE essa
   tabela via `Base.metadata.create_all(bind=engine, tables=[...])` — o
   mesmo mecanismo não-destrutivo que `main.py` já usa no startup
   (`tabelas.Base.metadata.create_all(bind=engine)`), só que restrito a esta
   única tabela nova, para não depender de subir o app inteiro. Isso nunca
   toca nenhuma tabela/linha já existente.
2. Roda ALTER TABLE ... ADD COLUMN IF NOT EXISTS para qualquer coluna do
   modelo que ainda não exista na tabela (útil se este script for rodado de
   novo no futuro após novos campos serem adicionados ao model).

É seguro rodar quantas vezes for preciso — nenhuma coluna ou linha existente
é removida ou sobrescrita.

Execute com: python migrate_add_cadastro_contato_fields.py (dentro da pasta backend, com o venv ativo)
"""
import sys
import os
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import inspect, text
from database import engine, Base
import models.tabelas  # noqa: F401 - registra os models no metadata
from models.tabelas import CadastroContato

inspector = inspect(engine)
tabela = CadastroContato.__tablename__

if tabela not in inspector.get_table_names():
    print(f"Tabela '{tabela}' ainda não existe — criando apenas esta tabela "
          f"(CREATE TABLE IF NOT EXISTS, via Base.metadata.create_all restrito "
          f"a este único model). Nenhuma outra tabela é tocada.")
    Base.metadata.create_all(bind=engine, tables=[CadastroContato.__table__])
    inspector = inspect(engine)  # reinspeciona após criar

colunas_existentes = {c["name"] for c in inspector.get_columns(tabela)}

adicionadas = []
with engine.begin() as conn:
    for coluna in CadastroContato.__table__.columns:
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

print("Nenhum dado existente em cadastros_contato (ou em qualquer outra tabela) foi apagado ou alterado.")

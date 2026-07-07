"""
Migração aditiva: cria a tabela `cotacoes_preco` (modelo CotacaoPreco — campos
migrados da tabela COTACAOPRECO do GENUS, cabeçalho da cotação de preço/RFQ,
pai de COTACAOITENS/COTACAOPRODUTO) e acrescenta retroativamente a coluna
`cotacao_preco_id` (FK própria) em `cotacao_itens`/`cotacao_produtos`
(models CotacaoItens/CotacaoProduto), sem apagar nada.

Diferente de migrate.py (que reseta o banco inteiro com drop_all/create_all),
este script só cria a tabela `cotacoes_preco` se ela ainda não existir (via
create_all, que só adiciona tabelas ausentes — nunca dropa ou altera tabelas
já existentes) e, para cada tabela já existente (cotacoes_preco, cotacao_itens,
cotacao_produtos), só roda ALTER TABLE ... ADD COLUMN IF NOT EXISTS para
colunas que ainda não existem. É seguro rodar quantas vezes for preciso —
nenhuma coluna ou linha existente é removida ou sobrescrita.

Execute com: python migrate_add_cotacao_preco_fields.py (dentro da pasta backend, com o venv ativo)
"""
import sys
import os
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import inspect, text
from database import engine, Base
import models.tabelas  # noqa: F401 - registra os models no metadata
from models.tabelas import CotacaoPreco, CotacaoItens, CotacaoProduto

inspector = inspect(engine)

# 1) Cria a tabela nova (cotacoes_preco), se ainda não existir.
tabela_nova = CotacaoPreco.__tablename__
if tabela_nova not in inspector.get_table_names():
    print(f"Tabela '{tabela_nova}' ainda não existe no banco — criando agora via "
          f"create_all() (operação aditiva: cria apenas a tabela ausente, "
          f"nunca dropa ou altera nenhuma tabela já existente).")
    Base.metadata.create_all(bind=engine, tables=[CotacaoPreco.__table__])
    print(f"✅ Tabela '{tabela_nova}' criada com sucesso, com todas as colunas já incluídas.")
    inspector = inspect(engine)  # atualiza cache de metadados após criar a tabela
else:
    print(f"Tabela '{tabela_nova}' já existe — verificando colunas ausentes.")

# 2) Para cada model (a nova CotacaoPreco + as duas já existentes que ganharam
#    a FK retroativa cotacao_preco_id), roda ADD COLUMN IF NOT EXISTS para
#    qualquer coluna do model que ainda não esteja na tabela.
for model in (CotacaoPreco, CotacaoItens, CotacaoProduto):
    tabela = model.__tablename__
    if tabela not in inspector.get_table_names():
        # Já tratado acima para CotacaoPreco; se algum outro model também não
        # existir (não deveria, pois cotacao_itens/cotacao_produtos já foram
        # criadas em migrações anteriores desta sessão), avisa e pula.
        print(f"⚠️  Tabela '{tabela}' não existe — pulando (esperado apenas para '{tabela_nova}' antes do passo 1).")
        continue

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
        print(f"✅ {len(adicionadas)} coluna(s) adicionada(s) em '{tabela}':")
        for nome in adicionadas:
            print(f"   - {nome}")
    else:
        print(f"Nenhuma coluna nova em '{tabela}' — já está atualizada.")

print("Nenhum dado existente em cotacoes_preco, cotacao_itens, cotacao_produtos "
      "(ou em qualquer outra tabela) foi apagado ou alterado.")

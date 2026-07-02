"""
Migração: adiciona importado_excel às tabelas contas_pagar/contas_receber
         e cria a tabela saldos_diarios_bancarios.
Execute uma vez: python migrate_excel.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from database import engine

MIGRATIONS = [
    # Adiciona coluna importado_excel em contas_pagar (ignora se já existe)
    """
    DO $$ BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name='contas_pagar' AND column_name='importado_excel'
        ) THEN
            ALTER TABLE contas_pagar ADD COLUMN importado_excel BOOLEAN NOT NULL DEFAULT FALSE;
        END IF;
    END $$;
    """,

    # Adiciona coluna importado_excel em contas_receber
    """
    DO $$ BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name='contas_receber' AND column_name='importado_excel'
        ) THEN
            ALTER TABLE contas_receber ADD COLUMN importado_excel BOOLEAN NOT NULL DEFAULT FALSE;
        END IF;
    END $$;
    """,

    # Cria tabela saldos_diarios_bancarios
    """
    CREATE TABLE IF NOT EXISTS saldos_diarios_bancarios (
        id                SERIAL PRIMARY KEY,
        conta_bancaria_id INTEGER NOT NULL REFERENCES contas_bancarias(id),
        data              TIMESTAMP NOT NULL,
        saldo             FLOAT NOT NULL,
        coluna_excel      VARCHAR(5)
    );
    """,

    # Índice para buscas por data
    """
    CREATE INDEX IF NOT EXISTS ix_saldos_diarios_bancarios_data
        ON saldos_diarios_bancarios (data);
    """,

    # Índice único para evitar duplicatas (conta + data)
    """
    CREATE UNIQUE INDEX IF NOT EXISTS uix_saldos_diarios_conta_data
        ON saldos_diarios_bancarios (conta_bancaria_id, data);
    """,
]

def run():
    with engine.connect() as conn:
        for sql in MIGRATIONS:
            conn.execute(text(sql.strip()))
        conn.commit()
    print("Migração concluída com sucesso.")

if __name__ == "__main__":
    run()

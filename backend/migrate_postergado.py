"""
Migração: adiciona coluna 'postergado' em contas_pagar e contas_receber.
Execute uma vez: python migrate_postergado.py
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

sqls = [
    "ALTER TABLE contas_pagar   ADD COLUMN IF NOT EXISTS postergado BOOLEAN DEFAULT FALSE",
    "ALTER TABLE contas_receber ADD COLUMN IF NOT EXISTS postergado BOOLEAN DEFAULT FALSE",
]

with engine.connect() as conn:
    for sql in sqls:
        conn.execute(text(sql))
        print(f"OK: {sql}")
    conn.commit()

print("Migração concluída.")

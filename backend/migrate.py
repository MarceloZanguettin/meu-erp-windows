"""
Reset do banco: apaga todas as tabelas e as recria do zero.
Execute com: python migrate.py (dentro da pasta backend, com o venv ativo)
"""
import sys
import os
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.dirname(__file__))

from database import engine, Base

# Importa todos os models para registrá-los no metadata
import models.tabelas  # noqa: F401

print("🗑️  Apagando todas as tabelas...")
Base.metadata.drop_all(bind=engine)

print("🔨 Recriando todas as tabelas...")
Base.metadata.create_all(bind=engine)

print("✅ Banco resetado com sucesso.")

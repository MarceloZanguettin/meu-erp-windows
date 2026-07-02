"""
Script de inicialização do ERP.
Execute com: python start.py
"""
import subprocess
import sys
from pathlib import Path

ROOT_DIR     = Path(__file__).parent.resolve()
FRONTEND_DIR = ROOT_DIR / "frontend"
BACKEND_DIR  = ROOT_DIR / "backend"
PYTHON       = str(ROOT_DIR / "venv" / "Scripts" / "python.exe")

# ── Cores ANSI ────────────────────────────────────────────────────────────────
GREEN  = "\033[0;32m"
YELLOW = "\033[1;33m"
RED    = "\033[0;31m"
NC     = "\033[0m"

def log(cor, msg):
    print(f"{cor}{msg}{NC}", flush=True)

def executar(descricao, args, cwd, parar_em_erro=True):
    log(YELLOW, f"\n{descricao}")
    resultado = subprocess.run(args, cwd=cwd, shell=True)
    if resultado.returncode != 0 and parar_em_erro:
        log(RED, f"Erro em: {descricao}. Abortando.")
        sys.exit(1)
    return resultado

# ─────────────────────────────────────────────────────────────────────────────

log(GREEN, "======================================")
log(GREEN, "   Iniciando ERP em Python            ")
log(GREEN, "======================================")

# ── 1. npm run build ──────────────────────────────────────────────────────────
executar("[1/3] Gerando build de produção do frontend...", "npm run build", cwd=FRONTEND_DIR)
log(GREEN, "Build concluído.")

# ── 2. npm run dev (background) ───────────────────────────────────────────────
log(YELLOW, "\n[2/3] Iniciando servidor de desenvolvimento (background)...")
dev_proc = subprocess.Popen("npm run dev", cwd=FRONTEND_DIR, shell=True)
log(GREEN, f"Dev server iniciado (PID: {dev_proc.pid}) em http://localhost:5173")

try:
    # ── 3. python main.py ─────────────────────────────────────────────────────
    log(YELLOW, "\n[3/3] Iniciando o backend (python main.py)...")
    log(GREEN, "======================================")
    subprocess.run(f'"{PYTHON}" main.py', cwd=BACKEND_DIR, shell=True)

finally:
    # ── Encerra o dev server ao sair ─────────────────────────────────────────
    log(YELLOW, f"\nBackend encerrado. Parando dev server (PID: {dev_proc.pid})...")
    dev_proc.terminate()
    log(GREEN, "Tudo encerrado.")

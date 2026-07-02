"""
Utilitários de segurança:
  - Hash de senha com bcrypt (passlib)
  - Geração e verificação de JWT (python-jose)
  - Proteção contra força bruta (in-memory, por IP)

Variáveis obrigatórias no .env:
  SECRET_KEY   — string aleatória longa (mínimo 32 chars)
  ACCESS_TOKEN_EXPIRE_MINUTES — padrão 480 (8h)
"""
import os
import time
from collections import defaultdict
from datetime import datetime, timezone, timedelta

from passlib.context import CryptContext
from jose import jwt, JWTError
from dotenv import load_dotenv

load_dotenv()

# ── Configuração ──────────────────────────────────────────────────────────────

SECRET_KEY = os.getenv("SECRET_KEY", "TROCAR-EM-PRODUCAO-use-openssl-rand-hex-32")
ALGORITHM  = "HS256"
TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))

# ── Hash de senha ─────────────────────────────────────────────────────────────

_pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_senha(senha_plana: str) -> str:
    """Retorna o hash bcrypt da senha. Usar ao cadastrar/alterar senha."""
    return _pwd_ctx.hash(senha_plana)

def verificar_senha(senha_plana: str, hash_armazenado: str) -> bool:
    """Compara senha digitada com hash do banco. Retorna True se bater."""
    return _pwd_ctx.verify(senha_plana, hash_armazenado)

# ── JWT ───────────────────────────────────────────────────────────────────────

def criar_token(payload: dict) -> str:
    """Gera JWT assinado com expiração configurável."""
    dados = payload.copy()
    expira = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    dados["exp"] = expira
    return jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)

def decodificar_token(token: str) -> dict:
    """
    Decodifica e valida JWT. Lança JWTError se inválido ou expirado.
    Use em rotas protegidas:
        payload = decodificar_token(token)
        username = payload.get("sub")
    """
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

# ── Proteção contra força bruta (in-memory) ───────────────────────────────────
# Para produção com múltiplos workers, migrar para Redis.

_tentativas: dict[str, list[float]] = defaultdict(list)

MAX_TENTATIVAS   = 5      # tentativas permitidas
JANELA_SEGUNDOS  = 300    # dentro de 5 minutos
BLOQUEIO_SEGUNDOS = 900   # bloqueio de 15 minutos após exceder

def registrar_falha(ip: str) -> None:
    agora = time.time()
    _tentativas[ip] = [t for t in _tentativas[ip] if agora - t < JANELA_SEGUNDOS]
    _tentativas[ip].append(agora)

def esta_bloqueado(ip: str) -> bool:
    agora = time.time()
    recentes = [t for t in _tentativas[ip] if agora - t < BLOQUEIO_SEGUNDOS]
    _tentativas[ip] = recentes
    return len(recentes) >= MAX_TENTATIVAS

def limpar_tentativas(ip: str) -> None:
    _tentativas.pop(ip, None)

import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from database import get_db
from models import tabelas
from schemas.auth import LoginRequest, TokenResponse
from core.security import (
    verificar_senha,
    hash_senha,
    criar_token,
    registrar_falha,
    esta_bloqueado,
    limpar_tentativas,
)

logger = logging.getLogger("erp.auth")
router = APIRouter(prefix="/api", tags=["Autenticação"])

# Hash do admin padrão calculado na primeira requisição (lazy) para não travar a importação
_ADMIN_HASH: str | None = None

def _get_admin_hash() -> str:
    global _ADMIN_HASH
    if _ADMIN_HASH is None:
        _ADMIN_HASH = hash_senha("admin")
    return _ADMIN_HASH


def _ip(request: Request) -> str:
    """Extrai IP real considerando proxies."""
    forwarded = request.headers.get("X-Forwarded-For")
    return forwarded.split(",")[0].strip() if forwarded else (request.client.host or "unknown")


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    ip = _ip(request)

    # 1. Verificar bloqueio por força bruta
    if esta_bloqueado(ip):
        logger.warning("Login bloqueado para IP %s (muitas tentativas)", ip)
        raise HTTPException(
            status_code=429,
            detail="Muitas tentativas. Aguarde 15 minutos antes de tentar novamente.",
        )

    # 2. Buscar usuário no banco
    usuario = db.query(tabelas.Usuario).filter(
        tabelas.Usuario.username == req.username
    ).first()

    # 3. Fallback admin padrão (primeiro acesso — banco vazio)
    #    Usa hash para não comparar plain text nem mesmo aqui.
    if not usuario:
        if req.username == "admin" and verificar_senha(req.password, _get_admin_hash()):
            limpar_tentativas(ip)
            token = criar_token({"sub": "admin", "permissao": "admin"})
            logger.info("Login admin padrão (banco vazio) — IP: %s", ip)
            return TokenResponse(
                access_token=token,
                username="admin",
                permissao="admin",
                msg="Bem-vindo! Cadastre um usuário administrador assim que possível.",
            )
        registrar_falha(ip)
        raise HTTPException(status_code=401, detail="Usuário ou senha inválidos.")

    # 4. Verificar senha com bcrypt
    #    Senhas antigas (plain text) ainda funcionam; migram para hash no primeiro uso.
    senha_valida = False
    if usuario.password.startswith("$2"):
        # Já é hash bcrypt
        senha_valida = verificar_senha(req.password, usuario.password)
    else:
        # Legado: plain text — valida e migra automaticamente para hash
        if usuario.password == req.password:
            senha_valida = True
            usuario.password = hash_senha(req.password)
            db.commit()
            logger.info("Senha do usuário '%s' migrada para bcrypt.", usuario.username)

    if not senha_valida:
        registrar_falha(ip)
        logger.warning("Senha inválida para '%s' — IP: %s", req.username, ip)
        raise HTTPException(status_code=401, detail="Usuário ou senha inválidos.")

    # 5. Login bem-sucedido
    limpar_tentativas(ip)
    token = criar_token({"sub": usuario.username, "permissao": usuario.permissao})
    logger.info("Login OK: '%s' (%s) — IP: %s", usuario.username, usuario.permissao, ip)

    return TokenResponse(
        access_token=token,
        username=usuario.username,
        permissao=usuario.permissao,
        msg="Login efetuado com sucesso!",
    )


@router.get("/status", tags=["Sistema"])
def status():
    return {"status": "online", "versao": "1.0.0"}

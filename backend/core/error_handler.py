"""
Manipuladores de exceção globais — registrados em main.py via app.add_exception_handler().

Uso em main.py:
    from core.error_handler import register_exception_handlers
    register_exception_handlers(app)
"""
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError, OperationalError
from pydantic import ValidationError

from core.exceptions import ERPException

logger = logging.getLogger("erp")


def register_exception_handlers(app: FastAPI) -> None:

    @app.exception_handler(ERPException)
    async def erp_exception_handler(_req: Request, exc: ERPException) -> JSONResponse:
        logger.warning("ERPException [%s]: %s", exc.status_code, exc.detail)
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(IntegrityError)
    async def integrity_error_handler(_req: Request, exc: IntegrityError) -> JSONResponse:
        logger.error("IntegrityError: %s", exc.orig)
        mensagem = "Violação de integridade: registro duplicado ou referência inválida."
        if "unique" in str(exc.orig).lower():
            mensagem = "Já existe um registro com esses dados."
        if "foreign key" in str(exc.orig).lower():
            mensagem = "Referência a um registro inexistente."
        return JSONResponse(status_code=409, content={"detail": mensagem})

    @app.exception_handler(OperationalError)
    async def operational_error_handler(_req: Request, exc: OperationalError) -> JSONResponse:
        logger.critical("DB OperationalError: %s", exc)
        return JSONResponse(
            status_code=503,
            content={"detail": "Banco de dados indisponível. Tente novamente em instantes."},
        )

    @app.exception_handler(ValidationError)
    async def pydantic_validation_handler(_req: Request, exc: ValidationError) -> JSONResponse:
        erros = [
            {"campo": " → ".join(str(loc) for loc in e["loc"]), "mensagem": e["msg"]}
            for e in exc.errors()
        ]
        return JSONResponse(status_code=422, content={"detail": "Dados inválidos.", "erros": erros})

    @app.exception_handler(Exception)
    async def generic_handler(_req: Request, exc: Exception) -> JSONResponse:
        logger.exception("Erro não tratado: %s", exc)
        return JSONResponse(status_code=500, content={"detail": "Erro interno inesperado."})

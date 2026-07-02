"""
TEMPLATE — Controller FastAPI
================================
Responsabilidade ÚNICA: receber HTTP, delegar ao repositório/service, retornar resposta.

Regras:
  - NUNCA acessa `db` diretamente — injeta o repositório via Depends
  - NUNCA contém lógica de negócio (validações de domínio ficam no Service/Repository)
  - response_model garante que apenas os campos do Response schema sejam expostos
  - Usa tags para organizar o Swagger/OpenAPI

Injeção de Dependência:
  A função `get_repo` é uma factory que recebe `db` (já injetado pelo FastAPI)
  e retorna uma instância do repositório. Isso permite mockar o repositório em testes.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
# from _template.repositories.nome_modulo_repository import NomeModuloRepository
# from _template.schemas.nome_modulo_schema import (
#     NomeModuloCreate,
#     NomeModuloUpdate,
#     NomeModuloResponse,
# )

router = APIRouter(prefix="/nome-modulo", tags=["NomeModulo"])


# ─── Fábrica de dependência ───────────────────────────────────────────────────

def get_repo(db: Session = Depends(get_db)):  # -> NomeModuloRepository:
    """Injeta o repositório nas rotas. Trocar por NomeModuloRepository(db)."""
    # return NomeModuloRepository(db)
    raise NotImplementedError


# ─── Rotas ────────────────────────────────────────────────────────────────────

@router.get("/")  # , response_model=list[NomeModuloResponse])
def listar(
    busca: str | None = Query(default=None, description="Filtro por nome ou documento"),
    apenas_ativos: bool = Query(default=True),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    repo=Depends(get_repo),
):
    return repo.listar(busca=busca, apenas_ativos=apenas_ativos, skip=skip, limit=limit)


@router.get("/{item_id}")  # , response_model=NomeModuloResponse)
def obter(item_id: int, repo=Depends(get_repo)):
    return repo.obter_por_id(item_id)


@router.post("/", status_code=201)  # , response_model=NomeModuloResponse)
def criar(dados, repo=Depends(get_repo)):  # dados: NomeModuloCreate
    return repo.criar(dados)


@router.put("/{item_id}")  # , response_model=NomeModuloResponse)
def atualizar(item_id: int, dados, repo=Depends(get_repo)):  # dados: NomeModuloUpdate
    return repo.atualizar(item_id, dados)


@router.delete("/{item_id}", status_code=204)
def excluir(item_id: int, repo=Depends(get_repo)):
    repo.excluir(item_id)


# ─── Registro em main.py ─────────────────────────────────────────────────────
#
# from _template.controllers.nome_modulo_controller import router as nome_modulo_router
# app.include_router(nome_modulo_router)

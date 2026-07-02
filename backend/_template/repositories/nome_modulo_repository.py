"""
TEMPLATE — Repository Pattern
================================
Isola TODAS as chamadas ao banco de dados.
Controllers e Services NUNCA acessam `db` diretamente — só via repositório.

Regras:
  - Métodos async com SQLAlchemy (Session síncrona com run_in_executor se necessário)
  - Lança exceções de domínio (core.exceptions) — nunca HTTPException
  - Não contém lógica de negócio (isso é responsabilidade do Service)
  - Retorna objetos ORM ou None — nunca dicts crus
"""
from __future__ import annotations

from sqlalchemy.orm import Session
from sqlalchemy import or_

from core.exceptions import NaoEncontradoError, ConflitoDuplicidadeError
# from models.tabelas import NomeModulo          ← trocar pelo model real
# from _template.schemas.nome_modulo_schema import NomeModuloCreate, NomeModuloUpdate


class NomeModuloRepository:
    """Repositório para NomeModulo. Recebe a sessão por injeção."""

    def __init__(self, db: Session) -> None:
        self._db = db

    # ── READ ──────────────────────────────────────────────────────────────────

    def listar(
        self,
        busca: str | None = None,
        apenas_ativos: bool = True,
        skip: int = 0,
        limit: int = 100,
    ):  # -> list[NomeModulo]:
        """Retorna lista com filtro de busca e paginação."""
        # q = self._db.query(NomeModulo)
        # if apenas_ativos:
        #     q = q.filter(NomeModulo.ativo == True)
        # if busca:
        #     q = q.filter(
        #         or_(
        #             NomeModulo.nome.ilike(f"%{busca}%"),
        #             NomeModulo.documento.ilike(f"%{busca}%"),
        #         )
        #     )
        # return q.order_by(NomeModulo.nome).offset(skip).limit(limit).all()
        raise NotImplementedError

    def obter_por_id(self, item_id: int):  # -> NomeModulo:
        """Lança NaoEncontradoError se não existir."""
        # item = self._db.query(NomeModulo).filter(NomeModulo.id == item_id).first()
        # if not item:
        #     raise NaoEncontradoError(f"NomeModulo id={item_id} não encontrado.")
        # return item
        raise NotImplementedError

    def obter_por_documento(self, documento: str):  # -> NomeModulo | None:
        # return self._db.query(NomeModulo).filter(NomeModulo.documento == documento).first()
        raise NotImplementedError

    # ── CREATE ────────────────────────────────────────────────────────────────

    def criar(self, dados):  # dados: NomeModuloCreate) -> NomeModulo:
        """Cria registro. Lança ConflitoDuplicidadeError se documento já existir."""
        # existente = self.obter_por_documento(dados.documento)
        # if existente:
        #     raise ConflitoDuplicidadeError(f"Documento {dados.documento} já cadastrado.")
        #
        # item = NomeModulo(**dados.model_dump())
        # self._db.add(item)
        # self._db.commit()
        # self._db.refresh(item)
        # return item
        raise NotImplementedError

    # ── UPDATE ────────────────────────────────────────────────────────────────

    def atualizar(self, item_id: int, dados):  # dados: NomeModuloUpdate) -> NomeModulo:
        """Atualização parcial — só campos enviados (não-None) são alterados."""
        # item = self.obter_por_id(item_id)  # já lança 404 se não existir
        # campos = dados.model_dump(exclude_unset=True)  # ← só o que foi enviado
        # for campo, valor in campos.items():
        #     setattr(item, campo, valor)
        # self._db.commit()
        # self._db.refresh(item)
        # return item
        raise NotImplementedError

    # ── DELETE ────────────────────────────────────────────────────────────────

    def excluir(self, item_id: int) -> None:
        """Soft delete (ativo=False) ou hard delete — escolher por módulo."""
        # item = self.obter_por_id(item_id)
        # item.ativo = False          # soft delete
        # self._db.commit()
        #
        # OU para hard delete:
        # self._db.delete(item)
        # self._db.commit()
        raise NotImplementedError

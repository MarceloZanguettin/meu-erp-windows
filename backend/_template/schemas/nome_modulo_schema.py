"""
TEMPLATE — Schemas Pydantic V2
================================
Três camadas obrigatórias para cada módulo:

  NomeModuloCreate   → dados que chegam do frontend (POST/PUT)
  NomeModuloUpdate   → dados de atualização parcial (todos os campos Optional)
  NomeModuloResponse → dados que saem para o frontend (GET)

DECISÃO EMBEDDING vs REFERENCING (NoSQL / JSONB):
  - Embedding: use quando os dados filhos NUNCA existem sem o pai
    (ex: itens de pedido, endereços de um cliente)
  - Referencing: use quando os dados filhos têm ciclo de vida independente
    (ex: produto em um item de pedido — produto existe mesmo sem pedido)

Modelagem "document-first":
  Pense em qual JSON o frontend vai consumir e modele de trás pra frente.
  O schema de Response É o documento JSON canônico do recurso.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, field_validator, model_validator, ConfigDict


# ─── Schemas de endereço (Embedding — não existe fora do módulo pai) ──────────

class EnderecoSchema(BaseModel):
    cep: str = Field(..., pattern=r"^\d{5}-?\d{3}$", examples=["01310-100"])
    logradouro: str = Field(..., min_length=2, max_length=200)
    numero: str = Field(..., max_length=10)
    complemento: str | None = Field(default=None, max_length=100)
    bairro: str = Field(..., max_length=100)
    cidade: str = Field(..., max_length=100)
    uf: str = Field(..., min_length=2, max_length=2)

    @field_validator("uf")
    @classmethod
    def uf_maiusculo(cls, v: str) -> str:
        return v.upper()


# ─── Create ───────────────────────────────────────────────────────────────────

class NomeModuloCreate(BaseModel):
    nome: str = Field(..., min_length=2, max_length=150, examples=["Exemplo Ltda"])
    documento: str = Field(..., min_length=11, max_length=18, examples=["12.345.678/0001-90"])
    email: str | None = Field(default=None, examples=["contato@exemplo.com"])
    telefone: str | None = Field(default=None, max_length=20)
    ativo: bool = True

    # Dados embedded — array de objetos dentro do documento
    enderecos: list[EnderecoSchema] = Field(default_factory=list)

    # Dados extras livres (JSONB / JSON Column) — para características variáveis
    metadados: dict[str, Any] = Field(default_factory=dict)

    @field_validator("documento")
    @classmethod
    def limpar_documento(cls, v: str) -> str:
        return "".join(c for c in v if c.isdigit())

    @model_validator(mode="after")
    def validar_regras_negocio(self) -> NomeModuloCreate:
        if self.email and "@" not in self.email:
            raise ValueError("E-mail inválido.")
        return self


# ─── Update (todos Optional) ──────────────────────────────────────────────────

class NomeModuloUpdate(BaseModel):
    nome: str | None = Field(default=None, min_length=2, max_length=150)
    email: str | None = None
    telefone: str | None = None
    ativo: bool | None = None
    enderecos: list[EnderecoSchema] | None = None
    metadados: dict[str, Any] | None = None


# ─── Response (documento JSON canônico — o que o frontend consome) ────────────

class NomeModuloResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # permite orm_mode do SQLAlchemy

    id: int
    nome: str
    documento: str
    email: str | None
    telefone: str | None
    ativo: bool
    enderecos: list[EnderecoSchema]
    metadados: dict[str, Any]
    criado_em: datetime
    atualizado_em: datetime | None


# ─── Exemplo do documento JSON no banco (NoSQL / JSONB) ───────────────────────
#
# {
#   "id": 1,
#   "nome": "Exemplo Ltda",
#   "documento": "12345678000190",
#   "email": "contato@exemplo.com",
#   "telefone": "11999999999",
#   "ativo": true,
#   "enderecos": [                         ← EMBEDDED: sem ID próprio, morrem com o pai
#     {
#       "cep": "01310100",
#       "logradouro": "Av. Paulista",
#       "numero": "1000",
#       "complemento": "Sala 101",
#       "bairro": "Bela Vista",
#       "cidade": "São Paulo",
#       "uf": "SP"
#     }
#   ],
#   "metadados": {                         ← JSONB: campos livres sem schema fixo
#     "segmento": "varejo",
#     "tags": ["preferencial", "ativo"]
#   },
#   "criado_em": "2026-04-02T10:00:00",
#   "atualizado_em": "2026-04-02T12:00:00"
# }

from pydantic import BaseModel
from typing import Optional


class ContaGenusCreate(BaseModel):
    # ── Campos migrados de GENUS.CONTAS (todos opcionais) ──────────────────
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None
    descricao: Optional[str] = None
    banco: Optional[str] = None
    agencia: Optional[str] = None
    conta: Optional[str] = None
    cidade: Optional[str] = None
    titular: Optional[str] = None
    permissao: Optional[str] = None
    situacao: Optional[str] = None


class ContaGenusUpdate(ContaGenusCreate):
    pass


class ContaGenusOut(ContaGenusCreate):
    id: int

    class Config:
        from_attributes = True

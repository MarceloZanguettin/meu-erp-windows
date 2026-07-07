from pydantic import BaseModel
from typing import Optional


class FixoPagarCreate(BaseModel):
    # ── Campos migrados de GENUS.FIXOPAGAR (todos opcionais) ───────────────
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None
    cod_cadastro: Optional[int] = None
    cod_contas: Optional[int] = None
    inicio: Optional[str] = None
    termino: Optional[str] = None
    valor: Optional[float] = None
    dia: Optional[int] = None
    obs: Optional[str] = None
    qtde_parcela: Optional[int] = None
    cod_carteira: Optional[int] = None
    cod_historico: Optional[str] = None


class FixoPagarUpdate(FixoPagarCreate):
    pass


class FixoPagarOut(FixoPagarCreate):
    id: int

    class Config:
        from_attributes = True

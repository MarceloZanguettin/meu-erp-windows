from pydantic import BaseModel
from typing import Optional
import datetime


class MovtoCreate(BaseModel):
    # ── Campos migrados de GENUS.MOVTO (todos opcionais) ───────────────────
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None
    cod_cadastro: Optional[int] = None
    emissao: Optional[datetime.datetime] = None
    cod_funcionario: Optional[int] = None
    tipo: Optional[str] = None
    cod_saida: Optional[int] = None
    credito: Optional[float] = None
    obs: Optional[str] = None
    dt_credito: Optional[datetime.datetime] = None
    cod_alteracao: Optional[int] = None
    hora_alteracao_genus: Optional[str] = None
    data_alteracao_genus: Optional[datetime.datetime] = None
    cod_cadastro_credito: Optional[int] = None


class MovtoUpdate(MovtoCreate):
    pass


class MovtoOut(MovtoCreate):
    id: int

    class Config:
        from_attributes = True

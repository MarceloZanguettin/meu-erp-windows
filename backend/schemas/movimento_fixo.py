from pydantic import BaseModel
from typing import Optional


class MovimentoFixoCreate(BaseModel):
    # ── Campos migrados de GENUS.MOVTOFIXO (todos opcionais) ───────────────
    codigo: Optional[int] = None
    mes: Optional[str] = None
    ano: Optional[str] = None
    cod_fixo_pagar: Optional[int] = None
    cod_fixo_receber: Optional[int] = None


class MovimentoFixoUpdate(MovimentoFixoCreate):
    pass


class MovimentoFixoOut(MovimentoFixoCreate):
    id: int

    class Config:
        from_attributes = True

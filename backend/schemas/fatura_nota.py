from pydantic import BaseModel
from typing import Optional


class FaturaNotaCreate(BaseModel):
    # Vínculo com a saída/nota fiscal já migrada neste ERP
    saida_id: Optional[int] = None

    # Campos migrados de GENUS.FATURANOTA
    cod_empresa: Optional[int] = None
    cod_fatura: Optional[int] = None
    cod_saida: Optional[int] = None


class FaturaNotaUpdate(FaturaNotaCreate):
    pass


class FaturaNotaOut(FaturaNotaCreate):
    id: int

    class Config:
        from_attributes = True

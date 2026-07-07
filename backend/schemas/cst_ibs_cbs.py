from pydantic import BaseModel
from typing import Optional


class CstIbsCbsCreate(BaseModel):
    # Campos migrados de GENUS.CST_IBS_CBS
    cst: Optional[str] = None
    descricao: Optional[str] = None
    ind_gibscbs: Optional[int] = None
    ind_gred: Optional[int] = None
    ind_gdif: Optional[int] = None
    ind_gtransfcred: Optional[int] = None
    ind_gcredpresibszfm: Optional[int] = None
    ind_gajustecompet: Optional[int] = None
    ind_redutorbc: Optional[int] = None


class CstIbsCbsUpdate(BaseModel):
    cst: Optional[str] = None
    descricao: Optional[str] = None
    ind_gibscbs: Optional[int] = None
    ind_gred: Optional[int] = None
    ind_gdif: Optional[int] = None
    ind_gtransfcred: Optional[int] = None
    ind_gcredpresibszfm: Optional[int] = None
    ind_gajustecompet: Optional[int] = None
    ind_redutorbc: Optional[int] = None


class CstIbsCbsOut(CstIbsCbsCreate):
    id: int

    class Config:
        from_attributes = True

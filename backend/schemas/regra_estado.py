from pydantic import BaseModel
from typing import Optional


class RegraEstadoCreate(BaseModel):
    # Campos migrados de GENUS.REGRASESTADO
    cod_regras: Optional[int] = None
    cod_estado: Optional[str] = None
    cst: Optional[str] = None
    cod_cfop: Optional[str] = None
    aliquota_icms: Optional[str] = None
    icms_st: Optional[float] = None
    reducao_icms: Optional[float] = None
    reducao_icms_st: Optional[float] = None
    ipi_cst: Optional[str] = None
    ipi: Optional[float] = None
    pis_cst: Optional[str] = None
    pis_aliquota: Optional[float] = None
    cofins_cst: Optional[str] = None
    cofins_aliquota: Optional[float] = None
    cod_decreto: Optional[int] = None
    desconto_iva: Optional[float] = None
    csosn: Optional[str] = None
    cenq: Optional[str] = None
    fcp: Optional[float] = None
    cod_cbenef: Optional[int] = None


class RegraEstadoUpdate(BaseModel):
    cod_regras: Optional[int] = None
    cod_estado: Optional[str] = None
    cst: Optional[str] = None
    cod_cfop: Optional[str] = None
    aliquota_icms: Optional[str] = None
    icms_st: Optional[float] = None
    reducao_icms: Optional[float] = None
    reducao_icms_st: Optional[float] = None
    ipi_cst: Optional[str] = None
    ipi: Optional[float] = None
    pis_cst: Optional[str] = None
    pis_aliquota: Optional[float] = None
    cofins_cst: Optional[str] = None
    cofins_aliquota: Optional[float] = None
    cod_decreto: Optional[int] = None
    desconto_iva: Optional[float] = None
    csosn: Optional[str] = None
    cenq: Optional[str] = None
    fcp: Optional[float] = None
    cod_cbenef: Optional[int] = None


class RegraEstadoOut(RegraEstadoCreate):
    id: int

    class Config:
        from_attributes = True

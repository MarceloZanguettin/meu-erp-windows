from pydantic import BaseModel
from typing import Optional


class PadraoConsultaCreate(BaseModel):
    # Campos migrados de GENUS.PADRAOCONSULTA
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None
    tipo_consulta: Optional[str] = None
    checkbox: Optional[str] = None
    ordem: Optional[str] = None
    cod_funcionario: Optional[int] = None
    coluna: Optional[str] = None


class PadraoConsultaUpdate(BaseModel):
    codigo: Optional[int] = None
    cod_empresa: Optional[int] = None
    tipo_consulta: Optional[str] = None
    checkbox: Optional[str] = None
    ordem: Optional[str] = None
    cod_funcionario: Optional[int] = None
    coluna: Optional[str] = None


class PadraoConsultaOut(PadraoConsultaCreate):
    id: int

    class Config:
        from_attributes = True

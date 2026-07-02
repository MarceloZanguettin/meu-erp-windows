from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EmpresaOut(BaseModel):
    id: int
    nome: str

    class Config:
        from_attributes = True


class ContaBancariaOut(BaseModel):
    id: int
    empresa_id: int
    banco: str
    numero_conta: Optional[str]

    class Config:
        from_attributes = True


class ContaBancariaCreate(BaseModel):
    empresa_id: int
    banco: str
    numero_conta: Optional[str] = None


class ContaPagarCreate(BaseModel):
    empresa_id: int
    conta_bancaria_id: Optional[int] = None
    descricao: str
    valor: float
    data_vencimento: datetime
    observacao: Optional[str] = None


class ContaPagarUpdate(BaseModel):
    conta_bancaria_id: Optional[int] = None
    descricao: Optional[str] = None
    valor: Optional[float] = None
    data_vencimento: Optional[datetime] = None
    observacao: Optional[str] = None


class ContaPagarOut(BaseModel):
    id: int
    empresa_id: int
    conta_bancaria_id: Optional[int]
    descricao: str
    valor: float
    data_vencimento: datetime
    data_pagamento: Optional[datetime]
    status: str
    observacao: Optional[str]
    postergado: bool = False
    criado_em: Optional[datetime] = None
    importado_excel: bool = False

    class Config:
        from_attributes = True


class ContaReceberCreate(BaseModel):
    empresa_id: int
    conta_bancaria_id: Optional[int] = None
    descricao: str
    valor: float
    data_vencimento: datetime
    observacao: Optional[str] = None


class ContaReceberUpdate(BaseModel):
    conta_bancaria_id: Optional[int] = None
    descricao: Optional[str] = None
    valor: Optional[float] = None
    data_vencimento: Optional[datetime] = None
    observacao: Optional[str] = None


class ContaReceberOut(BaseModel):
    id: int
    empresa_id: int
    conta_bancaria_id: Optional[int]
    descricao: str
    valor: float
    data_vencimento: datetime
    data_recebimento: Optional[datetime]
    status: str
    observacao: Optional[str]
    postergado: bool = False
    criado_em: Optional[datetime] = None
    importado_excel: bool = False

    class Config:
        from_attributes = True


class SaldoDiarioOut(BaseModel):
    id: int
    conta_bancaria_id: int
    data: datetime
    saldo: float
    coluna_excel: Optional[str] = None

    class Config:
        from_attributes = True

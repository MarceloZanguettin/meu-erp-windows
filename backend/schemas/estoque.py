from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MovimentoCreate(BaseModel):
    produto_id: int
    deposito_id: Optional[int] = None
    tipo: str   # entrada | saida | ajuste
    quantidade: float
    custo_unitario: Optional[float] = None
    documento_ref: Optional[str] = None
    observacao: Optional[str] = None


class MovimentoOut(BaseModel):
    id: int
    produto_id: int
    deposito_id: Optional[int]
    tipo: str
    quantidade: float
    custo_unitario: Optional[float]
    documento_ref: Optional[str]
    observacao: Optional[str]
    data: datetime

    class Config:
        from_attributes = True


class PosicaoEstoqueOut(BaseModel):
    produto_id: int
    produto_nome: str
    deposito_id: Optional[int]
    deposito_nome: Optional[str]
    quantidade: float

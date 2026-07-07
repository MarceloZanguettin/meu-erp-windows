from pydantic import BaseModel
from typing import Optional


class PadraoCreate(BaseModel):
    # Campos migrados de GENUS.PADRAO (ver docstring do model `Padrao` em
    # models/tabelas.py)
    codigo: Optional[int] = None
    caixa: Optional[int] = None
    historico_receber: Optional[str] = None
    historico_pagar: Optional[str] = None
    historico_desconto: Optional[str] = None
    historico_acrescimo: Optional[str] = None
    historico_cartao: Optional[str] = None
    historico_depreciacao: Optional[str] = None
    historico_lancamento_credito: Optional[str] = None
    cod_conta_cartao_receber: Optional[int] = None
    historico_credito_partida_dobrada: Optional[str] = None
    historico_debito_partida_dobrada: Optional[str] = None
    historico_credito_cartao_desconto: Optional[str] = None
    historico_debito_cartao_desconto: Optional[str] = None
    historico_lancamento_credito_fornecedor: Optional[str] = None
    cod_conta_lancamento_credito_fornecedor: Optional[int] = None
    cod_conta_lancamento_credito: Optional[int] = None


class PadraoUpdate(BaseModel):
    codigo: Optional[int] = None
    caixa: Optional[int] = None
    historico_receber: Optional[str] = None
    historico_pagar: Optional[str] = None
    historico_desconto: Optional[str] = None
    historico_acrescimo: Optional[str] = None
    historico_cartao: Optional[str] = None
    historico_depreciacao: Optional[str] = None
    historico_lancamento_credito: Optional[str] = None
    cod_conta_cartao_receber: Optional[int] = None
    historico_credito_partida_dobrada: Optional[str] = None
    historico_debito_partida_dobrada: Optional[str] = None
    historico_credito_cartao_desconto: Optional[str] = None
    historico_debito_cartao_desconto: Optional[str] = None
    historico_lancamento_credito_fornecedor: Optional[str] = None
    cod_conta_lancamento_credito_fornecedor: Optional[int] = None
    cod_conta_lancamento_credito: Optional[int] = None


class PadraoOut(PadraoCreate):
    id: int

    class Config:
        from_attributes = True

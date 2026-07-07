from pydantic import BaseModel
from typing import Optional


class BcoSicredCreate(BaseModel):
    # ── Campos migrados de GENUS.BCOSICRED (todos opcionais) ────────────────
    codigo: Optional[int] = None
    agencia: Optional[str] = None
    conta: Optional[str] = None
    juros_mora: Optional[float] = None
    sequencia: Optional[int] = None
    aceite: Optional[str] = None
    dias_protesto: Optional[int] = None
    instrucao1: Optional[str] = None
    instrucao2: Optional[str] = None
    cod_carteira: Optional[int] = None
    cod_empresa: Optional[int] = None
    cod_cedente: Optional[int] = None
    especie: Optional[str] = None
    observacao: Optional[str] = None
    seq_remessa: Optional[int] = None
    carteira: Optional[str] = None
    convenio: Optional[str] = None
    cnab: Optional[str] = None
    emitir_boleto: Optional[str] = None
    posto: Optional[str] = None
    postar: Optional[str] = None
    tipo_juros: Optional[str] = None
    caminho: Optional[str] = None
    multa: Optional[float] = None
    numero: Optional[int] = None
    carteira_banco: Optional[int] = None


class BcoSicredUpdate(BcoSicredCreate):
    pass


class BcoSicredOut(BcoSicredCreate):
    id: int

    class Config:
        from_attributes = True

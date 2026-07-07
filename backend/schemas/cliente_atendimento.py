from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ClienteAtendimentoCreate(BaseModel):
    # Vínculo com o cliente já migrado neste ERP (resolvido de GENUS.CLIENTE via CADASTRO)
    cliente_id: Optional[int] = None

    # Campos migrados de GENUS.CLIENTEATENDIMENTO
    codigo: Optional[int] = None
    cod_cliente: Optional[int] = None
    cod_funcionario: Optional[int] = None
    data: Optional[datetime] = None
    hora: Optional[str] = None
    observacao: Optional[str] = None
    data_retorno: Optional[datetime] = None


class ClienteAtendimentoUpdate(ClienteAtendimentoCreate):
    pass


class ClienteAtendimentoOut(ClienteAtendimentoCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional


class ClienteCnaeCreate(BaseModel):
    # Vínculo com o cliente já migrado neste ERP (resolvido de GENUS.CLIENTE via CADASTRO)
    cliente_id: Optional[int] = None

    # Campos migrados de GENUS.CLIENTECNAE
    cod_cliente: Optional[int] = None
    cod_cnae: Optional[str] = None
    descricao: Optional[str] = None


class ClienteCnaeUpdate(ClienteCnaeCreate):
    pass


class ClienteCnaeOut(ClienteCnaeCreate):
    id: int

    class Config:
        from_attributes = True

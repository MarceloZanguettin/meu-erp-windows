from pydantic import BaseModel
from typing import Optional


class ClienteEmpresaCreate(BaseModel):
    # Vínculo com o cliente já migrado neste ERP
    cliente_id: Optional[int] = None

    # Campos migrados de GENUS.CLIENTEEMPRESA
    cod_cadastro: Optional[int] = None
    cod_empresa: Optional[int] = None


class ClienteEmpresaUpdate(ClienteEmpresaCreate):
    pass


class ClienteEmpresaOut(ClienteEmpresaCreate):
    id: int

    class Config:
        from_attributes = True

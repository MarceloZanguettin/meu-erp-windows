from pydantic import BaseModel
from typing import Optional


class ClienteAnexoCreate(BaseModel):
    # Vínculo com o cliente já migrado neste ERP (resolvido de GENUS.CLIENTE via CADASTRO)
    cliente_id: Optional[int] = None

    # Campos migrados de GENUS.CLIENTEANEXO
    codigo: Optional[int] = None
    cod_cliente: Optional[int] = None
    descricao: Optional[str] = None
    # BLOB binário (GENUS: ANEXO) representado aqui como string base64,
    # já que a API trafega JSON — a conversão para bytes/BYTEA acontece no
    # controller. Nenhum dado de anexo é importado por este agente.
    anexo: Optional[str] = None
    tipo: Optional[str] = None
    cod_orcamento: Optional[int] = None


class ClienteAnexoUpdate(BaseModel):
    cliente_id: Optional[int] = None
    codigo: Optional[int] = None
    cod_cliente: Optional[int] = None
    descricao: Optional[str] = None
    anexo: Optional[str] = None
    tipo: Optional[str] = None
    cod_orcamento: Optional[int] = None


class ClienteAnexoOut(BaseModel):
    id: int
    cliente_id: Optional[int] = None
    codigo: Optional[int] = None
    cod_cliente: Optional[int] = None
    descricao: Optional[str] = None
    anexo: Optional[str] = None
    tipo: Optional[str] = None
    cod_orcamento: Optional[int] = None

    class Config:
        from_attributes = True

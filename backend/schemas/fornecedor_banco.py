from pydantic import BaseModel
from typing import Optional


class FornecedorBancoCreate(BaseModel):
    # Vínculo com o fornecedor já cadastrado neste ERP (independente do GENUS,
    # preenchido pela própria aplicação — ver models.tabelas.FornecedorBanco)
    fornecedor_id: Optional[int] = None

    # Campos migrados de GENUS.FORNECEDORBANCO (todos opcionais — nenhum
    # dado é importado por este agente de estrutura, ver models.tabelas.FornecedorBanco)
    codigo: Optional[int] = None
    cod_fornecedor: Optional[int] = None
    banco: Optional[str] = None
    agencia: Optional[str] = None
    conta: Optional[str] = None
    titular: Optional[str] = None


class FornecedorBancoUpdate(FornecedorBancoCreate):
    pass


class FornecedorBancoOut(FornecedorBancoCreate):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CadastroContatoCreate(BaseModel):
    # Vínculo com o cadastro mestre já migrado (GENUS.CADASTRO)
    cadastro_pessoa_id: Optional[int] = None

    # Campos migrados de GENUS.CADASTROCONTATO
    codigo: Optional[int] = None
    cod_cadastro: Optional[int] = None
    email: Optional[str] = None
    email_nfe: Optional[str] = None
    fone: Optional[str] = None
    fone2: Optional[str] = None
    celular: Optional[str] = None
    celular2: Optional[str] = None
    observacao: Optional[str] = None
    cod_setor: Optional[int] = None
    conjuge: Optional[str] = None
    data_nascimento_conjuge: Optional[datetime] = None
    data_casamento: Optional[datetime] = None
    contato: Optional[str] = None


class CadastroContatoUpdate(BaseModel):
    cadastro_pessoa_id: Optional[int] = None

    codigo: Optional[int] = None
    cod_cadastro: Optional[int] = None
    email: Optional[str] = None
    email_nfe: Optional[str] = None
    fone: Optional[str] = None
    fone2: Optional[str] = None
    celular: Optional[str] = None
    celular2: Optional[str] = None
    observacao: Optional[str] = None
    cod_setor: Optional[int] = None
    conjuge: Optional[str] = None
    data_nascimento_conjuge: Optional[datetime] = None
    data_casamento: Optional[datetime] = None
    contato: Optional[str] = None


class CadastroContatoOut(CadastroContatoCreate):
    id: int

    class Config:
        from_attributes = True

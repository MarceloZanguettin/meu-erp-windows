from pydantic import BaseModel
from typing import Optional


class UsuarioCreate(BaseModel):
    username: str
    password: str
    permissao: Optional[str] = "user"
    perfil_acesso_id: Optional[int] = None


class UsuarioUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    permissao: Optional[str] = None
    perfil_acesso_id: Optional[int] = None


class UsuarioOut(BaseModel):
    id: int
    username: str
    permissao: str

    class Config:
        from_attributes = True

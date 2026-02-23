from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import tabelas

router = APIRouter(prefix="/api", tags=["Autenticação"])

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(tabelas.Usuario).filter(tabelas.Usuario.username == req.username).first()
    
    if not usuario:
        # Facilitador: admin/admin padrão
        if req.username == "admin" and req.password == "admin":
            return {"msg": "Bem-vindo Admin padrão!", "permissao": "admin", "username": "admin"}
        
        raise HTTPException(status_code=401, detail="Usuário não existe no sistema.")
    
    if usuario.password != req.password:
        raise HTTPException(status_code=401, detail="Senha incorreta.")
    
    return {"msg": "Login efetuado com sucesso!", "permissao": usuario.permissao, "username": usuario.username}
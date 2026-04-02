from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Usuario, PerfilAcesso
from schemas import usuarios, cadastro

router = APIRouter(prefix="/usuarios", tags=["Usuários"])


def _get_ou_404(db: Session, model, id: int):
    obj = db.query(model).filter(model.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    return obj


# ── Usuários ──────────────────────────────────────────────────────────────────

@router.get("/", response_model=list[usuarios.UsuarioOut])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).order_by(Usuario.username).all()


@router.post("/", response_model=usuarios.UsuarioOut)
def criar_usuario(dados: usuarios.UsuarioCreate, db: Session = Depends(get_db)):
    existente = db.query(Usuario).filter(Usuario.username == dados.username).first()
    if existente:
        raise HTTPException(status_code=400, detail="Username já existe")

    # perfil_acesso_id não é coluna do model Usuario, ignora se vier
    dados_dict = dados.dict(exclude={"perfil_acesso_id"})
    obj = Usuario(**dados_dict)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=usuarios.UsuarioOut)
def atualizar_usuario(id: int, dados: usuarios.UsuarioUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Usuario, id)

    dados_dict = dados.dict(exclude_none=True, exclude={"perfil_acesso_id"})
    # Se password não veio, não altera
    for campo, valor in dados_dict.items():
        setattr(obj, campo, valor)

    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_usuario(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Usuario, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Usuário deletado com sucesso"}


# ── Perfis de Acesso (via usuarios_controller) ────────────────────────────────

@router.get("/perfis", response_model=list[cadastro.PerfilAcessoOut])
def listar_perfis(db: Session = Depends(get_db)):
    return db.query(PerfilAcesso).order_by(PerfilAcesso.nome).all()


@router.post("/perfis", response_model=cadastro.PerfilAcessoOut)
def criar_perfil(dados: cadastro.PerfilAcessoCreate, db: Session = Depends(get_db)):
    obj = PerfilAcesso(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/perfis/{id}", response_model=cadastro.PerfilAcessoOut)
def atualizar_perfil(id: int, dados: cadastro.PerfilAcessoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, PerfilAcesso, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/perfis/{id}")
def deletar_perfil(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, PerfilAcesso, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Perfil deletado com sucesso"}

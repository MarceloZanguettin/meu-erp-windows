from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import CadastroContato
from schemas import cadastro_contato

# Contatos adicionais de um cadastro (GENUS.CADASTROCONTATO) — tabela filha
# de CADASTRO (já reconhecida neste ERP como CadastroPessoa), 1:N via
# cadastro_pessoa_id/cod_cadastro. Ver docstring do model CadastroContato.
router = APIRouter(prefix="/cadastro-contatos", tags=["Contatos de Cadastro (GENUS)"])


def _get_ou_404(db: Session, id: int) -> CadastroContato:
    obj = db.query(CadastroContato).filter(CadastroContato.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Contato de cadastro não encontrado")
    return obj


@router.get("", response_model=list[cadastro_contato.CadastroContatoOut])
def listar_cadastro_contatos(
    cadastro_pessoa_id: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(CadastroContato)
    if cadastro_pessoa_id:
        q = q.filter(CadastroContato.cadastro_pessoa_id == cadastro_pessoa_id)
    if busca:
        q = q.filter(
            (CadastroContato.contato.ilike(f"%{busca}%"))
            | (CadastroContato.email.ilike(f"%{busca}%"))
        )
    return q.order_by(CadastroContato.id).all()


@router.get("/{id}", response_model=cadastro_contato.CadastroContatoOut)
def buscar_cadastro_contato(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cadastro_contato.CadastroContatoOut)
def criar_cadastro_contato(dados: cadastro_contato.CadastroContatoCreate, db: Session = Depends(get_db)):
    obj = CadastroContato(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cadastro_contato.CadastroContatoOut)
def atualizar_cadastro_contato(id: int, dados: cadastro_contato.CadastroContatoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cadastro_contato(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Contato de cadastro deletado com sucesso"}

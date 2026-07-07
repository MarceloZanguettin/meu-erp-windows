from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import CadastroPessoa
from schemas import cadastro_pessoa

# Prefixo distinto de /cadastros (que hoje agrupa as "tabelas auxiliares" e as
# entidades comerciais como ClienteCompleto/Fornecedor). Este router expõe
# especificamente a estrutura da tabela mestre GENUS.CADASTRO.
router = APIRouter(prefix="/cadastro-pessoas", tags=["Cadastro Pessoa (GENUS)"])


def _get_ou_404(db: Session, id: int) -> CadastroPessoa:
    obj = db.query(CadastroPessoa).filter(CadastroPessoa.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Cadastro não encontrado")
    return obj


@router.get("", response_model=list[cadastro_pessoa.CadastroPessoaOut])
def listar_cadastro_pessoas(
    busca: Optional[str] = Query(None),
    situacao: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(CadastroPessoa)
    if busca:
        q = q.filter(
            CadastroPessoa.nome.ilike(f"%{busca}%")
            | CadastroPessoa.fantasia.ilike(f"%{busca}%")
            | CadastroPessoa.cpf_cnpj.ilike(f"%{busca}%")
        )
    if situacao:
        q = q.filter(CadastroPessoa.situacao == situacao)
    return q.order_by(CadastroPessoa.nome).all()


@router.get("/{id}", response_model=cadastro_pessoa.CadastroPessoaOut)
def buscar_cadastro_pessoa(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cadastro_pessoa.CadastroPessoaOut)
def criar_cadastro_pessoa(dados: cadastro_pessoa.CadastroPessoaCreate, db: Session = Depends(get_db)):
    if dados.codigo is not None:
        existente = db.query(CadastroPessoa).filter(CadastroPessoa.codigo == dados.codigo).first()
        if existente:
            raise HTTPException(status_code=409, detail="Já existe um cadastro com esse código")
    obj = CadastroPessoa(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cadastro_pessoa.CadastroPessoaOut)
def atualizar_cadastro_pessoa(id: int, dados: cadastro_pessoa.CadastroPessoaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cadastro_pessoa(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Cadastro deletado com sucesso"}

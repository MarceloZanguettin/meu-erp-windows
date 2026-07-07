from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import FornecedorBanco
from schemas import fornecedor_banco

router = APIRouter(prefix="/fornecedores-banco", tags=["Dados bancários de Fornecedor GENUS (Cadastros)"])


def _get_ou_404(db: Session, id: int) -> FornecedorBanco:
    obj = db.query(FornecedorBanco).filter(FornecedorBanco.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Dado bancário de fornecedor (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[fornecedor_banco.FornecedorBancoOut])
def listar_fornecedores_banco(
    fornecedor_id: Optional[int] = Query(None),
    cod_fornecedor: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(FornecedorBanco)
    if fornecedor_id:
        q = q.filter(FornecedorBanco.fornecedor_id == fornecedor_id)
    if cod_fornecedor:
        q = q.filter(FornecedorBanco.cod_fornecedor == cod_fornecedor)
    if busca:
        q = q.filter(
            (FornecedorBanco.banco.ilike(f"%{busca}%"))
            | (FornecedorBanco.agencia.ilike(f"%{busca}%"))
            | (FornecedorBanco.conta.ilike(f"%{busca}%"))
            | (FornecedorBanco.titular.ilike(f"%{busca}%"))
        )
    return q.order_by(FornecedorBanco.id.desc()).all()


@router.get("/{id}", response_model=fornecedor_banco.FornecedorBancoOut)
def buscar_fornecedor_banco(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=fornecedor_banco.FornecedorBancoOut)
def criar_fornecedor_banco(dados: fornecedor_banco.FornecedorBancoCreate, db: Session = Depends(get_db)):
    obj = FornecedorBanco(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=fornecedor_banco.FornecedorBancoOut)
def atualizar_fornecedor_banco(id: int, dados: fornecedor_banco.FornecedorBancoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_fornecedor_banco(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Dado bancário de fornecedor (GENUS) deletado com sucesso"}

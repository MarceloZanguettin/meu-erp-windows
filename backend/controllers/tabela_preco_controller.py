from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import TabelaPreco
from schemas import tabela_preco

router = APIRouter(prefix="/tabelas-preco", tags=["Tabelas de Preço"])


def _get_ou_404(db: Session, id: int) -> TabelaPreco:
    obj = db.query(TabelaPreco).filter(TabelaPreco.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Tabela de preço não encontrada")
    return obj


@router.get("", response_model=list[tabela_preco.TabelaPrecoOut])
def listar_tabelas_preco(
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(TabelaPreco)
    if cod_empresa is not None:
        q = q.filter(TabelaPreco.cod_empresa == cod_empresa)
    if busca:
        q = q.filter(
            (TabelaPreco.descricao.ilike(f"%{busca}%"))
            | (TabelaPreco.ativo.ilike(f"%{busca}%"))
        )
    return q.order_by(TabelaPreco.id).all()


@router.get("/{id}", response_model=tabela_preco.TabelaPrecoOut)
def buscar_tabela_preco(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=tabela_preco.TabelaPrecoOut)
def criar_tabela_preco(dados: tabela_preco.TabelaPrecoCreate, db: Session = Depends(get_db)):
    obj = TabelaPreco(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=tabela_preco.TabelaPrecoOut)
def atualizar_tabela_preco(id: int, dados: tabela_preco.TabelaPrecoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_tabela_preco(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Tabela de preço deletada com sucesso"}

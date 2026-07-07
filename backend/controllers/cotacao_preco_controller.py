from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import CotacaoPreco
from schemas import cotacao_preco

router = APIRouter(prefix="/cotacao-preco", tags=["Cotação de Preço - Cabeçalho (GENUS)"])


def _get_ou_404(db: Session, id: int) -> CotacaoPreco:
    obj = db.query(CotacaoPreco).filter(CotacaoPreco.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Cotação de preço não encontrada")
    return obj


@router.get("", response_model=list[cotacao_preco.CotacaoPrecoOut])
def listar_cotacoes_preco(
    cod_empresa: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(CotacaoPreco)
    if cod_empresa:
        q = q.filter(CotacaoPreco.cod_empresa == cod_empresa)
    if status:
        q = q.filter(CotacaoPreco.status == status)
    if busca:
        q = q.filter(CotacaoPreco.descricao.ilike(f"%{busca}%"))
    return q.order_by(CotacaoPreco.id.desc()).all()


@router.get("/{id}", response_model=cotacao_preco.CotacaoPrecoOut)
def buscar_cotacao_preco(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cotacao_preco.CotacaoPrecoOut)
def criar_cotacao_preco(dados: cotacao_preco.CotacaoPrecoCreate, db: Session = Depends(get_db)):
    obj = CotacaoPreco(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cotacao_preco.CotacaoPrecoOut)
def atualizar_cotacao_preco(id: int, dados: cotacao_preco.CotacaoPrecoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cotacao_preco(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Cotação de preço deletada com sucesso"}

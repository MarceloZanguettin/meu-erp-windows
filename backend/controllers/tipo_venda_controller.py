from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import TipoVenda
from schemas import tipo_venda

router = APIRouter(prefix="/tipos-venda", tags=["Tipos de Venda"])


def _get_ou_404(db: Session, id: int) -> TipoVenda:
    obj = db.query(TipoVenda).filter(TipoVenda.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Tipo de venda não encontrado")
    return obj


@router.get("", response_model=list[tipo_venda.TipoVendaOut])
def listar_tipos_venda(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(TipoVenda)
    if busca:
        condicoes = [TipoVenda.descricao.ilike(f"%{busca}%")]
        if busca.isdigit():
            condicoes.append(TipoVenda.codigo == int(busca))
        q = q.filter(or_(*condicoes))
    return q.order_by(TipoVenda.descricao, TipoVenda.id).all()


@router.get("/{id}", response_model=tipo_venda.TipoVendaOut)
def buscar_tipo_venda(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=tipo_venda.TipoVendaOut)
def criar_tipo_venda(dados: tipo_venda.TipoVendaCreate, db: Session = Depends(get_db)):
    obj = TipoVenda(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=tipo_venda.TipoVendaOut)
def atualizar_tipo_venda(id: int, dados: tipo_venda.TipoVendaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_tipo_venda(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Tipo de venda deletado com sucesso"}

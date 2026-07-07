from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Marca
from schemas import marca

router = APIRouter(prefix="/marcas", tags=["Marcas"])


def _get_ou_404(db: Session, id: int) -> Marca:
    obj = db.query(Marca).filter(Marca.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Marca não encontrada")
    return obj


@router.get("", response_model=list[marca.MarcaOut])
def listar_marcas(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Marca)
    if busca:
        condicoes = [Marca.descricao.ilike(f"%{busca}%")]
        if busca.isdigit():
            condicoes.append(Marca.codigo == int(busca))
        q = q.filter(or_(*condicoes))
    return q.order_by(Marca.descricao, Marca.id).all()


@router.get("/{id}", response_model=marca.MarcaOut)
def buscar_marca(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=marca.MarcaOut)
def criar_marca(dados: marca.MarcaCreate, db: Session = Depends(get_db)):
    obj = Marca(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=marca.MarcaOut)
def atualizar_marca(id: int, dados: marca.MarcaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_marca(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Marca deletada com sucesso"}

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Entrada
from schemas import entrada

router = APIRouter(prefix="/entradas", tags=["Entradas (Compras)"])


def _get_ou_404(db: Session, id: int) -> Entrada:
    obj = db.query(Entrada).filter(Entrada.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Entrada não encontrada")
    return obj


@router.get("", response_model=list[entrada.EntradaOut])
def listar_entradas(
    cod_empresa: Optional[int] = Query(None),
    cod_fornecedor: Optional[int] = Query(None),
    doc: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Entrada)
    if cod_empresa:
        q = q.filter(Entrada.cod_empresa == cod_empresa)
    if cod_fornecedor:
        q = q.filter(Entrada.cod_fornecedor == cod_fornecedor)
    if doc:
        q = q.filter(Entrada.doc == doc)
    if busca:
        q = q.filter(
            (Entrada.chave_nfe.ilike(f"%{busca}%"))
            | (Entrada.serie.ilike(f"%{busca}%"))
            | (Entrada.cod_cfop.ilike(f"%{busca}%"))
        )
    return q.order_by(Entrada.id.desc()).all()


@router.get("/{id}", response_model=entrada.EntradaOut)
def buscar_entrada(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=entrada.EntradaOut)
def criar_entrada(dados: entrada.EntradaCreate, db: Session = Depends(get_db)):
    obj = Entrada(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=entrada.EntradaOut)
def atualizar_entrada(id: int, dados: entrada.EntradaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_entrada(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Entrada deletada com sucesso"}

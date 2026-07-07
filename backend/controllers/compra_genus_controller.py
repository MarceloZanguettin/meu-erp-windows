from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import CompraGenus
from schemas import compra_genus

router = APIRouter(prefix="/compras-genus", tags=["Compras (GENUS)"])


def _get_ou_404(db: Session, id: int) -> CompraGenus:
    obj = db.query(CompraGenus).filter(CompraGenus.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Compra (GENUS) não encontrada")
    return obj


@router.get("", response_model=list[compra_genus.CompraGenusOut])
def listar_compras_genus(
    cod_empresa: Optional[int] = Query(None),
    cod_fornecedor: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(CompraGenus)
    if cod_empresa:
        q = q.filter(CompraGenus.cod_empresa == cod_empresa)
    if cod_fornecedor:
        q = q.filter(CompraGenus.cod_fornecedor == cod_fornecedor)
    if status:
        q = q.filter(CompraGenus.status == status)
    if busca:
        q = q.filter(
            (CompraGenus.status.ilike(f"%{busca}%"))
            | (CompraGenus.os.ilike(f"%{busca}%"))
            | (CompraGenus.conhecimento.ilike(f"%{busca}%"))
        )
    return q.order_by(CompraGenus.id.desc()).all()


@router.get("/{id}", response_model=compra_genus.CompraGenusOut)
def buscar_compra_genus(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=compra_genus.CompraGenusOut)
def criar_compra_genus(dados: compra_genus.CompraGenusCreate, db: Session = Depends(get_db)):
    obj = CompraGenus(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=compra_genus.CompraGenusOut)
def atualizar_compra_genus(id: int, dados: compra_genus.CompraGenusUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_compra_genus(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Compra (GENUS) deletada com sucesso"}

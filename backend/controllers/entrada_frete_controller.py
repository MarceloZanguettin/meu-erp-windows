from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import EntradaFrete
from schemas import entrada_frete

router = APIRouter(prefix="/entradas-frete", tags=["Fretes de Entrada (Compras)"])


def _get_ou_404(db: Session, id: int) -> EntradaFrete:
    obj = db.query(EntradaFrete).filter(EntradaFrete.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Frete de entrada não encontrado")
    return obj


@router.get("", response_model=list[entrada_frete.EntradaFreteOut])
def listar_entradas_frete(
    entrada_id: Optional[int] = Query(None),
    cod_fornecedor: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(EntradaFrete)
    if entrada_id:
        q = q.filter(EntradaFrete.entrada_id == entrada_id)
    if cod_fornecedor:
        q = q.filter(EntradaFrete.cod_fornecedor == cod_fornecedor)
    if cod_empresa:
        q = q.filter(EntradaFrete.cod_empresa == cod_empresa)
    if busca:
        q = q.filter(
            (EntradaFrete.serie.ilike(f"%{busca}%"))
            | (EntradaFrete.serie2.ilike(f"%{busca}%"))
            | (EntradaFrete.tipo_doc.ilike(f"%{busca}%"))
            | (EntradaFrete.tipo_doc2.ilike(f"%{busca}%"))
        )
    return q.order_by(EntradaFrete.id.desc()).all()


@router.get("/{id}", response_model=entrada_frete.EntradaFreteOut)
def buscar_entrada_frete(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=entrada_frete.EntradaFreteOut)
def criar_entrada_frete(dados: entrada_frete.EntradaFreteCreate, db: Session = Depends(get_db)):
    obj = EntradaFrete(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=entrada_frete.EntradaFreteOut)
def atualizar_entrada_frete(id: int, dados: entrada_frete.EntradaFreteUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_entrada_frete(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Frete de entrada deletado com sucesso"}

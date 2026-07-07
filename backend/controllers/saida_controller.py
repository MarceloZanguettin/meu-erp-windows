from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Saida
from schemas import saida

router = APIRouter(prefix="/saidas", tags=["Saídas (Vendas/Faturamento)"])


def _get_ou_404(db: Session, id: int) -> Saida:
    obj = db.query(Saida).filter(Saida.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Saída não encontrada")
    return obj


@router.get("", response_model=list[saida.SaidaOut])
def listar_saidas(
    cod_empresa: Optional[int] = Query(None),
    codigo: Optional[int] = Query(None),
    cod_cliente: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Saida)
    if cod_empresa:
        q = q.filter(Saida.cod_empresa == cod_empresa)
    if codigo:
        q = q.filter(Saida.codigo == codigo)
    if cod_cliente:
        q = q.filter(Saida.cod_cliente == cod_cliente)
    if busca:
        q = q.filter(
            (Saida.chave_nfe.ilike(f"%{busca}%"))
            | (Saida.serie.ilike(f"%{busca}%"))
            | (Saida.status_genus.ilike(f"%{busca}%"))
        )
    return q.order_by(Saida.id.desc()).all()


@router.get("/{id}", response_model=saida.SaidaOut)
def buscar_saida(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=saida.SaidaOut)
def criar_saida(dados: saida.SaidaCreate, db: Session = Depends(get_db)):
    obj = Saida(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=saida.SaidaOut)
def atualizar_saida(id: int, dados: saida.SaidaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_saida(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Saída deletada com sucesso"}

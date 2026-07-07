from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import RegraCliente
from schemas import regra_cliente

router = APIRouter(prefix="/regras-cliente", tags=["Regras de Cliente (GENUS: REGRASCLIENTE)"])


def _get_ou_404(db: Session, id: int) -> RegraCliente:
    obj = db.query(RegraCliente).filter(RegraCliente.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Regra de cliente não encontrada")
    return obj


@router.get("", response_model=list[regra_cliente.RegraClienteOut])
def listar_regras_cliente(
    produto_id: Optional[int] = Query(None),
    cod_cliente: Optional[int] = Query(None),
    cod_classificacao: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(RegraCliente)
    if produto_id:
        q = q.filter(RegraCliente.produto_id == produto_id)
    if cod_cliente:
        q = q.filter(RegraCliente.cod_cliente == cod_cliente)
    if cod_classificacao:
        q = q.filter(RegraCliente.cod_classificacao == cod_classificacao)
    if busca:
        q = q.filter(RegraCliente.cod_produto.ilike(f"%{busca}%"))
    return q.order_by(RegraCliente.id).all()


@router.get("/{id}", response_model=regra_cliente.RegraClienteOut)
def buscar_regra_cliente(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=regra_cliente.RegraClienteOut)
def criar_regra_cliente(dados: regra_cliente.RegraClienteCreate, db: Session = Depends(get_db)):
    obj = RegraCliente(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=regra_cliente.RegraClienteOut)
def atualizar_regra_cliente(id: int, dados: regra_cliente.RegraClienteUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_regra_cliente(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Regra de cliente deletada com sucesso"}

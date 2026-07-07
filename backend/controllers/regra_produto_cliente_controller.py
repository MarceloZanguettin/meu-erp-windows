from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import RegraProdutoCliente
from schemas import regra_produto_cliente

router = APIRouter(prefix="/regras-produto-cliente", tags=["Regras de Produto por Cliente"])


def _get_ou_404(db: Session, id: int) -> RegraProdutoCliente:
    obj = db.query(RegraProdutoCliente).filter(RegraProdutoCliente.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Regra de produto por cliente não encontrada")
    return obj


@router.get("", response_model=list[regra_produto_cliente.RegraProdutoClienteOut])
def listar_regras_produto_cliente(
    produto_id: Optional[int] = Query(None),
    cod_cliente: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(RegraProdutoCliente)
    if produto_id:
        q = q.filter(RegraProdutoCliente.produto_id == produto_id)
    if cod_cliente:
        q = q.filter(RegraProdutoCliente.cod_cliente == cod_cliente)
    if busca:
        q = q.filter(RegraProdutoCliente.cod_produto.ilike(f"%{busca}%"))
    return q.order_by(RegraProdutoCliente.id).all()


@router.get("/{id}", response_model=regra_produto_cliente.RegraProdutoClienteOut)
def buscar_regra_produto_cliente(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=regra_produto_cliente.RegraProdutoClienteOut)
def criar_regra_produto_cliente(dados: regra_produto_cliente.RegraProdutoClienteCreate, db: Session = Depends(get_db)):
    obj = RegraProdutoCliente(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=regra_produto_cliente.RegraProdutoClienteOut)
def atualizar_regra_produto_cliente(id: int, dados: regra_produto_cliente.RegraProdutoClienteUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_regra_produto_cliente(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Regra de produto por cliente deletada com sucesso"}

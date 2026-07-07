from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import SaidaCancelada
from schemas import saida_cancelada

router = APIRouter(prefix="/saidas-canceladas", tags=["Saídas Canceladas (Vendas/Faturamento)"])


def _get_ou_404(db: Session, id: int) -> SaidaCancelada:
    obj = db.query(SaidaCancelada).filter(SaidaCancelada.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Saída cancelada não encontrada")
    return obj


@router.get("", response_model=list[saida_cancelada.SaidaCanceladaOut])
def listar_saidas_canceladas(
    cod_empresa: Optional[int] = Query(None),
    codigo: Optional[int] = Query(None),
    cod_cliente: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(SaidaCancelada)
    if cod_empresa:
        q = q.filter(SaidaCancelada.cod_empresa == cod_empresa)
    if codigo:
        q = q.filter(SaidaCancelada.codigo == codigo)
    if cod_cliente:
        q = q.filter(SaidaCancelada.cod_cliente == cod_cliente)
    if busca:
        q = q.filter(
            (SaidaCancelada.chave_nfe.ilike(f"%{busca}%"))
            | (SaidaCancelada.serie.ilike(f"%{busca}%"))
            | (SaidaCancelada.cpf_cnpj.ilike(f"%{busca}%"))
        )
    return q.order_by(SaidaCancelada.id.desc()).all()


@router.get("/{id}", response_model=saida_cancelada.SaidaCanceladaOut)
def buscar_saida_cancelada(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=saida_cancelada.SaidaCanceladaOut)
def criar_saida_cancelada(dados: saida_cancelada.SaidaCanceladaCreate, db: Session = Depends(get_db)):
    obj = SaidaCancelada(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=saida_cancelada.SaidaCanceladaOut)
def atualizar_saida_cancelada(id: int, dados: saida_cancelada.SaidaCanceladaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_saida_cancelada(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Saída cancelada removida com sucesso"}

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ContaPagarExcluida
from schemas import conta_pagar_excluida

router = APIRouter(prefix="/contas-pagar-excluidas", tags=["Contas a Pagar Excluídas (Financeiro)"])


def _get_ou_404(db: Session, id: int) -> ContaPagarExcluida:
    obj = db.query(ContaPagarExcluida).filter(ContaPagarExcluida.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Conta a pagar excluída não encontrada")
    return obj


@router.get("", response_model=list[conta_pagar_excluida.ContaPagarExcluidaOut])
def listar_contas_pagar_excluidas(
    cod_empresa: Optional[int] = Query(None),
    codigo: Optional[int] = Query(None),
    cod_fornecedor: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ContaPagarExcluida)
    if cod_empresa:
        q = q.filter(ContaPagarExcluida.cod_empresa == cod_empresa)
    if codigo:
        q = q.filter(ContaPagarExcluida.codigo == codigo)
    if cod_fornecedor:
        q = q.filter(ContaPagarExcluida.cod_fornecedor == cod_fornecedor)
    if busca:
        q = q.filter(
            (ContaPagarExcluida.duplicata.ilike(f"%{busca}%"))
            | (ContaPagarExcluida.parcela.ilike(f"%{busca}%"))
            | (ContaPagarExcluida.cod_historico.ilike(f"%{busca}%"))
            | (ContaPagarExcluida.observacao.ilike(f"%{busca}%"))
        )
    return q.order_by(ContaPagarExcluida.id.desc()).all()


@router.get("/{id}", response_model=conta_pagar_excluida.ContaPagarExcluidaOut)
def buscar_conta_pagar_excluida(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=conta_pagar_excluida.ContaPagarExcluidaOut)
def criar_conta_pagar_excluida(dados: conta_pagar_excluida.ContaPagarExcluidaCreate, db: Session = Depends(get_db)):
    obj = ContaPagarExcluida(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=conta_pagar_excluida.ContaPagarExcluidaOut)
def atualizar_conta_pagar_excluida(id: int, dados: conta_pagar_excluida.ContaPagarExcluidaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_conta_pagar_excluida(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Conta a pagar excluída removida com sucesso"}

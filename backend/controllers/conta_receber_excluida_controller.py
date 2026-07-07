from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ContaReceberExcluida
from schemas import conta_receber_excluida

router = APIRouter(prefix="/contas-receber-excluidas", tags=["Contas a Receber Excluídas (Financeiro)"])


def _get_ou_404(db: Session, id: int) -> ContaReceberExcluida:
    obj = db.query(ContaReceberExcluida).filter(ContaReceberExcluida.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Conta a receber excluída não encontrada")
    return obj


@router.get("", response_model=list[conta_receber_excluida.ContaReceberExcluidaOut])
def listar_contas_receber_excluidas(
    cod_empresa: Optional[int] = Query(None),
    codigo: Optional[int] = Query(None),
    cod_cliente: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ContaReceberExcluida)
    if cod_empresa:
        q = q.filter(ContaReceberExcluida.cod_empresa == cod_empresa)
    if codigo:
        q = q.filter(ContaReceberExcluida.codigo == codigo)
    if cod_cliente:
        q = q.filter(ContaReceberExcluida.cod_cliente == cod_cliente)
    if busca:
        q = q.filter(
            (ContaReceberExcluida.nosso_numero.ilike(f"%{busca}%"))
            | (ContaReceberExcluida.parcela.ilike(f"%{busca}%"))
            | (ContaReceberExcluida.cod_historico.ilike(f"%{busca}%"))
            | (ContaReceberExcluida.observacao.ilike(f"%{busca}%"))
        )
    return q.order_by(ContaReceberExcluida.id.desc()).all()


@router.get("/{id}", response_model=conta_receber_excluida.ContaReceberExcluidaOut)
def buscar_conta_receber_excluida(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=conta_receber_excluida.ContaReceberExcluidaOut)
def criar_conta_receber_excluida(dados: conta_receber_excluida.ContaReceberExcluidaCreate, db: Session = Depends(get_db)):
    obj = ContaReceberExcluida(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=conta_receber_excluida.ContaReceberExcluidaOut)
def atualizar_conta_receber_excluida(id: int, dados: conta_receber_excluida.ContaReceberExcluidaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_conta_receber_excluida(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Conta a receber excluída removida com sucesso"}

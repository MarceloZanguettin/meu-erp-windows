from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ChequeEmitido
from schemas import cheque_emitido

router = APIRouter(prefix="/cheques-emitidos", tags=["Cheques Emitidos GENUS (Financeiro)"])


def _get_ou_404(db: Session, id: int) -> ChequeEmitido:
    obj = db.query(ChequeEmitido).filter(ChequeEmitido.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Cheque emitido não encontrado")
    return obj


@router.get("", response_model=list[cheque_emitido.ChequeEmitidoOut])
def listar_cheques_emitidos(
    conta_pagar_id: Optional[int] = Query(None),
    cod_pagar: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    cod_contas: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ChequeEmitido)
    if conta_pagar_id:
        q = q.filter(ChequeEmitido.conta_pagar_id == conta_pagar_id)
    if cod_pagar:
        q = q.filter(ChequeEmitido.cod_pagar == cod_pagar)
    if cod_empresa:
        q = q.filter(ChequeEmitido.cod_empresa == cod_empresa)
    if cod_contas:
        q = q.filter(ChequeEmitido.cod_contas == cod_contas)
    if busca:
        termo = f"%{busca}%"
        filtros = [
            ChequeEmitido.nominal.ilike(termo),
            ChequeEmitido.obs.ilike(termo),
            ChequeEmitido.cod_historico.ilike(termo),
        ]
        if busca.isdigit():
            valor = int(busca)
            filtros += [
                ChequeEmitido.cheque == valor,
                ChequeEmitido.cod_contas == valor,
                ChequeEmitido.cod_empresa == valor,
                ChequeEmitido.cod_pagar == valor,
            ]
        q = q.filter(or_(*filtros))
    return q.order_by(ChequeEmitido.id.desc()).all()


@router.get("/{id}", response_model=cheque_emitido.ChequeEmitidoOut)
def buscar_cheque_emitido(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cheque_emitido.ChequeEmitidoOut)
def criar_cheque_emitido(dados: cheque_emitido.ChequeEmitidoCreate, db: Session = Depends(get_db)):
    obj = ChequeEmitido(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cheque_emitido.ChequeEmitidoOut)
def atualizar_cheque_emitido(id: int, dados: cheque_emitido.ChequeEmitidoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cheque_emitido(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Cheque emitido deletado com sucesso"}

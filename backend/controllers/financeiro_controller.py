from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
import datetime

from database import get_db
from models.tabelas import Empresa, ContaBancaria, ContaPagar, ContaReceber, SaldoDiarioBancario
from schemas import financeiro

router = APIRouter(prefix="/financeiro", tags=["Financeiro"])


# ── Helpers privados ──────────────────────────────────────────────────────────

def _get_ou_404(db: Session, model, id: int):
    """Retorna o registro ou levanta 404."""
    obj = db.query(model).filter(model.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    return obj


def _aplicar_filtros_data(query, model, data_inicio: Optional[str], data_fim: Optional[str]):
    """Aplica filtros de intervalo de vencimento a uma query existente."""
    if data_inicio:
        query = query.filter(model.data_vencimento >= datetime.datetime.fromisoformat(data_inicio))
    if data_fim:
        query = query.filter(model.data_vencimento <= datetime.datetime.fromisoformat(data_fim + 'T23:59:59'))
    return query


# ── Empresas ──────────────────────────────────────────────────────────────────

@router.get("/empresas", response_model=list[financeiro.EmpresaOut])
def listar_empresas(busca: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(Empresa)
    if busca:
        q = q.filter(Empresa.nome.ilike(f"%{busca}%"))
    return q.order_by(Empresa.nome).all()


@router.get("/empresas/{id}", response_model=financeiro.EmpresaOut)
def obter_empresa(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, Empresa, id)


@router.post("/empresas", response_model=financeiro.EmpresaOut)
def criar_empresa(dados: financeiro.EmpresaCreate, db: Session = Depends(get_db)):
    obj = Empresa(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/empresas/{id}", response_model=financeiro.EmpresaOut)
def atualizar_empresa(id: int, dados: financeiro.EmpresaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Empresa, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/empresas/{id}")
def deletar_empresa(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, Empresa, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Registro deletado com sucesso"}


# ── Contas Bancárias ──────────────────────────────────────────────────────────

@router.get("/contas-bancarias", response_model=list[financeiro.ContaBancariaOut])
def listar_contas_bancarias(
    empresa_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ContaBancaria)
    if empresa_id:
        q = q.filter(ContaBancaria.empresa_id == empresa_id)
    return q.order_by(ContaBancaria.banco).all()


@router.post("/contas-bancarias", response_model=financeiro.ContaBancariaOut)
def criar_conta_bancaria(dados: financeiro.ContaBancariaCreate, db: Session = Depends(get_db)):
    nova = ContaBancaria(**dados.dict())
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova


# ── Contas a Pagar ────────────────────────────────────────────────────────────

@router.get("/contas-pagar", response_model=list[financeiro.ContaPagarOut])
def listar_contas_pagar(
    empresa_id:        Optional[int] = Query(None),
    conta_bancaria_id: Optional[int] = Query(None),
    data_inicio:       Optional[str] = Query(None),
    data_fim:          Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ContaPagar)
    if empresa_id:
        q = q.filter(ContaPagar.empresa_id == empresa_id)
    if conta_bancaria_id:
        q = q.filter(ContaPagar.conta_bancaria_id == conta_bancaria_id)
    q = _aplicar_filtros_data(q, ContaPagar, data_inicio, data_fim)
    return q.order_by(ContaPagar.data_vencimento).all()


@router.post("/contas-pagar", response_model=financeiro.ContaPagarOut)
def criar_conta_pagar(conta: financeiro.ContaPagarCreate, db: Session = Depends(get_db)):
    nova = ContaPagar(**conta.dict())
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova


@router.put("/contas-pagar/{id}", response_model=financeiro.ContaPagarOut)
def atualizar_conta_pagar(id: int, dados: financeiro.ContaPagarUpdate, db: Session = Depends(get_db)):
    conta = _get_ou_404(db, ContaPagar, id)
    agora = datetime.datetime.utcnow()

    if dados.data_vencimento is not None and conta.status == "pendente":
        data_antiga = conta.data_vencimento
        nova_data   = dados.data_vencimento
        if data_antiga < agora and nova_data >= agora:
            conta.postergado = True
        elif nova_data < agora:
            conta.postergado = False

    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(conta, campo, valor)
    db.commit()
    db.refresh(conta)
    return conta


@router.patch("/contas-pagar/{id}/pagar", response_model=financeiro.ContaPagarOut)
def pagar_conta(id: int, db: Session = Depends(get_db)):
    conta = _get_ou_404(db, ContaPagar, id)
    conta.status         = "pago"
    conta.data_pagamento = datetime.datetime.utcnow()
    conta.postergado     = False
    db.commit()
    db.refresh(conta)
    return conta


@router.patch("/contas-pagar/{id}/estornar", response_model=financeiro.ContaPagarOut)
def estornar_conta_pagar(id: int, db: Session = Depends(get_db)):
    conta = _get_ou_404(db, ContaPagar, id)
    conta.status         = "pendente"
    conta.data_pagamento = None
    conta.postergado     = False
    db.commit()
    db.refresh(conta)
    return conta


@router.delete("/contas-pagar/{id}")
def deletar_conta_pagar(id: int, db: Session = Depends(get_db)):
    conta = _get_ou_404(db, ContaPagar, id)
    db.delete(conta)
    db.commit()
    return {"detail": "Conta deletada com sucesso"}


# ── Contas a Receber ──────────────────────────────────────────────────────────

@router.get("/contas-receber", response_model=list[financeiro.ContaReceberOut])
def listar_contas_receber(
    empresa_id:        Optional[int] = Query(None),
    conta_bancaria_id: Optional[int] = Query(None),
    data_inicio:       Optional[str] = Query(None),
    data_fim:          Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ContaReceber)
    if empresa_id:
        q = q.filter(ContaReceber.empresa_id == empresa_id)
    if conta_bancaria_id:
        q = q.filter(ContaReceber.conta_bancaria_id == conta_bancaria_id)
    q = _aplicar_filtros_data(q, ContaReceber, data_inicio, data_fim)
    return q.order_by(ContaReceber.data_vencimento).all()


@router.post("/contas-receber", response_model=financeiro.ContaReceberOut)
def criar_conta_receber(conta: financeiro.ContaReceberCreate, db: Session = Depends(get_db)):
    nova = ContaReceber(**conta.dict())
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova


@router.put("/contas-receber/{id}", response_model=financeiro.ContaReceberOut)
def atualizar_conta_receber(id: int, dados: financeiro.ContaReceberUpdate, db: Session = Depends(get_db)):
    conta = _get_ou_404(db, ContaReceber, id)
    agora = datetime.datetime.utcnow()

    if dados.data_vencimento is not None and conta.status == "pendente":
        data_antiga = conta.data_vencimento
        nova_data   = dados.data_vencimento
        if data_antiga < agora and nova_data >= agora:
            conta.postergado = True
        elif nova_data < agora:
            conta.postergado = False

    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(conta, campo, valor)
    db.commit()
    db.refresh(conta)
    return conta


@router.patch("/contas-receber/{id}/receber", response_model=financeiro.ContaReceberOut)
def receber_conta(id: int, db: Session = Depends(get_db)):
    conta = _get_ou_404(db, ContaReceber, id)
    conta.status           = "recebido"
    conta.data_recebimento = datetime.datetime.utcnow()
    conta.postergado       = False
    db.commit()
    db.refresh(conta)
    return conta


@router.patch("/contas-receber/{id}/estornar", response_model=financeiro.ContaReceberOut)
def estornar_conta_receber(id: int, db: Session = Depends(get_db)):
    conta = _get_ou_404(db, ContaReceber, id)
    conta.status           = "pendente"
    conta.data_recebimento = None
    conta.postergado       = False
    db.commit()
    db.refresh(conta)
    return conta


@router.delete("/contas-receber/{id}")
def deletar_conta_receber(id: int, db: Session = Depends(get_db)):
    conta = _get_ou_404(db, ContaReceber, id)
    db.delete(conta)
    db.commit()
    return {"detail": "Conta deletada com sucesso"}


# ── Saldos Diários Bancários ──────────────────────────────────────────────────

@router.get("/saldos-diarios", response_model=list[financeiro.SaldoDiarioOut])
def listar_saldos_diarios(
    conta_bancaria_id: Optional[int] = Query(None),
    data_inicio:       Optional[str] = Query(None),
    data_fim:          Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(SaldoDiarioBancario)
    if conta_bancaria_id:
        q = q.filter(SaldoDiarioBancario.conta_bancaria_id == conta_bancaria_id)
    if data_inicio:
        q = q.filter(SaldoDiarioBancario.data >= datetime.datetime.fromisoformat(data_inicio))
    if data_fim:
        q = q.filter(SaldoDiarioBancario.data <= datetime.datetime.fromisoformat(data_fim + "T23:59:59"))
    return q.order_by(SaldoDiarioBancario.conta_bancaria_id, SaldoDiarioBancario.data).all()

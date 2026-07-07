from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ClienteAtendimento
from schemas import cliente_atendimento

router = APIRouter(prefix="/clientes-atendimento", tags=["Atendimentos de Cliente GENUS (Cadastros)"])


def _get_ou_404(db: Session, id: int) -> ClienteAtendimento:
    obj = db.query(ClienteAtendimento).filter(ClienteAtendimento.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Atendimento de cliente (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[cliente_atendimento.ClienteAtendimentoOut])
def listar_clientes_atendimento(
    cliente_id: Optional[int] = Query(None),
    cod_cliente: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ClienteAtendimento)
    if cliente_id:
        q = q.filter(ClienteAtendimento.cliente_id == cliente_id)
    if cod_cliente:
        q = q.filter(ClienteAtendimento.cod_cliente == cod_cliente)
    if busca:
        q = q.filter(ClienteAtendimento.observacao.ilike(f"%{busca}%"))
    return q.order_by(ClienteAtendimento.data.desc().nullslast(), ClienteAtendimento.id.desc()).all()


@router.get("/{id}", response_model=cliente_atendimento.ClienteAtendimentoOut)
def buscar_cliente_atendimento(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cliente_atendimento.ClienteAtendimentoOut)
def criar_cliente_atendimento(dados: cliente_atendimento.ClienteAtendimentoCreate, db: Session = Depends(get_db)):
    obj = ClienteAtendimento(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cliente_atendimento.ClienteAtendimentoOut)
def atualizar_cliente_atendimento(id: int, dados: cliente_atendimento.ClienteAtendimentoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cliente_atendimento(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Atendimento de cliente (GENUS) deletado com sucesso"}

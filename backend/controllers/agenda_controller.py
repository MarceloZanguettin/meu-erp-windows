from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Agenda
from schemas import agenda as agenda_schema

# Tabela mestre de Agenda do GENUS (GENUS.AGENDA) — módulo RH/Folha,
# compromissos/lembretes; ver docstring do model `Agenda` em
# models/tabelas.py.
router = APIRouter(prefix="/agendas", tags=["Agenda (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Agenda:
    obj = db.query(Agenda).filter(Agenda.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Compromisso de agenda não encontrado")
    return obj


@router.get("", response_model=list[agenda_schema.AgendaOut])
def listar_agendas(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Agenda)
    if busca:
        condicoes = [
            Agenda.texto.ilike(f"%{busca}%"),
            Agenda.status.ilike(f"%{busca}%"),
            Agenda.hora.ilike(f"%{busca}%"),
        ]
        if busca.isdigit():
            condicoes.append(Agenda.codigo == int(busca))
        q = q.filter(or_(*condicoes))
    return q.order_by(Agenda.id).all()


@router.get("/{id}", response_model=agenda_schema.AgendaOut)
def buscar_agenda(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=agenda_schema.AgendaOut)
def criar_agenda(dados: agenda_schema.AgendaCreate, db: Session = Depends(get_db)):
    obj = Agenda(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=agenda_schema.AgendaOut)
def atualizar_agenda(id: int, dados: agenda_schema.AgendaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_agenda(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Compromisso de agenda deletado com sucesso"}

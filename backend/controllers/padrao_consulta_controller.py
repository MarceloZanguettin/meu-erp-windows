from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import PadraoConsulta
from schemas import padrao_consulta as padrao_consulta_schema

# Tabela mestre de Padrões de Consulta do GENUS (GENUS.PADRAOCONSULTA) —
# módulo Sistema/Config, layout de grade (ordem/colunas exibidas) salvo por
# funcionário/empresa/tela; ver docstring do model `PadraoConsulta` em
# models/tabelas.py.
router = APIRouter(prefix="/padroes-consulta", tags=["Padrões de Consulta (GENUS)"])


def _get_ou_404(db: Session, id: int) -> PadraoConsulta:
    obj = db.query(PadraoConsulta).filter(PadraoConsulta.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Padrão de Consulta não encontrado")
    return obj


@router.get("", response_model=list[padrao_consulta_schema.PadraoConsultaOut])
def listar_padroes_consulta(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(PadraoConsulta)
    if busca:
        condicoes = [
            PadraoConsulta.tipo_consulta.ilike(f"%{busca}%"),
            PadraoConsulta.coluna.ilike(f"%{busca}%"),
        ]
        if busca.isdigit():
            condicoes.append(PadraoConsulta.codigo == int(busca))
        q = q.filter(or_(*condicoes))
    return q.order_by(PadraoConsulta.id).all()


@router.get("/{id}", response_model=padrao_consulta_schema.PadraoConsultaOut)
def buscar_padrao_consulta(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=padrao_consulta_schema.PadraoConsultaOut)
def criar_padrao_consulta(dados: padrao_consulta_schema.PadraoConsultaCreate, db: Session = Depends(get_db)):
    obj = PadraoConsulta(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=padrao_consulta_schema.PadraoConsultaOut)
def atualizar_padrao_consulta(id: int, dados: padrao_consulta_schema.PadraoConsultaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_padrao_consulta(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Padrão de Consulta deletado com sucesso"}

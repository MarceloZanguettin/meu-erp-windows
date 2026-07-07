from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Setor
from schemas import setor as setor_schema

# Tabela mestre de Setores do GENUS (GENUS.SETOR) — módulo RH/Folha,
# referenciada por Funcionario.cod_setor e CadastroContato.cod_setor
# (código bruto); ver docstring do model `Setor` em models/tabelas.py.
router = APIRouter(prefix="/setores", tags=["Setores (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Setor:
    obj = db.query(Setor).filter(Setor.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Setor não encontrado")
    return obj


@router.get("", response_model=list[setor_schema.SetorOut])
def listar_setores(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Setor)
    if busca:
        condicoes = [
            Setor.descricao.ilike(f"%{busca}%"),
        ]
        if busca.isdigit():
            condicoes.append(Setor.codigo == int(busca))
        q = q.filter(or_(*condicoes))
    return q.order_by(Setor.id).all()


@router.get("/{id}", response_model=setor_schema.SetorOut)
def buscar_setor(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=setor_schema.SetorOut)
def criar_setor(dados: setor_schema.SetorCreate, db: Session = Depends(get_db)):
    obj = Setor(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=setor_schema.SetorOut)
def atualizar_setor(id: int, dados: setor_schema.SetorUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_setor(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Setor deletado com sucesso"}

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Agregado
from schemas import agregado

# Agregados (GENUS.AGREGADOS) — pessoas adicionais vinculadas a um cadastro,
# tabela filha de CADASTRO (já reconhecida neste ERP como CadastroPessoa),
# 1:N via cadastro_pessoa_id/cod_cadastro. Ver docstring do model Agregado.
router = APIRouter(prefix="/agregados", tags=["Agregados (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Agregado:
    obj = db.query(Agregado).filter(Agregado.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Agregado não encontrado")
    return obj


@router.get("", response_model=list[agregado.AgregadoOut])
def listar_agregados(
    cadastro_pessoa_id: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Agregado)
    if cadastro_pessoa_id:
        q = q.filter(Agregado.cadastro_pessoa_id == cadastro_pessoa_id)
    if busca:
        q = q.filter(
            (Agregado.nome.ilike(f"%{busca}%"))
            | (Agregado.cnpj.ilike(f"%{busca}%"))
        )
    return q.order_by(Agregado.id).all()


@router.get("/{id}", response_model=agregado.AgregadoOut)
def buscar_agregado(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=agregado.AgregadoOut)
def criar_agregado(dados: agregado.AgregadoCreate, db: Session = Depends(get_db)):
    obj = Agregado(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=agregado.AgregadoOut)
def atualizar_agregado(id: int, dados: agregado.AgregadoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_agregado(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Agregado deletado com sucesso"}

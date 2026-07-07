from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Iva
from schemas import iva as iva_schema

# Tabela mestre de Índice de Valor Agregado (IVA) por Classificação Fiscal x
# Estado do GENUS (GENUS.IVA) — usada no cálculo do ICMS-ST; referenciada
# apenas como valor bruto já calculado nos campos iva/iva_reajusta de
# Entrada, ItemEntrada, Saida, ItemPedidoLan, ItemSaida etc.; ver docstring
# do model `Iva` em models/tabelas.py.
router = APIRouter(prefix="/ivas", tags=["IVA (GENUS)"])


def _get_ou_404(db: Session, id: int) -> Iva:
    obj = db.query(Iva).filter(Iva.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="IVA não encontrado")
    return obj


@router.get("", response_model=list[iva_schema.IvaOut])
def listar_ivas(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Iva)
    if busca:
        condicoes = [Iva.estado.ilike(f"%{busca}%")]
        if busca.isdigit():
            condicoes.append(Iva.cod_classificacao == int(busca))
        q = q.filter(or_(*condicoes))
    return q.order_by(Iva.id).all()


@router.get("/{id}", response_model=iva_schema.IvaOut)
def buscar_iva(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=iva_schema.IvaOut)
def criar_iva(dados: iva_schema.IvaCreate, db: Session = Depends(get_db)):
    obj = Iva(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=iva_schema.IvaOut)
def atualizar_iva(id: int, dados: iva_schema.IvaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_iva(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "IVA deletado com sucesso"}

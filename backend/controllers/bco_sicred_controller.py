from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import BcoSicred
from schemas import bco_sicred

router = APIRouter(prefix="/bco-sicred", tags=["Banco Sicred - Retorno/Remessa (GENUS)"])


def _get_ou_404(db: Session, id: int) -> BcoSicred:
    obj = db.query(BcoSicred).filter(BcoSicred.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Configuração Banco Sicred (GENUS) não encontrada")
    return obj


@router.get("", response_model=list[bco_sicred.BcoSicredOut])
def listar_bco_sicred(
    cod_empresa: Optional[int] = Query(None),
    cod_cedente: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(BcoSicred)
    if cod_empresa:
        q = q.filter(BcoSicred.cod_empresa == cod_empresa)
    if cod_cedente:
        q = q.filter(BcoSicred.cod_cedente == cod_cedente)
    if busca:
        termo = f"%{busca}%"
        filtros = [
            BcoSicred.agencia.ilike(termo),
            BcoSicred.conta.ilike(termo),
            BcoSicred.carteira.ilike(termo),
            BcoSicred.convenio.ilike(termo),
            BcoSicred.observacao.ilike(termo),
        ]
        if busca.isdigit():
            valor = int(busca)
            filtros += [
                BcoSicred.codigo == valor,
                BcoSicred.cod_empresa == valor,
                BcoSicred.cod_cedente == valor,
                BcoSicred.cod_carteira == valor,
                BcoSicred.numero == valor,
                BcoSicred.carteira_banco == valor,
            ]
        q = q.filter(or_(*filtros))
    return q.order_by(BcoSicred.id.desc()).all()


@router.get("/{id}", response_model=bco_sicred.BcoSicredOut)
def buscar_bco_sicred(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=bco_sicred.BcoSicredOut)
def criar_bco_sicred(dados: bco_sicred.BcoSicredCreate, db: Session = Depends(get_db)):
    obj = BcoSicred(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=bco_sicred.BcoSicredOut)
def atualizar_bco_sicred(id: int, dados: bco_sicred.BcoSicredUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_bco_sicred(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Configuração Banco Sicred (GENUS) deletada com sucesso"}

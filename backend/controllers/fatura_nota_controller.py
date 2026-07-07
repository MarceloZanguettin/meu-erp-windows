from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import FaturaNota
from schemas import fatura_nota

router = APIRouter(prefix="/faturas-nota", tags=["Vínculo Fatura-Nota Fiscal GENUS (Financeiro)"])


def _get_ou_404(db: Session, id: int) -> FaturaNota:
    obj = db.query(FaturaNota).filter(FaturaNota.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Vínculo fatura-nota fiscal (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[fatura_nota.FaturaNotaOut])
def listar_faturas_nota(
    saida_id: Optional[int] = Query(None),
    cod_fatura: Optional[int] = Query(None),
    cod_saida: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(FaturaNota)
    if saida_id:
        q = q.filter(FaturaNota.saida_id == saida_id)
    if cod_fatura:
        q = q.filter(FaturaNota.cod_fatura == cod_fatura)
    if cod_saida:
        q = q.filter(FaturaNota.cod_saida == cod_saida)
    if cod_empresa:
        q = q.filter(FaturaNota.cod_empresa == cod_empresa)
    if busca:
        try:
            valor_busca = int(busca)
        except ValueError:
            valor_busca = None
        if valor_busca is not None:
            q = q.filter(
                (FaturaNota.cod_fatura == valor_busca)
                | (FaturaNota.cod_saida == valor_busca)
            )
    return q.order_by(FaturaNota.id.desc()).all()


@router.get("/{id}", response_model=fatura_nota.FaturaNotaOut)
def buscar_fatura_nota(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=fatura_nota.FaturaNotaOut)
def criar_fatura_nota(dados: fatura_nota.FaturaNotaCreate, db: Session = Depends(get_db)):
    obj = FaturaNota(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=fatura_nota.FaturaNotaOut)
def atualizar_fatura_nota(id: int, dados: fatura_nota.FaturaNotaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_fatura_nota(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Vínculo fatura-nota fiscal (GENUS) deletado com sucesso"}

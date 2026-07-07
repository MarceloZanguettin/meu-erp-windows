from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import FaturaNotaPagar
from schemas import fatura_nota_pagar

router = APIRouter(prefix="/faturas-nota-pagar", tags=["Vínculo Fatura-Nota Pagar GENUS (Financeiro)"])


def _get_ou_404(db: Session, id: int) -> FaturaNotaPagar:
    obj = db.query(FaturaNotaPagar).filter(FaturaNotaPagar.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Vínculo fatura-nota pagar (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[fatura_nota_pagar.FaturaNotaPagarOut])
def listar_faturas_nota_pagar(
    conta_pagar_id: Optional[int] = Query(None),
    cod_fatura_pagar: Optional[int] = Query(None),
    cod_pagar: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(FaturaNotaPagar)
    if conta_pagar_id:
        q = q.filter(FaturaNotaPagar.conta_pagar_id == conta_pagar_id)
    if cod_fatura_pagar:
        q = q.filter(FaturaNotaPagar.cod_fatura_pagar == cod_fatura_pagar)
    if cod_pagar:
        q = q.filter(FaturaNotaPagar.cod_pagar == cod_pagar)
    if cod_empresa:
        q = q.filter(FaturaNotaPagar.cod_empresa == cod_empresa)
    if busca:
        termo = f"%{busca}%"
        filtros = [
            FaturaNotaPagar.duplicata.ilike(termo),
            FaturaNotaPagar.num_doc.ilike(termo),
            FaturaNotaPagar.obs.ilike(termo),
        ]
        if busca.isdigit():
            valor = int(busca)
            filtros += [
                FaturaNotaPagar.codigo == valor,
                FaturaNotaPagar.cod_fatura_pagar == valor,
                FaturaNotaPagar.cod_pagar == valor,
                FaturaNotaPagar.doc == valor,
                FaturaNotaPagar.doc_entrada == valor,
            ]
        q = q.filter(or_(*filtros))
    return q.order_by(FaturaNotaPagar.id.desc()).all()


@router.get("/{id}", response_model=fatura_nota_pagar.FaturaNotaPagarOut)
def buscar_fatura_nota_pagar(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=fatura_nota_pagar.FaturaNotaPagarOut)
def criar_fatura_nota_pagar(dados: fatura_nota_pagar.FaturaNotaPagarCreate, db: Session = Depends(get_db)):
    obj = FaturaNotaPagar(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=fatura_nota_pagar.FaturaNotaPagarOut)
def atualizar_fatura_nota_pagar(id: int, dados: fatura_nota_pagar.FaturaNotaPagarUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_fatura_nota_pagar(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Vínculo fatura-nota pagar (GENUS) deletado com sucesso"}

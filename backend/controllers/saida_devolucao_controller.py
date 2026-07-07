from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import SaidaDevolucao
from schemas import saida_devolucao

router = APIRouter(prefix="/saidas-devolucao", tags=["Devolução de Saída GENUS (Vendas/Faturamento)"])


def _get_ou_404(db: Session, id: int) -> SaidaDevolucao:
    obj = db.query(SaidaDevolucao).filter(SaidaDevolucao.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Devolução de saída (GENUS) não encontrada")
    return obj


@router.get("", response_model=list[saida_devolucao.SaidaDevolucaoOut])
def listar_saidas_devolucao(
    saida_id: Optional[int] = Query(None),
    cod_saida: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    saida_codigo: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(SaidaDevolucao)
    if saida_id:
        q = q.filter(SaidaDevolucao.saida_id == saida_id)
    if cod_saida:
        q = q.filter(SaidaDevolucao.cod_saida == cod_saida)
    if cod_empresa:
        q = q.filter(SaidaDevolucao.cod_empresa == cod_empresa)
    if saida_codigo:
        q = q.filter(SaidaDevolucao.saida_codigo == saida_codigo)
    if busca:
        try:
            valor_busca = int(busca)
        except ValueError:
            valor_busca = None
        if valor_busca is not None:
            q = q.filter(
                (SaidaDevolucao.cod_saida == valor_busca)
                | (SaidaDevolucao.saida_codigo == valor_busca)
                | (SaidaDevolucao.entrada_doc == valor_busca)
            )
        else:
            q = q.filter(SaidaDevolucao.ref_chave.ilike(f"%{busca}%"))
    return q.order_by(SaidaDevolucao.id.desc()).all()


@router.get("/{id}", response_model=saida_devolucao.SaidaDevolucaoOut)
def buscar_saida_devolucao(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=saida_devolucao.SaidaDevolucaoOut)
def criar_saida_devolucao(dados: saida_devolucao.SaidaDevolucaoCreate, db: Session = Depends(get_db)):
    obj = SaidaDevolucao(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=saida_devolucao.SaidaDevolucaoOut)
def atualizar_saida_devolucao(id: int, dados: saida_devolucao.SaidaDevolucaoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_saida_devolucao(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Devolução de saída (GENUS) deletada com sucesso"}

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import SaidaExcluida
from schemas import saida_excluida

router = APIRouter(prefix="/saidas-excluidas", tags=["Saídas Excluídas (Vendas/Faturamento)"])


def _get_ou_404(db: Session, id: int) -> SaidaExcluida:
    obj = db.query(SaidaExcluida).filter(SaidaExcluida.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Saída excluída não encontrada")
    return obj


@router.get("", response_model=list[saida_excluida.SaidaExcluidaOut])
def listar_saidas_excluidas(
    cod_empresa: Optional[int] = Query(None),
    codigo: Optional[int] = Query(None),
    cod_cliente: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(SaidaExcluida)
    if cod_empresa:
        q = q.filter(SaidaExcluida.cod_empresa == cod_empresa)
    if codigo:
        q = q.filter(SaidaExcluida.codigo == codigo)
    if cod_cliente:
        q = q.filter(SaidaExcluida.cod_cliente == cod_cliente)
    if busca:
        q = q.filter(
            (SaidaExcluida.chave_nfe.ilike(f"%{busca}%"))
            | (SaidaExcluida.serie.ilike(f"%{busca}%"))
            | (SaidaExcluida.cpf_cnpj.ilike(f"%{busca}%"))
        )
    return q.order_by(SaidaExcluida.id.desc()).all()


@router.get("/{id}", response_model=saida_excluida.SaidaExcluidaOut)
def buscar_saida_excluida(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=saida_excluida.SaidaExcluidaOut)
def criar_saida_excluida(dados: saida_excluida.SaidaExcluidaCreate, db: Session = Depends(get_db)):
    obj = SaidaExcluida(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=saida_excluida.SaidaExcluidaOut)
def atualizar_saida_excluida(id: int, dados: saida_excluida.SaidaExcluidaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_saida_excluida(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Saída excluída removida com sucesso"}

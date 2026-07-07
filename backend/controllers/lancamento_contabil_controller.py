from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import LancamentoContabil
from schemas import lancamento_contabil

router = APIRouter(prefix="/lancamentos-contabeis", tags=["Lançamentos Contábeis"])


def _get_ou_404(db: Session, id: int) -> LancamentoContabil:
    obj = db.query(LancamentoContabil).filter(LancamentoContabil.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Lançamento contábil não encontrado")
    return obj


@router.get("", response_model=list[lancamento_contabil.LancamentoContabilOut])
def listar_lancamentos_contabeis(
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(LancamentoContabil)
    if cod_empresa:
        q = q.filter(LancamentoContabil.cod_empresa == cod_empresa)
    if busca:
        q = q.filter(
            (LancamentoContabil.doc.ilike(f"%{busca}%"))
            | (LancamentoContabil.obs.ilike(f"%{busca}%"))
            | (LancamentoContabil.cod_historico.ilike(f"%{busca}%"))
            | (LancamentoContabil.usuario.ilike(f"%{busca}%"))
        )
    return q.order_by(LancamentoContabil.id.desc()).all()


@router.get("/{id}", response_model=lancamento_contabil.LancamentoContabilOut)
def buscar_lancamento_contabil(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=lancamento_contabil.LancamentoContabilOut)
def criar_lancamento_contabil(dados: lancamento_contabil.LancamentoContabilCreate, db: Session = Depends(get_db)):
    obj = LancamentoContabil(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=lancamento_contabil.LancamentoContabilOut)
def atualizar_lancamento_contabil(id: int, dados: lancamento_contabil.LancamentoContabilUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_lancamento_contabil(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Lançamento contábil deletado com sucesso"}

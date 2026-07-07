from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import MovimentoFixo
from schemas import movimento_fixo

router = APIRouter(prefix="/movimentos-fixos", tags=["Movimentos Fixos"])


def _get_ou_404(db: Session, id: int) -> MovimentoFixo:
    obj = db.query(MovimentoFixo).filter(MovimentoFixo.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Movimento fixo não encontrado")
    return obj


@router.get("", response_model=list[movimento_fixo.MovimentoFixoOut])
def listar_movimentos_fixos(
    ano: Optional[str] = Query(None),
    mes: Optional[str] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(MovimentoFixo)
    if ano:
        q = q.filter(MovimentoFixo.ano == ano)
    if mes:
        q = q.filter(MovimentoFixo.mes == mes)
    if busca:
        q = q.filter(
            (MovimentoFixo.mes.ilike(f"%{busca}%"))
            | (MovimentoFixo.ano.ilike(f"%{busca}%"))
        )
    return q.order_by(MovimentoFixo.id.desc()).all()


@router.get("/{id}", response_model=movimento_fixo.MovimentoFixoOut)
def buscar_movimento_fixo(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=movimento_fixo.MovimentoFixoOut)
def criar_movimento_fixo(dados: movimento_fixo.MovimentoFixoCreate, db: Session = Depends(get_db)):
    obj = MovimentoFixo(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=movimento_fixo.MovimentoFixoOut)
def atualizar_movimento_fixo(id: int, dados: movimento_fixo.MovimentoFixoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_movimento_fixo(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Movimento fixo deletado com sucesso"}

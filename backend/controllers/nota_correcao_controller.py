from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import NotaCorrecao
from schemas import nota_correcao

router = APIRouter(prefix="/notas-correcao", tags=["Carta de Correção Eletrônica (CC-e) GENUS (Fiscal)"])


def _get_ou_404(db: Session, id: int) -> NotaCorrecao:
    obj = db.query(NotaCorrecao).filter(NotaCorrecao.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Carta de Correção (GENUS) não encontrada")
    return obj


@router.get("", response_model=list[nota_correcao.NotaCorrecaoOut])
def listar_notas_correcao(
    saida_id: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    cod_saida: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(NotaCorrecao)
    if saida_id:
        q = q.filter(NotaCorrecao.saida_id == saida_id)
    if cod_empresa:
        q = q.filter(NotaCorrecao.cod_empresa == cod_empresa)
    if cod_saida:
        q = q.filter(NotaCorrecao.cod_saida == cod_saida)
    if busca:
        q = q.filter(NotaCorrecao.texto.ilike(f"%{busca}%"))
    return q.order_by(NotaCorrecao.id.desc()).all()


@router.get("/{id}", response_model=nota_correcao.NotaCorrecaoOut)
def buscar_nota_correcao(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=nota_correcao.NotaCorrecaoOut)
def criar_nota_correcao(dados: nota_correcao.NotaCorrecaoCreate, db: Session = Depends(get_db)):
    obj = NotaCorrecao(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=nota_correcao.NotaCorrecaoOut)
def atualizar_nota_correcao(id: int, dados: nota_correcao.NotaCorrecaoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_nota_correcao(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Carta de Correção (GENUS) deletada com sucesso"}

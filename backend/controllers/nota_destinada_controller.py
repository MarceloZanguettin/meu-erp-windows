from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import NotaDestinada
from schemas import nota_destinada

router = APIRouter(prefix="/notas-destinadas", tags=["Notas destinadas / manifesto do destinatário GENUS (Fiscal)"])


def _get_ou_404(db: Session, id: int) -> NotaDestinada:
    obj = db.query(NotaDestinada).filter(NotaDestinada.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Nota destinada (GENUS) não encontrada")
    return obj


@router.get("", response_model=list[nota_destinada.NotaDestinadaOut])
def listar_notas_destinadas(
    cod_empresa: Optional[int] = Query(None),
    entrada_id: Optional[int] = Query(None),
    situacao: Optional[str] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(NotaDestinada)
    if cod_empresa:
        q = q.filter(NotaDestinada.cod_empresa == cod_empresa)
    if entrada_id:
        q = q.filter(NotaDestinada.entrada_id == entrada_id)
    if situacao:
        q = q.filter(NotaDestinada.situacao == situacao)
    if busca:
        q = q.filter(
            (NotaDestinada.fornecedor.ilike(f"%{busca}%"))
            | (NotaDestinada.cnpj.ilike(f"%{busca}%"))
            | (NotaDestinada.chave_nfe.ilike(f"%{busca}%"))
        )
    return q.order_by(NotaDestinada.id.desc()).all()


@router.get("/{id}", response_model=nota_destinada.NotaDestinadaOut)
def buscar_nota_destinada(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=nota_destinada.NotaDestinadaOut)
def criar_nota_destinada(dados: nota_destinada.NotaDestinadaCreate, db: Session = Depends(get_db)):
    obj = NotaDestinada(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=nota_destinada.NotaDestinadaOut)
def atualizar_nota_destinada(id: int, dados: nota_destinada.NotaDestinadaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_nota_destinada(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Nota destinada (GENUS) deletada com sucesso"}

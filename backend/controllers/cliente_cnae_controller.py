from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ClienteCnae
from schemas import cliente_cnae

router = APIRouter(prefix="/clientes-cnae", tags=["CNAEs de Cliente GENUS (Cadastros)"])


def _get_ou_404(db: Session, id: int) -> ClienteCnae:
    obj = db.query(ClienteCnae).filter(ClienteCnae.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="CNAE de cliente (GENUS) não encontrado")
    return obj


@router.get("", response_model=list[cliente_cnae.ClienteCnaeOut])
def listar_clientes_cnae(
    cliente_id: Optional[int] = Query(None),
    cod_cliente: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ClienteCnae)
    if cliente_id:
        q = q.filter(ClienteCnae.cliente_id == cliente_id)
    if cod_cliente:
        q = q.filter(ClienteCnae.cod_cliente == cod_cliente)
    if busca:
        q = q.filter(
            (ClienteCnae.cod_cnae.ilike(f"%{busca}%"))
            | (ClienteCnae.descricao.ilike(f"%{busca}%"))
        )
    return q.order_by(ClienteCnae.id.desc()).all()


@router.get("/{id}", response_model=cliente_cnae.ClienteCnaeOut)
def buscar_cliente_cnae(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cliente_cnae.ClienteCnaeOut)
def criar_cliente_cnae(dados: cliente_cnae.ClienteCnaeCreate, db: Session = Depends(get_db)):
    obj = ClienteCnae(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cliente_cnae.ClienteCnaeOut)
def atualizar_cliente_cnae(id: int, dados: cliente_cnae.ClienteCnaeUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cliente_cnae(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "CNAE de cliente (GENUS) deletado com sucesso"}

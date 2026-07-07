from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import Comissao
from schemas import comissao

router = APIRouter(prefix="/comissoes", tags=["Comissões"])


def _get_ou_404(db: Session, id: int) -> Comissao:
    obj = db.query(Comissao).filter(Comissao.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Comissão não encontrada")
    return obj


@router.get("", response_model=list[comissao.ComissaoOut])
def listar_comissoes(
    representante_id: Optional[int] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Comissao)
    if representante_id:
        q = q.filter(Comissao.representante_id == representante_id)
    if cod_empresa:
        q = q.filter(Comissao.cod_empresa == cod_empresa)
    if busca:
        termo = f"%{busca}%"
        filtros = [Comissao.tipo_comissao.ilike(termo), Comissao.tipo_func.ilike(termo)]
        if busca.isdigit():
            valor = int(busca)
            filtros += [
                Comissao.codigo == valor,
                Comissao.nota_fiscal == valor,
                Comissao.cod_representante == valor,
                Comissao.cod_pedido == valor,
            ]
        q = q.filter(or_(*filtros))
    return q.order_by(Comissao.id.desc()).all()


@router.get("/{id}", response_model=comissao.ComissaoOut)
def buscar_comissao(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=comissao.ComissaoOut)
def criar_comissao(dados: comissao.ComissaoCreate, db: Session = Depends(get_db)):
    obj = Comissao(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=comissao.ComissaoOut)
def atualizar_comissao(id: int, dados: comissao.ComissaoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_comissao(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Comissão deletada com sucesso"}

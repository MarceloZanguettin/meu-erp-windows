from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import ContaGenus
from schemas import conta_genus

router = APIRouter(prefix="/contas-genus", tags=["Contas GENUS (Financeiro)"])


def _get_ou_404(db: Session, id: int) -> ContaGenus:
    obj = db.query(ContaGenus).filter(ContaGenus.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Conta (GENUS) não encontrada")
    return obj


@router.get("", response_model=list[conta_genus.ContaGenusOut])
def listar_contas_genus(
    cod_empresa: Optional[int] = Query(None),
    situacao: Optional[str] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ContaGenus)
    if cod_empresa:
        q = q.filter(ContaGenus.cod_empresa == cod_empresa)
    if situacao:
        q = q.filter(ContaGenus.situacao == situacao)
    if busca:
        termo = f"%{busca}%"
        filtros = [
            ContaGenus.descricao.ilike(termo),
            ContaGenus.banco.ilike(termo),
            ContaGenus.agencia.ilike(termo),
            ContaGenus.conta.ilike(termo),
            ContaGenus.cidade.ilike(termo),
            ContaGenus.titular.ilike(termo),
        ]
        if busca.isdigit():
            valor = int(busca)
            filtros += [
                ContaGenus.codigo == valor,
                ContaGenus.cod_empresa == valor,
            ]
        q = q.filter(or_(*filtros))
    return q.order_by(ContaGenus.id.desc()).all()


@router.get("/{id}", response_model=conta_genus.ContaGenusOut)
def buscar_conta_genus(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=conta_genus.ContaGenusOut)
def criar_conta_genus(dados: conta_genus.ContaGenusCreate, db: Session = Depends(get_db)):
    obj = ContaGenus(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=conta_genus.ContaGenusOut)
def atualizar_conta_genus(id: int, dados: conta_genus.ContaGenusUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_conta_genus(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Conta (GENUS) deletada com sucesso"}

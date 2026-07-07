from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import CadastroCbenef
from schemas import cadastro_cbenef

# Tabela catálogo de códigos de benefício fiscal (CBENEF) do GENUS
# (GENUS.CADASTROCBENEF) — referenciada por Produto.cod_cbenef,
# RegraEstado.cod_cbenef e ItemPedidoLan.cod_cbenef; não tem relação com
# CadastroPessoa/CADASTRO (ver docstring do model CadastroCbenef).
router = APIRouter(prefix="/cadastro-cbenef", tags=["Cadastro CBENEF (GENUS)"])


def _get_ou_404(db: Session, id: int) -> CadastroCbenef:
    obj = db.query(CadastroCbenef).filter(CadastroCbenef.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Código de benefício fiscal não encontrado")
    return obj


@router.get("", response_model=list[cadastro_cbenef.CadastroCbenefOut])
def listar_cadastro_cbenef(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(CadastroCbenef)
    if busca:
        q = q.filter(
            (CadastroCbenef.cbenef.ilike(f"%{busca}%"))
            | (CadastroCbenef.objeto_descricao.ilike(f"%{busca}%"))
        )
    return q.order_by(CadastroCbenef.id).all()


@router.get("/{id}", response_model=cadastro_cbenef.CadastroCbenefOut)
def buscar_cadastro_cbenef(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=cadastro_cbenef.CadastroCbenefOut)
def criar_cadastro_cbenef(dados: cadastro_cbenef.CadastroCbenefCreate, db: Session = Depends(get_db)):
    obj = CadastroCbenef(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=cadastro_cbenef.CadastroCbenefOut)
def atualizar_cadastro_cbenef(id: int, dados: cadastro_cbenef.CadastroCbenefUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_cadastro_cbenef(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Código de benefício fiscal deletado com sucesso"}

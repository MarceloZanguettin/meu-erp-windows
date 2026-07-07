from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import CentroCustoExcluido
from schemas import centro_custo_excluido

router = APIRouter(prefix="/centros-custo-excluidos", tags=["Centros de Custo Excluídos (GENUS)"])


def _get_ou_404(db: Session, id: int) -> CentroCustoExcluido:
    obj = db.query(CentroCustoExcluido).filter(CentroCustoExcluido.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Centro de custo excluído não encontrado")
    return obj


@router.get("", response_model=list[centro_custo_excluido.CentroCustoExcluidoOut])
def listar_centros_custo_excluidos(
    cod_produto: Optional[str] = Query(None),
    cod_empresa: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(CentroCustoExcluido)
    if cod_produto:
        q = q.filter(CentroCustoExcluido.cod_produto == cod_produto)
    if cod_empresa:
        q = q.filter(CentroCustoExcluido.cod_empresa == cod_empresa)
    if busca:
        q = q.filter(
            (CentroCustoExcluido.cod_produto.ilike(f"%{busca}%"))
            | (CentroCustoExcluido.placa.ilike(f"%{busca}%"))
            | (CentroCustoExcluido.chassi.ilike(f"%{busca}%"))
        )
    return q.order_by(CentroCustoExcluido.id.desc()).all()


@router.get("/{id}", response_model=centro_custo_excluido.CentroCustoExcluidoOut)
def buscar_centro_custo_excluido(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=centro_custo_excluido.CentroCustoExcluidoOut)
def criar_centro_custo_excluido(dados: centro_custo_excluido.CentroCustoExcluidoCreate, db: Session = Depends(get_db)):
    obj = CentroCustoExcluido(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=centro_custo_excluido.CentroCustoExcluidoOut)
def atualizar_centro_custo_excluido(id: int, dados: centro_custo_excluido.CentroCustoExcluidoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_centro_custo_excluido(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Centro de custo excluído removido com sucesso"}

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import RequisicaoMateria
from schemas import requisicao_materia

router = APIRouter(prefix="/requisicao-materia", tags=["Requisição de Material - Cabeçalho (GENUS)"])


def _get_ou_404(db: Session, id: int) -> RequisicaoMateria:
    obj = db.query(RequisicaoMateria).filter(RequisicaoMateria.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Requisição de material não encontrada")
    return obj


@router.get("", response_model=list[requisicao_materia.RequisicaoMateriaOut])
def listar_requisicao_materia(
    cod_cliente: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(RequisicaoMateria)
    if cod_cliente:
        q = q.filter(RequisicaoMateria.cod_cliente == cod_cliente)
    if status:
        q = q.filter(RequisicaoMateria.status == status)
    if busca:
        try:
            valor_busca = int(busca)
        except ValueError:
            valor_busca = None
        if valor_busca is not None:
            q = q.filter(
                (RequisicaoMateria.codigo == valor_busca)
                | (RequisicaoMateria.cod_cliente == valor_busca)
            )
        else:
            q = q.filter(
                (RequisicaoMateria.lote.ilike(f"%{busca}%"))
                | (RequisicaoMateria.local_entrega.ilike(f"%{busca}%"))
                | (RequisicaoMateria.cod_equipamento.ilike(f"%{busca}%"))
            )
    return q.order_by(RequisicaoMateria.id.desc()).all()


@router.get("/{id}", response_model=requisicao_materia.RequisicaoMateriaOut)
def buscar_requisicao_materia(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=requisicao_materia.RequisicaoMateriaOut)
def criar_requisicao_materia(dados: requisicao_materia.RequisicaoMateriaCreate, db: Session = Depends(get_db)):
    obj = RequisicaoMateria(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=requisicao_materia.RequisicaoMateriaOut)
def atualizar_requisicao_materia(id: int, dados: requisicao_materia.RequisicaoMateriaUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_requisicao_materia(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Requisição de material deletada com sucesso"}

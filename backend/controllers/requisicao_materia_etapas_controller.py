from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import RequisicaoMateriaEtapas
from schemas import requisicao_materia_etapas

router = APIRouter(prefix="/requisicao-materia-etapas", tags=["Etapas de Requisição de Material (GENUS)"])


def _get_ou_404(db: Session, id: int) -> RequisicaoMateriaEtapas:
    obj = db.query(RequisicaoMateriaEtapas).filter(RequisicaoMateriaEtapas.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Etapa de requisição de material não encontrada")
    return obj


@router.get("", response_model=list[requisicao_materia_etapas.RequisicaoMateriaEtapasOut])
def listar_requisicao_materia_etapas(
    requisicao_produto_id: Optional[int] = Query(None),
    cod_req_produto: Optional[int] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(RequisicaoMateriaEtapas)
    if requisicao_produto_id:
        q = q.filter(RequisicaoMateriaEtapas.requisicao_produto_id == requisicao_produto_id)
    if cod_req_produto:
        q = q.filter(RequisicaoMateriaEtapas.cod_req_produto == cod_req_produto)
    if busca:
        try:
            valor_busca = int(busca)
        except ValueError:
            valor_busca = None
        if valor_busca is not None:
            q = q.filter(
                (RequisicaoMateriaEtapas.codigo == valor_busca)
                | (RequisicaoMateriaEtapas.cod_req_produto == valor_busca)
            )
    return q.order_by(RequisicaoMateriaEtapas.id.desc()).all()


@router.get("/{id}", response_model=requisicao_materia_etapas.RequisicaoMateriaEtapasOut)
def buscar_requisicao_materia_etapas(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=requisicao_materia_etapas.RequisicaoMateriaEtapasOut)
def criar_requisicao_materia_etapas(dados: requisicao_materia_etapas.RequisicaoMateriaEtapasCreate, db: Session = Depends(get_db)):
    obj = RequisicaoMateriaEtapas(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=requisicao_materia_etapas.RequisicaoMateriaEtapasOut)
def atualizar_requisicao_materia_etapas(id: int, dados: requisicao_materia_etapas.RequisicaoMateriaEtapasUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_requisicao_materia_etapas(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Etapa de requisição de material deletada com sucesso"}

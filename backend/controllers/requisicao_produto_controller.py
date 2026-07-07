from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.tabelas import RequisicaoProduto
from schemas import requisicao_produto

router = APIRouter(prefix="/requisicao-produtos", tags=["Requisição de Material - Item (GENUS)"])


def _get_ou_404(db: Session, id: int) -> RequisicaoProduto:
    obj = db.query(RequisicaoProduto).filter(RequisicaoProduto.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Item de requisição de material não encontrado")
    return obj


@router.get("", response_model=list[requisicao_produto.RequisicaoProdutoOut])
def listar_requisicao_produtos(
    requisicao_materia_id: Optional[int] = Query(None),
    produto_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(RequisicaoProduto)
    if requisicao_materia_id:
        q = q.filter(RequisicaoProduto.requisicao_materia_id == requisicao_materia_id)
    if produto_id:
        q = q.filter(RequisicaoProduto.produto_id == produto_id)
    if status:
        q = q.filter(RequisicaoProduto.status == status)
    if busca:
        try:
            valor_busca = int(busca)
        except ValueError:
            valor_busca = None
        if valor_busca is not None:
            q = q.filter(
                (RequisicaoProduto.codigo == valor_busca)
                | (RequisicaoProduto.cod_requisicao == valor_busca)
            )
        else:
            q = q.filter(RequisicaoProduto.cod_produto.ilike(f"%{busca}%"))
    return q.order_by(RequisicaoProduto.id.desc()).all()


@router.get("/{id}", response_model=requisicao_produto.RequisicaoProdutoOut)
def buscar_requisicao_produto(id: int, db: Session = Depends(get_db)):
    return _get_ou_404(db, id)


@router.post("", response_model=requisicao_produto.RequisicaoProdutoOut)
def criar_requisicao_produto(dados: requisicao_produto.RequisicaoProdutoCreate, db: Session = Depends(get_db)):
    obj = RequisicaoProduto(**dados.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{id}", response_model=requisicao_produto.RequisicaoProdutoOut)
def atualizar_requisicao_produto(id: int, dados: requisicao_produto.RequisicaoProdutoUpdate, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    for campo, valor in dados.dict(exclude_none=True).items():
        setattr(obj, campo, valor)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}")
def deletar_requisicao_produto(id: int, db: Session = Depends(get_db)):
    obj = _get_ou_404(db, id)
    db.delete(obj)
    db.commit()
    return {"detail": "Item de requisição de material deletado com sucesso"}

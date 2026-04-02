from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import datetime

from database import get_db
from models.tabelas import MovimentoEstoque, Produto, Deposito
from schemas import estoque

router = APIRouter(prefix="/estoque", tags=["Estoque"])


# ── Movimentos ────────────────────────────────────────────────────────────────

@router.get("/movimentos", response_model=list[estoque.MovimentoOut])
def listar_movimentos(
    produto_id:   Optional[int] = Query(None),
    deposito_id:  Optional[int] = Query(None),
    tipo:         Optional[str] = Query(None),
    data_inicio:  Optional[str] = Query(None),
    data_fim:     Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(MovimentoEstoque)
    if produto_id:
        q = q.filter(MovimentoEstoque.produto_id == produto_id)
    if deposito_id:
        q = q.filter(MovimentoEstoque.deposito_id == deposito_id)
    if tipo:
        q = q.filter(MovimentoEstoque.tipo == tipo)
    if data_inicio:
        q = q.filter(MovimentoEstoque.data >= datetime.datetime.fromisoformat(data_inicio))
    if data_fim:
        q = q.filter(MovimentoEstoque.data <= datetime.datetime.fromisoformat(data_fim + "T23:59:59"))
    return q.order_by(MovimentoEstoque.data.desc()).all()


@router.post("/movimentos", response_model=estoque.MovimentoOut)
def registrar_movimento(dados: estoque.MovimentoCreate, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id == dados.produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    movimento = MovimentoEstoque(**dados.dict())
    db.add(movimento)

    # Atualiza o estoque do produto
    if dados.tipo in ("entrada", "ajuste"):
        produto.estoque = (produto.estoque or 0) + dados.quantidade
    elif dados.tipo == "saida":
        produto.estoque = (produto.estoque or 0) - dados.quantidade

    db.commit()
    db.refresh(movimento)
    return movimento


# ── Posição de Estoque ────────────────────────────────────────────────────────

@router.get("/posicao", response_model=list[estoque.PosicaoEstoqueOut])
def posicao_estoque(db: Session = Depends(get_db)):
    """Calcula saldo agrupado por produto e depósito a partir dos movimentos."""
    rows = (
        db.query(
            MovimentoEstoque.produto_id,
            MovimentoEstoque.deposito_id,
            MovimentoEstoque.tipo,
            func.sum(MovimentoEstoque.quantidade).label("total"),
        )
        .group_by(MovimentoEstoque.produto_id, MovimentoEstoque.deposito_id, MovimentoEstoque.tipo)
        .all()
    )

    # Agrupa por (produto_id, deposito_id) calculando saldo
    saldos: dict = {}
    for row in rows:
        chave = (row.produto_id, row.deposito_id)
        if chave not in saldos:
            saldos[chave] = 0.0
        if row.tipo in ("entrada", "ajuste"):
            saldos[chave] += row.total
        elif row.tipo == "saida":
            saldos[chave] -= row.total

    # Busca nomes de produto e depósito
    resultado = []
    for (produto_id, deposito_id), quantidade in saldos.items():
        produto = db.query(Produto).filter(Produto.id == produto_id).first()
        deposito = db.query(Deposito).filter(Deposito.id == deposito_id).first() if deposito_id else None
        resultado.append(
            estoque.PosicaoEstoqueOut(
                produto_id=produto_id,
                produto_nome=produto.nome if produto else "Desconhecido",
                deposito_id=deposito_id,
                deposito_nome=deposito.nome if deposito else None,
                quantidade=quantidade,
            )
        )

    return resultado

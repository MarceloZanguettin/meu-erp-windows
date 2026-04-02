from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.tabelas import Produto, Pedido, ItemPedido
from schemas.pedido import PedidoCreate


def realizar_venda(pedido_in: PedidoCreate, db: Session) -> dict:
    """
    Valida estoque, debita quantidades e persiste o pedido.

    Separado do controller para permitir reutilização (ex.: testes unitários,
    chamadas internas) sem passar pelo ciclo de request/response do FastAPI.
    """
    valor_total   = 0
    itens_novos   = []

    for item in pedido_in.itens:
        produto = db.query(Produto).filter(Produto.id == item.produto_id).first()

        if not produto:
            raise HTTPException(status_code=404, detail=f"Produto {item.produto_id} não encontrado")

        if produto.estoque < item.quantidade:
            raise HTTPException(
                status_code=400,
                detail=f"Estoque insuficiente para '{produto.nome}'. Disponível: {produto.estoque}",
            )

        produto.estoque -= item.quantidade
        valor_total     += produto.preco * item.quantidade

        itens_novos.append(ItemPedido(
            produto_id=produto.id,
            quantidade=item.quantidade,
            preco_unitario=produto.preco,
        ))

    novo_pedido = Pedido(
        cliente_id=pedido_in.cliente_id,
        total=valor_total,
        itens=itens_novos,
    )

    try:
        db.add(novo_pedido)
        db.commit()
        db.refresh(novo_pedido)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao processar venda no banco de dados")

    return {"msg": "Venda realizada com sucesso!", "pedido_id": novo_pedido.id, "total": valor_total}

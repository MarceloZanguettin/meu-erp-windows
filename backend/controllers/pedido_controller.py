from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.pedido import PedidoCreate
from services.pedido_service import realizar_venda

router = APIRouter(prefix="/pedidos", tags=["Pedidos e Vendas"])


@router.post("/")
def criar_pedido(pedido_in: PedidoCreate, db: Session = Depends(get_db)):
    return realizar_venda(pedido_in, db)

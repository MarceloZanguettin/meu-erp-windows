# backend/main.py
import eel
from fastapi import FastAPI, Depends, HTTPException
import uvicorn
from threading import Thread
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import tabelas
from schemas import pedido

#tabelas.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/api/status")
def get_status():
    return {"status": "Online", "msg": "Servidor do ERP respondendo via rede local"}

@app.post("/pedidos/")
def realizar_venda(pedido_in: pedido.PedidoCreate, db: Session = Depends(get_db)):
    valor_total_pedido = 0
    itens_para_salvar = []

    for item in pedido_in.itens:
        produto = db.query(tabelas.Produto).filter(tabelas.Produto.id == item.produto_id).first()
        
        if not produto:
            raise HTTPException(status_code=404, detail=f"Produto {item.produto_id} não encontrado")

        if produto.estoque < item.quantidade:
            raise HTTPException(
                status_code=400, 
                detail=f"Estoque insuficiente para o produto {produto.nome}. Disponível: {produto.estoque}"
            )

        produto.estoque -= item.quantidade
        subtotal = produto.preco * item.quantidade
        valor_total_pedido += subtotal

        novo_item = tabelas.ItemPedido(
            produto_id=produto.id,
            quantidade=item.quantidade,
            preco_unitario=produto.preco
        )
        itens_para_salvar.append(novo_item)

    novo_pedido = tabelas.Pedido(
        cliente_id=pedido_in.cliente_id,
        total=valor_total_pedido,
        itens=itens_para_salvar
    )

    try:
        db.add(novo_pedido)
        db.commit()
        db.refresh(novo_pedido)
        return {"msg": "Venda realizada com sucesso!", "pedido_id": novo_pedido.id, "total": valor_total_pedido}
    except Exception as e:
        db.rollback() 
        raise HTTPException(status_code=500, detail="Erro ao processar venda no banco de dados")

def start_eel():
    eel.init('../frontend/dist')
    eel.start('index.html', host='0.0.0.0', port=8000, mode='chrome')

def verificar_banco():
    try:
        # Este comando tenta criar as tabelas se elas não existirem
        # Se funcionar, a conexão está OK!
        Base.metadata.create_all(bind=engine)
        print("✅ Tabelas verificadas/criadas com sucesso no PostgreSQL!")
    except Exception as e:
        print(f"❌ Erro de conexão com o Banco de Dados: {e}")

if __name__ == "__main__":
    verificar_banco()

    api_thread = Thread(target=lambda: uvicorn.run(app, host="0.0.0.0", port=8050))
    api_thread.daemon = True
    api_thread.start()
    #start_eel()
    
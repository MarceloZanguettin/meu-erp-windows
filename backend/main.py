import eel
from fastapi import FastAPI, Depends, HTTPException
import uvicorn
from threading import Thread
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import tabelas
from schemas import pedido_schema # Seus schemas Pydantic

tabelas.Base.metadata.create_all(bind=engine)

# 1. Configuração do FastAPI (Cérebro do ERP)
app = FastAPI()

@app.get("/api/status")
def get_status():
    return {"status": "Online", "msg": "Servidor do ERP respondendo via rede local"}

# 2. Configuração do Eel (Interface Windows)
eel.init('../frontend/dist') # Pasta onde o build do React ficará

def start_eel():
    # host='0.0.0.0' permite que outros PCs vejam o app na rede
    # Se quiser que abra como janela nativa, use mode='chrome' ou 'edge'
    eel.start('index.html', host='0.0.0.0', port=8000, mode='chrome')

# 3. Inicialização combinada
if __name__ == "__main__":
    # Rodar o FastAPI em uma thread separada para não travar a interface
    api_thread = Thread(target=lambda: uvicorn.run(app, host="0.0.0.0", port=8050))
    api_thread.daemon = True
    api_thread.start()

    # Iniciar a janela do programa
    start_eel()

@app.post("/pedidos/")
def criar_pedido(pedido_input: pedido_schema.PedidoCreate, db: Session = Depends(get_db)):
    # 1. Verifica se o cliente existe
    db_cliente = db.query(tabelas.Cliente).filter(tabelas.Cliente.id == pedido_input.cliente_id).first()
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    # 2. Cria o registro do pedido (Lógica de transação)
    novo_pedido = tabelas.Pedido(cliente_id=pedido_input.cliente_id, total=0)
    db.add(novo_pedido)
    db.commit()
    db.refresh(novo_pedido)
    
    return {"status": "Sucesso", "id_pedido": novo_pedido.id}

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import tabelas
from schemas import pedido_schema

@app.post("/pedidos/")
def realizar_venda(pedido_in: pedido_schema.PedidoCreate, db: Session = Depends(get_db)):
    valor_total_pedido = 0
    itens_para_salvar = []

    # Percorre os itens enviados pelo React
    for item in pedido_in.itens:
        # Busca o produto no Postgres
        produto = db.query(tabelas.Produto).filter(tabelas.Produto.id == item.produto_id).first()
        
        if not produto:
            raise HTTPException(status_code=404, detail=f"Produto {item.produto_id} não encontrado")

        # --- VALIDAÇÃO DE ESTOQUE (Regra de Negócio) ---
        if produto.estoque < item.quantidade:
            raise HTTPException(
                status_code=400, 
                detail=f"Estoque insuficiente para o produto {produto.nome}. Disponível: {produto.estoque}"
            )

        # Atualiza o estoque (baixa automática)
        produto.estoque -= item.quantidade
        
        # Calcula subtotal
        subtotal = produto.preco * item.quantidade
        valor_total_pedido += subtotal

        # Prepara o objeto do item para a tabela itens_pedido
        novo_item = tabelas.ItemPedido(
            produto_id=produto.id,
            quantidade=item.quantidade,
            preco_unitario=produto.preco
        )
        itens_para_salvar.append(novo_item)

    # Cria o cabeçalho do pedido
    novo_pedido = tabelas.Pedido(
        cliente_id=pedido_in.cliente_id,
        total=valor_total_pedido,
        itens=itens_para_salvar
    )

    try:
        db.add(novo_pedido)
        db.commit() # Salva tudo de uma vez (Atomicidade)
        db.refresh(novo_pedido)
        return {"msg": "Venda realizada com sucesso!", "pedido_id": novo_pedido.id, "total": valor_total_pedido}
    except Exception as e:
        db.rollback() # Se der erro em qualquer parte, desfaz a baixa do estoque
        raise HTTPException(status_code=500, detail="Erro ao processar venda no banco de dados")
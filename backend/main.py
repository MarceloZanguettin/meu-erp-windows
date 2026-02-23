# backend/main.py
import eel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from threading import Thread

# Importações do Banco de Dados
from database import engine, Base
from models import tabelas

# Importação dos Controladores (MVC)
from controllers import auth_controller, pedido_controller, sistema_controller

# Cria as tabelas no banco de dados
tabelas.Base.metadata.create_all(bind=engine)

# Inicializa o FastAPI
app = FastAPI(title="Meu ERP API")

# Configuração de CORS (Para permitir a comunicação com o React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REGISTO DOS CONTROLADORES (Rotas)
app.include_router(auth_controller.router)
app.include_router(pedido_controller.router)
app.include_router(sistema_controller.router)

# Funções de Inicialização (Eel e DB)
def start_eel():
    eel.init('../frontend/dist')
    eel.start('index.html', host='localhost', port=8000, mode='chrome', size=(400, 550), position=(500, 200))

def verificar_banco():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tabelas verificadas/criadas com sucesso no PostgreSQL!")
    except Exception as e:
        print(f"❌ Erro de conexão com o Banco de Dados: {e}")

if __name__ == "__main__":
    verificar_banco()

    # Inicia a API FastAPI numa Thread separada
    api_thread = Thread(target=lambda: uvicorn.run(app, host="0.0.0.0", port=8050))
    api_thread.daemon = True
    api_thread.start()
    
    # Inicia o Front-end (Eel)
    start_eel()
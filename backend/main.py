# backend/main.py
import sys
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

import eel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from threading import Thread

# Importações do Banco de Dados
from database import engine, Base
from models import tabelas

# Importação dos Controladores (MVC)
from controllers import (
    auth_controller, pedido_controller, sistema_controller, financeiro_controller,
    cadastro_controller, estoque_controller, compras_controller,
    vendas_controller, usuarios_controller, produto_controller,
    cadastro_pessoa_controller, preco_produto_controller,
    produto_processo_controller, regra_produto_cliente_controller,
    regra_cliente_controller,
    produto_barra_controller, produto_producao_controller,
    produto_referencia_controller, produto_regra_controller,
    produto_foto_controller, regra_estado_controller,
    movto_produto_controller, produto_excluido_controller,
    tabela_preco_controller, regra_controller,
    produto_composicao_controller, produto_conversao_fornecedor_controller,
    tamanho_controller, marca_controller, item_saida_controller,
    item_orcamento_genus_controller, saida_controller,
    item_pedido_lan_controller, item_saida_excluido_controller,
    item_saida_cancelado_controller, log_alteracao_pedido_controller,
    pedido_nota_controller, saida_excluida_controller,
    saida_cancelada_controller, auditoria_pre_pedido_controller,
    saida_devolucao_controller, tipo_venda_controller,
    lancamento_contabil_controller, movimento_fixo_controller,
    conta_receber_excluida_controller, conta_pagar_excluida_controller,
    historico_controller, comissao_controller, fixo_pagar_controller,
    fatura_nota_controller, fatura_nota_pagar_controller, fatura_controller,
    fatura_pagar_controller, cheque_emitido_controller,
    conta_genus_controller, movto_controller, bco_sicred_controller,
    credito_controller, carteira_controller, classificacao_controller,
    cliente_empresa_controller, cadastro_cbenef_controller,
    cadastro_contato_controller, cliente_atendimento_controller,
    cliente_cnae_controller, fornecedor_banco_controller,
    cliente_anexo_controller, item_entrada_controller, entrada_controller,
    item_compra_controller, entrada_frete_controller, compra_genus_controller,
    compra_entrada_controller, cotacao_itens_controller, cotacao_produto_controller,
    cotacao_preco_controller, requisicao_materia_etapas_controller,
    requisicao_materia_controller, requisicao_produto_controller,
    nota_xml_controller, cfop_controller, nota_xml_entrada_controller,
    cclasstrib_controller, nota_correcao_controller, nota_destinada_controller,
    cst_ibs_cbs_controller, iva_controller, cidade_controller,
    pais_controller, mensagem_controller, estado_controller,
    centro_custo_excluido_controller, agregado_controller,
    padrao_consulta_controller, processo_controller,
    configuracao_controller, padrao_controller, repositorio_controller,
    restricao_controller, agenda_controller, cargo_controller,
    setor_controller,
)

# Tratamento de erros global
from core.error_handler import register_exception_handlers

# Cria as tabelas no banco de dados
tabelas.Base.metadata.create_all(bind=engine)

# Inicializa o FastAPI
app = FastAPI(title="Meu ERP API")

# Manipuladores de exceção globais (domínio + banco + validação)
register_exception_handlers(app)

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
app.include_router(financeiro_controller.router)
app.include_router(cadastro_controller.router)
app.include_router(estoque_controller.router)
app.include_router(compras_controller.router)
app.include_router(vendas_controller.router)
app.include_router(usuarios_controller.router)
app.include_router(produto_controller.router)
app.include_router(cadastro_pessoa_controller.router)
app.include_router(preco_produto_controller.router)
app.include_router(produto_processo_controller.router)
app.include_router(regra_produto_cliente_controller.router)
app.include_router(regra_cliente_controller.router)
app.include_router(produto_barra_controller.router)
app.include_router(produto_producao_controller.router)
app.include_router(produto_referencia_controller.router)
app.include_router(produto_regra_controller.router)
app.include_router(produto_foto_controller.router)
app.include_router(regra_estado_controller.router)
app.include_router(movto_produto_controller.router)
app.include_router(produto_excluido_controller.router)
app.include_router(tabela_preco_controller.router)
app.include_router(regra_controller.router)
app.include_router(produto_composicao_controller.router)
app.include_router(produto_conversao_fornecedor_controller.router)
app.include_router(tamanho_controller.router)
app.include_router(marca_controller.router)
app.include_router(processo_controller.router)
app.include_router(item_saida_controller.router)
app.include_router(item_orcamento_genus_controller.router)
app.include_router(saida_controller.router)
app.include_router(item_pedido_lan_controller.router)
app.include_router(item_saida_excluido_controller.router)
app.include_router(item_saida_cancelado_controller.router)
app.include_router(log_alteracao_pedido_controller.router)
app.include_router(pedido_nota_controller.router)
app.include_router(saida_excluida_controller.router)
app.include_router(saida_cancelada_controller.router)
app.include_router(auditoria_pre_pedido_controller.router)
app.include_router(saida_devolucao_controller.router)
app.include_router(tipo_venda_controller.router)
app.include_router(lancamento_contabil_controller.router)
app.include_router(movimento_fixo_controller.router)
app.include_router(conta_receber_excluida_controller.router)
app.include_router(conta_pagar_excluida_controller.router)
app.include_router(historico_controller.router)
app.include_router(comissao_controller.router)
app.include_router(fixo_pagar_controller.router)
app.include_router(fatura_nota_controller.router)
app.include_router(fatura_nota_pagar_controller.router)
app.include_router(fatura_controller.router)
app.include_router(fatura_pagar_controller.router)
app.include_router(cheque_emitido_controller.router)
app.include_router(conta_genus_controller.router)
app.include_router(movto_controller.router)
app.include_router(bco_sicred_controller.router)
app.include_router(credito_controller.router)
app.include_router(carteira_controller.router)
app.include_router(classificacao_controller.router)
app.include_router(cliente_empresa_controller.router)
app.include_router(cadastro_cbenef_controller.router)
app.include_router(cadastro_contato_controller.router)
app.include_router(cliente_atendimento_controller.router)
app.include_router(cliente_cnae_controller.router)
app.include_router(fornecedor_banco_controller.router)
app.include_router(cliente_anexo_controller.router)
app.include_router(item_entrada_controller.router)
app.include_router(entrada_controller.router)
app.include_router(item_compra_controller.router)
app.include_router(entrada_frete_controller.router)
app.include_router(compra_genus_controller.router)
app.include_router(compra_entrada_controller.router)
app.include_router(cotacao_itens_controller.router)
app.include_router(cotacao_produto_controller.router)
app.include_router(cotacao_preco_controller.router)
app.include_router(requisicao_materia_etapas_controller.router)
app.include_router(requisicao_materia_controller.router)
app.include_router(requisicao_produto_controller.router)
app.include_router(nota_xml_controller.router)
app.include_router(nota_correcao_controller.router)
app.include_router(cfop_controller.router)
app.include_router(nota_xml_entrada_controller.router)
app.include_router(cclasstrib_controller.router)
app.include_router(cst_ibs_cbs_controller.router)
app.include_router(iva_controller.router)
app.include_router(nota_destinada_controller.router)
app.include_router(cidade_controller.router)
app.include_router(pais_controller.router)
app.include_router(mensagem_controller.router)
app.include_router(estado_controller.router)
app.include_router(centro_custo_excluido_controller.router)
app.include_router(agregado_controller.router)
app.include_router(padrao_consulta_controller.router)
app.include_router(configuracao_controller.router)
app.include_router(padrao_controller.router)
app.include_router(repositorio_controller.router)
app.include_router(restricao_controller.router)
app.include_router(agenda_controller.router)
app.include_router(cargo_controller.router)
app.include_router(setor_controller.router)

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
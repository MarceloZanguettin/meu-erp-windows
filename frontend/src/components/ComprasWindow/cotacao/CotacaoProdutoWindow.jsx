import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposCotacaoProduto from './CamposCotacaoProduto.jsx';
import { FORM_VAZIO_COTACAO_PRODUTO, normalizarCotacaoProduto } from './camposCotacaoProduto.js';

/**
 * Janela de listagem/edição de Produto solicitado em Cotação de Preço
 * (GENUS.COTACAOPRODUTO — produto + quantidade pedidos dentro de uma RFQ).
 * Ver docstring do model `CotacaoProduto` em backend/models/tabelas.py —
 * item filho de `CotacaoPreco`/GENUS.COTACAOPRECO (cabeçalho da cotação, com
 * janela própria em ComprasWindow/cotacao/CotacaoPrecoWindow.jsx), irmã de
 * COTACAOITENS (GENUS.COTACAOITENS — a proposta recebida de cada fornecedor
 * para esses mesmos produtos). Exposta como janela própria (mesmo padrão de
 * ComprasWindow/cotacao/CotacaoItensWindow.jsx) em vez de uma aba dentro do
 * cabeçalho, seguindo o padrão já estabelecido para o restante do grupo
 * GENUS COTACAO*.
 */
export default function CotacaoProdutoWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/cotacao-produtos', FORM_VAZIO_COTACAO_PRODUTO, normalizarCotacaoProduto);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Produtos solicitados em Cotação de Preço (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={900} altura={580}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaCotacaoProduto', { onSalvar: recarregar })}
          placeholder="Buscar por código de produto..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Cotação (cód.)', 'Cotação (id)', 'Produto (cód.)', 'Produto (id)', 'Quantidade']}
            campos={['cod_cotacao', 'cotacao_preco_id', 'cod_produto', 'produto_id', 'qtde']}
            itens={itens}
            onEditar={abrirEditar}
            onExcluir={excluir}
            renderCelula={renderCelula}
          />
        )}
      </div>

      {modal && (
        <Portal>
          <div className="modal-overlay">
            <div className="modal-content" style={{ width: '90vw', maxWidth: '700px', maxHeight: '85vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Produto de Cotação' : 'Novo Produto de Cotação'}</strong>
              </div>
              <div className="modal-body">
                <CamposCotacaoProduto form={form} setForm={setForm} />
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={fecharModal}>Cancelar</button>
                <button className="btn-save" onClick={salvar}>Salvar</button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </JanelaBase>
  );
}

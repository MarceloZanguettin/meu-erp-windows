import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposCotacaoPreco from './CamposCotacaoPreco.jsx';
import { FORM_VAZIO_COTACAO_PRECO, normalizarCotacaoPreco } from './camposCotacaoPreco.js';

/**
 * Janela de listagem/edição do cabeçalho da Cotação de Preço/RFQ
 * (GENUS.COTACAOPRECO). Ver docstring do model `CotacaoPreco` em
 * backend/models/tabelas.py — cabeçalho (empresa, emissão, descrição,
 * status, validade, funcionário solicitante, aprovador) do qual
 * `CotacaoItens`/GENUS.COTACAOITENS (propostas de fornecedores) e
 * `CotacaoProduto`/GENUS.COTACAOPRODUTO (produtos/quantidades solicitados)
 * são filhas, agora resolvíveis via `cotacao_preco_id`. Mesmo padrão de
 * ComprasWindow/cotacao/CotacaoItensWindow.jsx.
 */
export default function CotacaoPrecoWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/cotacao-preco', FORM_VAZIO_COTACAO_PRECO, normalizarCotacaoPreco);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Cotação de Preço - Cabeçalho (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1000} altura={620}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaCotacaoPreco', { onSalvar: recarregar })}
          placeholder="Buscar por descrição..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Empresa (cód.)', 'Descrição', 'Status', 'Emissão', 'Validade']}
            campos={['codigo', 'cod_empresa', 'descricao', 'status', 'emissao', 'validade']}
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
            <div className="modal-content" style={{ width: '90vw', maxWidth: '900px', maxHeight: '85vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Cotação de Preço' : 'Nova Cotação de Preço'}</strong>
              </div>
              <div className="modal-body">
                <CamposCotacaoPreco form={form} setForm={setForm} />
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

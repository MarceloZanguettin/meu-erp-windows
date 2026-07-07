import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposCotacaoItens from './CamposCotacaoItens.jsx';
import { FORM_VAZIO_COTACAO_ITENS, normalizarCotacaoItens } from './camposCotacaoItens.js';

/**
 * Janela de listagem/edição de Item de Cotação de Preço (GENUS.COTACAOITENS —
 * linha "fornecedor cotou produto por tal preço" dentro de uma RFQ). Ver
 * docstring do model `CotacaoItens` em backend/models/tabelas.py — item
 * filho de `CotacaoPreco`/GENUS.COTACAOPRECO (cabeçalho da cotação, com
 * janela própria em ComprasWindow/cotacao/CotacaoPrecoWindow.jsx), análoga
 * em espírito a `ItemCompra`/GENUS.COMPRASLAN, mas exposta aqui como janela
 * própria (mesmo padrão de ComprasWindow/compra/CompraGenusWindow.jsx e
 * ComprasWindow/entrada/EntradaWindow.jsx) em vez de uma aba dentro do
 * cabeçalho, seguindo o padrão já estabelecido para o restante do grupo
 * GENUS COTACAO*.
 */
export default function CotacaoItensWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/cotacao-itens', FORM_VAZIO_COTACAO_ITENS, normalizarCotacaoItens);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Itens de Cotação de Preço (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1000} altura={620}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaCotacaoItens', { onSalvar: recarregar })}
          placeholder="Buscar por código de produto ou observação..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Cotação (cód.)', 'Cotação (id)', 'Produto (cód.)', 'Fornecedor (cód.)', 'Unitário', 'Total']}
            campos={['codigo', 'cod_cotacao_preco', 'cotacao_preco_id', 'cod_produto', 'cod_fornecedor', 'unitario', 'total']}
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
                <strong>{editandoId ? 'Editar Item de Cotação' : 'Novo Item de Cotação'}</strong>
              </div>
              <div className="modal-body">
                <CamposCotacaoItens form={form} setForm={setForm} />
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

import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposCompraGenus from './CamposCompraGenus.jsx';
import { FORM_VAZIO_COMPRA_GENUS, normalizarCompraGenus } from './camposCompraGenus.js';

/**
 * Janela de listagem/edição de Compra (GENUS.COMPRAS — cabeçalho de
 * solicitação/pedido de compra). Ver docstring do model `CompraGenus` em
 * backend/models/tabelas.py — cabeçalho de `ItemCompra`/GENUS.COMPRASLAN,
 * análoga a `Entrada`/GENUS.ENTRADA (ComprasWindow/entrada/EntradaWindow.jsx),
 * mas para o estágio anterior ao recebimento fiscal da mercadoria
 * (solicitação/pedido de compra, não nota fiscal de entrada). Distinta
 * também de `SolicitacaoCompra`/`PedidoCompra`, o fluxo de compras nativo
 * deste ERP (aba "Compras" em ComprasWindow/index.jsx).
 */
export default function CompraGenusWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/compras-genus', FORM_VAZIO_COMPRA_GENUS, normalizarCompraGenus);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Compras (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={640}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaCompraGenus', { onSalvar: recarregar })}
          placeholder="Buscar por status, OS ou conhecimento..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Fornecedor (cód.)', 'Emissão', 'Entrega', 'Total', 'Status']}
            campos={['codigo', 'cod_fornecedor', 'emissao', 'dt_entrega', 'total', 'status']}
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
            <div className="modal-content" style={{ width: '90vw', maxWidth: '1100px', maxHeight: '85vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Compra' : 'Nova Compra'}</strong>
              </div>
              <div className="modal-body">
                <CamposCompraGenus form={form} setForm={setForm} />
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

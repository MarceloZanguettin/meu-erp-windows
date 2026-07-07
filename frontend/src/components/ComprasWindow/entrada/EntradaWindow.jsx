import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposEntrada from './CamposEntrada.jsx';
import TabelaEntradaFrete from './TabelaEntradaFrete.jsx';
import TabelaCompraEntrada from './TabelaCompraEntrada.jsx';
import TabelaNotaXmlEntrada from './TabelaNotaXmlEntrada.jsx';
import { FORM_VAZIO_ENTRADA, normalizarEntrada } from './camposEntrada.js';

/**
 * Janela de listagem/edição de Entrada (GENUS.ENTRADA — cabeçalho de nota
 * fiscal de entrada/compra). Ver docstring do model `Entrada` em
 * backend/models/tabelas.py — entidade de cabeçalho própria, análoga a
 * `Saida`/GENUS.SAIDA (VendasWindow/saida/SaidaWindow.jsx), mas para o lado
 * de entrada/compra da mercadoria.
 */
export default function EntradaWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/entradas', FORM_VAZIO_ENTRADA, normalizarEntrada);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Entradas (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={640}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaEntrada', { onSalvar: recarregar })}
          placeholder="Buscar por chave NF-e, série ou CFOP..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Doc', 'Série', 'Fornecedor (cód.)', 'Emissão', 'Data Entrada', 'Total NF']}
            campos={['doc', 'serie', 'cod_fornecedor', 'emissao', 'dt_entrada', 'total_nf']}
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
                <strong>{editandoId ? 'Editar Entrada' : 'Nova Entrada'}</strong>
              </div>
              <div className="modal-body">
                <CamposEntrada form={form} setForm={setForm} />
                <TabelaEntradaFrete entradaId={editandoId} />
                <TabelaCompraEntrada entradaId={editandoId} />
                <TabelaNotaXmlEntrada entradaId={editandoId} />
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

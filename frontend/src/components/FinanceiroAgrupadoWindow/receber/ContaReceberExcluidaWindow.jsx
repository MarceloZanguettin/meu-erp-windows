import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposContaReceberExcluida from './CamposContaReceberExcluida.jsx';
import { FORM_VAZIO_CONTA_RECEBER_EXCLUIDA, normalizarContaReceberExcluida } from './camposContaReceberExcluida.js';

/**
 * Janela de listagem/edição de Conta a Receber Excluída (GENUS.DELRECEBER —
 * histórico/snapshot de um título de contas a receber no momento em que foi
 * excluído no GENUS). Ver docstring do model `ContaReceberExcluida` em
 * backend/models/tabelas.py — análoga a `ProdutoExcluido`/GENUS.DEL_PRODUTO
 * e a `SaidaExcluida`/GENUS.DELSAIDA, só que para o título de
 * `ContaReceber`/GENUS.RECEBER.
 */
export default function ContaReceberExcluidaWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/contas-receber-excluidas', FORM_VAZIO_CONTA_RECEBER_EXCLUIDA, normalizarContaReceberExcluida);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Contas a Receber Excluídas (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={640}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaContaReceberExcluida', { onSalvar: recarregar })}
          placeholder="Buscar por nosso número, parcela ou histórico..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Parcela', 'Cliente (cód.)', 'Vencimento', 'Valor', 'Data Pagamento', 'Data Exclusão']}
            campos={['codigo', 'parcela', 'cod_cliente', 'data_vencimento', 'valor', 'data_recebimento', 'dt_exclusao']}
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
                <strong>{editandoId ? 'Editar Conta a Receber Excluída' : 'Nova Conta a Receber Excluída'}</strong>
              </div>
              <div className="modal-body">
                <CamposContaReceberExcluida form={form} setForm={setForm} />
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

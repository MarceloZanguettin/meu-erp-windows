import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposContaPagarExcluida from './CamposContaPagarExcluida.jsx';
import { FORM_VAZIO_CONTA_PAGAR_EXCLUIDA, normalizarContaPagarExcluida } from './camposContaPagarExcluida.js';

/**
 * Janela de listagem/edição de Conta a Pagar Excluída (GENUS.DELPAGAR —
 * histórico/snapshot de um título de contas a pagar no momento em que foi
 * excluído no GENUS). Ver docstring do model `ContaPagarExcluida` em
 * backend/models/tabelas.py — análoga a `ContaReceberExcluida`/GENUS.DELRECEBER,
 * só que para o título de `ContaPagar`/GENUS.PAGAR.
 */
export default function ContaPagarExcluidaWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/contas-pagar-excluidas', FORM_VAZIO_CONTA_PAGAR_EXCLUIDA, normalizarContaPagarExcluida);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Contas a Pagar Excluídas (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={640}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaContaPagarExcluida', { onSalvar: recarregar })}
          placeholder="Buscar por duplicata, parcela ou histórico..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Parcela', 'Fornecedor (cód.)', 'Vencimento', 'Valor', 'Data Pagamento', 'Data Exclusão']}
            campos={['codigo', 'parcela', 'cod_fornecedor', 'data_vencimento', 'valor', 'data_pagamento', 'dt_exclusao']}
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
                <strong>{editandoId ? 'Editar Conta a Pagar Excluída' : 'Nova Conta a Pagar Excluída'}</strong>
              </div>
              <div className="modal-body">
                <CamposContaPagarExcluida form={form} setForm={setForm} />
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

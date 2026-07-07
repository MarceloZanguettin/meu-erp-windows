import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposLancamentoContabil from './CamposLancamentoContabil.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarLancamentoContabil } from './services/lancamentoContabilService.js';
import './LancamentoContabilWindow.css';

/**
 * Janela de listagem/edição do Lançamento Contábil (GENUS.LANCAMENTO).
 *
 * Reconhece todos os campos migrados da tabela GENUS LANCAMENTO — ver
 * docstring do model LancamentoContabil em backend/models/tabelas.py para o
 * detalhe de que este é o livro-razão contábil do GENUS, distinto do
 * "lançamento financeiro" já existente neste ERP (título de ContaPagar/
 * ContaReceber, exibido em FinanceiroAgrupadoWindow/LancamentoDetalheWindow).
 */
export default function LancamentoContabilWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/lancamentos-contabeis', FORM_VAZIO, normalizarLancamentoContabil);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    i.doc?.toLowerCase().includes(busca.toLowerCase()) ||
    i.obs?.toLowerCase().includes(busca.toLowerCase()) ||
    i.cod_historico?.toLowerCase().includes(busca.toLowerCase()) ||
    i.usuario?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => {
    if (campo === 'dt_movto' || campo === 'dt_digitacao') {
      return item[campo] ? String(item[campo]).slice(0, 10) : '-';
    }
    return item[campo] ?? '-';
  };

  return (
    <JanelaBase id={id} titulo="Lançamentos Contábeis (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1100} altura={640}>
      <div className="lc-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novoLancamentoContabil', { onSalvar: recarregar })}
          placeholder="Buscar por documento, observação, histórico ou usuário..."
        />
        {loading ? (
          <div className="lc-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Cód. Contas', 'Histórico', 'Valor', 'Documento', 'Data Movto', 'Usuário']}
            campos={['codigo', 'cod_contas', 'cod_historico', 'valor', 'doc', 'dt_movto', 'usuario']}
            itens={itensFiltrados}
            onEditar={abrirEditar}
            onExcluir={excluir}
            renderCelula={renderCelula}
          />
        )}
      </div>

      {modal && (
        <Portal>
          <div className="modal-overlay">
            <div className="modal-content lc-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Lançamento Contábil' : 'Novo Lançamento Contábil'}</strong>
              </div>
              <div className="modal-body lc-modal-body">
                <CamposLancamentoContabil form={form} setForm={setForm} />
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

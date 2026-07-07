import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposMovimentoFixo from './CamposMovimentoFixo.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarMovimentoFixo } from './services/movimentoFixoService.js';
import './MovimentoFixoWindow.css';

/**
 * Janela de listagem/edição do Movimento Fixo (GENUS.MOVTOFIXO).
 *
 * Reconhece todos os campos migrados da tabela GENUS MOVTOFIXO — ver
 * docstring do model MovimentoFixo em backend/models/tabelas.py para o
 * detalhe de que esta tabela controla a geração/baixa de um título
 * fixo/recorrente (mensalidade, despesa fixa etc.) a pagar (CODFIXOPAGAR)
 * ou a receber (CODFIXORECEBER) para uma competência MES/ANO específica.
 */
export default function MovimentoFixoWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/movimentos-fixos', FORM_VAZIO, normalizarMovimentoFixo);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    i.mes?.toLowerCase().includes(busca.toLowerCase()) ||
    i.ano?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Movimentos Fixos (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={900} altura={600}>
      <div className="mf-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novoMovimentoFixo', { onSalvar: recarregar })}
          placeholder="Buscar por mês ou ano..."
        />
        {loading ? (
          <div className="mf-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Mês', 'Ano', 'Cód. Fixo Pagar', 'Cód. Fixo Receber']}
            campos={['codigo', 'mes', 'ano', 'cod_fixo_pagar', 'cod_fixo_receber']}
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
            <div className="modal-content mf-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Movimento Fixo' : 'Novo Movimento Fixo'}</strong>
              </div>
              <div className="modal-body mf-modal-body">
                <CamposMovimentoFixo form={form} setForm={setForm} />
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

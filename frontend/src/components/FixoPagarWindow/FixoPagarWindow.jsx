import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposFixoPagar from './CamposFixoPagar.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarFixoPagar } from './services/fixoPagarService.js';
import './FixoPagarWindow.css';

/**
 * Janela de listagem/edição do Fixo a Pagar (GENUS.FIXOPAGAR).
 *
 * Reconhece todos os campos migrados da tabela GENUS FIXOPAGAR — ver
 * docstring do model FixoPagar em backend/models/tabelas.py para o detalhe
 * de que esta é a tabela mestre do título fixo/recorrente a pagar
 * (mensalidade, aluguel, despesa fixa mensal etc.), referenciada por
 * MOVTOFIXO.CODFIXOPAGAR (ver MovimentoFixoWindow).
 */
export default function FixoPagarWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/fixos-pagar', FORM_VAZIO, normalizarFixoPagar);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    String(i.codigo ?? '').includes(busca) ||
    i.obs?.toLowerCase().includes(busca.toLowerCase()) ||
    i.cod_historico?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Fixos a Pagar (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={960} altura={620}>
      <div className="fp-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novoFixoPagar', { onSalvar: recarregar })}
          placeholder="Buscar por código, observação ou histórico..."
        />
        {loading ? (
          <div className="fp-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Cód. Cadastro', 'Início', 'Término', 'Valor', 'Dia', 'Parcelas', 'Observação']}
            campos={['codigo', 'cod_cadastro', 'inicio', 'termino', 'valor', 'dia', 'qtde_parcela', 'obs']}
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
            <div className="modal-content fp-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Fixo a Pagar' : 'Novo Fixo a Pagar'}</strong>
              </div>
              <div className="modal-body fp-modal-body">
                <CamposFixoPagar form={form} setForm={setForm} />
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

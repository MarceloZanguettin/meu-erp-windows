import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposMovto from './CamposMovto.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarMovto } from './services/movtoService.js';
import './MovtoWindow.css';

/**
 * Janela de listagem/edição de Movimentos de Crédito (GENUS.MOVTO).
 *
 * Reconhece todos os campos migrados da tabela GENUS MOVTO — ver docstring
 * do model Movto em backend/models/tabelas.py para o detalhe completo,
 * incluindo a nota de que, ao contrário do que a analogia com
 * `ContaGenus`/GENUS.CONTAS poderia sugerir, MOVTO não tem nenhuma coluna
 * CODCONTAS: parece ser um livro-razão de crédito de cadastro (cliente),
 * não um extrato bancário/caixa.
 */
export default function MovtoWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/movtos', FORM_VAZIO, normalizarMovto);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    String(i.codigo ?? '').includes(busca) ||
    String(i.cod_cadastro ?? '').includes(busca) ||
    String(i.cod_cadastro_credito ?? '').includes(busca) ||
    String(i.cod_saida ?? '').includes(busca) ||
    i.tipo?.toLowerCase().includes(busca.toLowerCase()) ||
    i.obs?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => {
    if ((campo === 'emissao' || campo === 'dt_credito') && item[campo]) return String(item[campo]).slice(0, 10);
    return item[campo] ?? '-';
  };

  return (
    <JanelaBase id={id} titulo="Movimentos de Crédito (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={980} altura={640}>
      <div className="mv-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novoMovto', { onSalvar: recarregar })}
          placeholder="Buscar por código, cadastro, saída, tipo ou observação..."
        />
        {loading ? (
          <div className="mv-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Cód. Empresa', 'Cód. Cadastro', 'Tipo', 'Emissão', 'Crédito', 'Data Crédito', 'Cód. Saída']}
            campos={['codigo', 'cod_empresa', 'cod_cadastro', 'tipo', 'emissao', 'credito', 'dt_credito', 'cod_saida']}
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
            <div className="modal-content mv-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Movimento' : 'Novo Movimento'}</strong>
              </div>
              <div className="modal-body mv-modal-body">
                <CamposMovto form={form} setForm={setForm} />
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

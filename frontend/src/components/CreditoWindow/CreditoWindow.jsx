import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposCredito from './CamposCredito.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarCredito } from './services/creditoService.js';
import './CreditoWindow.css';

/**
 * Janela de listagem/edição de Créditos de Cliente (GENUS.CREDITO).
 *
 * Reconhece todos os campos migrados da tabela GENUS CREDITO — ver docstring
 * do model Credito em backend/models/tabelas.py para o detalhe completo,
 * incluindo a distinção em relação a `Movto`/GENUS.MOVTO (livro-razão de
 * movimentos de crédito de cadastro) e às tabelas ainda não modeladas
 * CREDITOFORNECEDOR/CREDITOICMS.
 */
export default function CreditoWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/creditos', FORM_VAZIO, normalizarCredito);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    String(i.codigo ?? '').includes(busca) ||
    String(i.cod_cliente ?? '').includes(busca) ||
    String(i.cod_conta ?? '').includes(busca) ||
    String(i.cod_saida ?? '').includes(busca) ||
    i.cod_historico?.toLowerCase().includes(busca.toLowerCase()) ||
    i.obs?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => {
    if (campo === 'emissao' && item[campo]) return String(item[campo]).slice(0, 10);
    return item[campo] ?? '-';
  };

  return (
    <JanelaBase id={id} titulo="Créditos de Cliente (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={980} altura={640}>
      <div className="cr-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novoCredito', { onSalvar: recarregar })}
          placeholder="Buscar por código, cliente, conta, saída, histórico ou observação..."
        />
        {loading ? (
          <div className="cr-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Cód. Empresa', 'Cód. Cliente', 'Emissão', 'Valor', 'Cód. Conta', 'Cód. Histórico', 'Cód. Saída']}
            campos={['codigo', 'cod_empresa', 'cod_cliente', 'emissao', 'valor', 'cod_conta', 'cod_historico', 'cod_saida']}
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
            <div className="modal-content cr-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Crédito' : 'Novo Crédito'}</strong>
              </div>
              <div className="modal-body cr-modal-body">
                <CamposCredito form={form} setForm={setForm} />
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

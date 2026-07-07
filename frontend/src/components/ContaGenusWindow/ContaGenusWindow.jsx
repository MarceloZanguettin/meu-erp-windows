import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposContaGenus from './CamposContaGenus.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarContaGenus } from './services/contaGenusService.js';
import './ContaGenusWindow.css';

/**
 * Janela de listagem/edição de Contas (GENUS.CONTAS).
 *
 * Reconhece todos os campos migrados da tabela GENUS CONTAS — ver docstring
 * do model ContaGenus em backend/models/tabelas.py para o detalhe de que
 * esta é a tabela mestre de conta bancária/caixa do GENUS (distinta de
 * `ContaBancaria`, o cadastro de conta bancária próprio deste ERP),
 * referenciada como CODCONTAS (código bruto) por outras tabelas GENUS já
 * reconhecidas neste ERP (ContaReceber, ContaReceberExcluida,
 * LancamentoContabil, FixoPagar, ChequeEmitido, ClienteCompleto,
 * Fornecedor, PedidoVenda).
 */
export default function ContaGenusWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/contas-genus', FORM_VAZIO, normalizarContaGenus);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    String(i.codigo ?? '').includes(busca) ||
    i.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
    i.banco?.toLowerCase().includes(busca.toLowerCase()) ||
    i.conta?.toLowerCase().includes(busca.toLowerCase()) ||
    i.titular?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Contas (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={960} altura={620}>
      <div className="cg-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaContaGenus', { onSalvar: recarregar })}
          placeholder="Buscar por código, descrição, banco, conta ou titular..."
        />
        {loading ? (
          <div className="cg-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Descrição', 'Banco', 'Agência', 'Conta', 'Titular', 'Situação']}
            campos={['codigo', 'descricao', 'banco', 'agencia', 'conta', 'titular', 'situacao']}
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
            <div className="modal-content cg-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Conta' : 'Nova Conta'}</strong>
              </div>
              <div className="modal-body cg-modal-body">
                <CamposContaGenus form={form} setForm={setForm} />
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

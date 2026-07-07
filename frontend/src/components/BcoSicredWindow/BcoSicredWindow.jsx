import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposBcoSicred from './CamposBcoSicred.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarBcoSicred } from './services/bcoSicredService.js';
import './BcoSicredWindow.css';

/**
 * Janela de listagem/edição de configurações Banco Sicred — Retorno/Remessa
 * (GENUS.BCOSICRED).
 *
 * Reconhece todos os campos migrados da tabela GENUS BCOSICRED — ver
 * docstring do model BcoSicred em backend/models/tabelas.py para o detalhe
 * completo, incluindo a nota de que esta é uma tabela de layout de arquivo
 * de retorno/remessa bancária (CNAB) específica do Banco Sicred, análoga
 * (dentro do GENUS) às tabelas irmãs BCOBRADESCO, BCOBRASIL, BCOCAIXA,
 * BCOHSBC, BCOITAU, BCOSANTANDER e BCOSICOOB — ainda não modeladas neste
 * ERP.
 */
export default function BcoSicredWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/bco-sicred', FORM_VAZIO, normalizarBcoSicred);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    String(i.codigo ?? '').includes(busca) ||
    String(i.cod_empresa ?? '').includes(busca) ||
    String(i.cod_cedente ?? '').includes(busca) ||
    i.agencia?.toLowerCase().includes(busca.toLowerCase()) ||
    i.conta?.toLowerCase().includes(busca.toLowerCase()) ||
    i.carteira?.toLowerCase().includes(busca.toLowerCase()) ||
    i.convenio?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Banco Sicred - Retorno/Remessa (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1000} altura={640}>
      <div className="bs-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novoBcoSicred', { onSalvar: recarregar })}
          placeholder="Buscar por código, empresa, cedente, agência, conta, carteira ou convênio..."
        />
        {loading ? (
          <div className="bs-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Cód. Empresa', 'Cód. Cedente', 'Agência', 'Conta', 'Carteira', 'Convênio', 'CNAB']}
            campos={['codigo', 'cod_empresa', 'cod_cedente', 'agencia', 'conta', 'carteira', 'convenio', 'cnab']}
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
            <div className="modal-content bs-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Configuração Banco Sicred' : 'Nova Configuração Banco Sicred'}</strong>
              </div>
              <div className="modal-body bs-modal-body">
                <CamposBcoSicred form={form} setForm={setForm} />
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

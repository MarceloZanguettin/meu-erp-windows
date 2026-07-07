import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposCarteira from './CamposCarteira.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarCarteira } from './services/carteiraService.js';
import './CarteiraWindow.css';

/**
 * Janela de listagem/edição de Carteiras de Cobrança (GENUS.CARTEIRA).
 *
 * Reconhece todos os campos migrados da tabela GENUS CARTEIRA — ver
 * docstring do model Carteira em backend/models/tabelas.py para o detalhe
 * completo, incluindo a lista de tabelas já reconhecidas neste ERP
 * (ContaReceber, ContaPagar, FaturaPagar, BcoSicred etc.) que referenciam
 * CODCARTEIRA como código bruto.
 */
export default function CarteiraWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/carteiras', FORM_VAZIO, normalizarCarteira);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    String(i.codigo ?? '').includes(busca) ||
    String(i.float_pagto ?? '').includes(busca) ||
    i.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
    i.descontada?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Carteiras de Cobrança (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={760} altura={560}>
      <div className="ct-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaCarteira', { onSalvar: recarregar })}
          placeholder="Buscar por código, descrição, descontada ou float de pagamento..."
        />
        {loading ? (
          <div className="ct-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Descrição', 'Descontada', 'Float Pagto (dias)']}
            campos={['codigo', 'descricao', 'descontada', 'float_pagto']}
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
            <div className="modal-content ct-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Carteira' : 'Nova Carteira'}</strong>
              </div>
              <div className="modal-body ct-modal-body">
                <CamposCarteira form={form} setForm={setForm} />
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

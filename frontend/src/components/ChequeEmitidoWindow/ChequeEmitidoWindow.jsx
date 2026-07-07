import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposChequeEmitido from './CamposChequeEmitido.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarChequeEmitido } from './services/chequeEmitidoService.js';
import './ChequeEmitidoWindow.css';

/**
 * Janela de listagem/edição de Cheques Emitidos (GENUS.CHEQUE_EMITIDO).
 *
 * Reconhece todos os campos migrados da tabela GENUS CHEQUE_EMITIDO — ver
 * docstring do model ChequeEmitido em backend/models/tabelas.py para o
 * detalhe de que esta é o cheque próprio emitido pela empresa para pagar um
 * fornecedor/título (contraponto, no lado de contas a pagar, de GENUS.CHEQUE
 * — cheque de terceiro recebido, ainda não modelado neste ERP).
 */
export default function ChequeEmitidoWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/cheques-emitidos', FORM_VAZIO, normalizarChequeEmitido);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    String(i.cheque ?? '').includes(busca) ||
    String(i.cod_contas ?? '').includes(busca) ||
    i.nominal?.toLowerCase().includes(busca.toLowerCase()) ||
    i.cod_historico?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Cheques Emitidos (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={960} altura={620}>
      <div className="ce-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novoChequeEmitido', { onSalvar: recarregar })}
          placeholder="Buscar por cheque, cód. contas, nominal ou histórico..."
        />
        {loading ? (
          <div className="ce-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Cheque', 'Cód. Contas', 'Nominal', 'Valor', 'Emissão', 'Para', 'Cód. Pagar']}
            campos={['cheque', 'cod_contas', 'nominal', 'valor', 'emissao', 'para', 'cod_pagar']}
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
            <div className="modal-content ce-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Cheque Emitido' : 'Novo Cheque Emitido'}</strong>
              </div>
              <div className="modal-body ce-modal-body">
                <CamposChequeEmitido form={form} setForm={setForm} />
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

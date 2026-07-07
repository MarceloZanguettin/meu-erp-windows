import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposNotaDestinada from './CamposNotaDestinada.jsx';
import { FORM_VAZIO_NOTA_DESTINADA, normalizarNotaDestinada } from './camposNotaDestinada.js';

/**
 * Janela de listagem/edição de Nota Destinada (GENUS.NOTASDESTINADAS —
 * manifesto do destinatário / NF-e recebida de terceiros, ainda pendente de
 * manifestação e/ou lançamento como Entrada). Ver docstring do model
 * `NotaDestinada` em backend/models/tabelas.py — entidade de cabeçalho
 * própria do módulo Fiscal (Tier 2), estágio anterior a `Entrada`/GENUS.
 * ENTRADA. Segue o mesmo padrão de janela de listagem já usado em
 * ComprasWindow/entrada/EntradaWindow.jsx.
 */
export default function NotaDestinadaWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/notas-destinadas', FORM_VAZIO_NOTA_DESTINADA, normalizarNotaDestinada);

  const renderCelula = (item, campo) => {
    if (campo === 'emissao') return item.emissao ? new Date(item.emissao).toLocaleString('pt-BR') : '-';
    if (campo === 'total_nfe') return item.total_nfe != null ? Number(item.total_nfe).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-';
    return item[campo] ?? '-';
  };

  return (
    <JanelaBase id={id} titulo="Notas Destinadas (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={640}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaNotaDestinada', { onSalvar: recarregar })}
          placeholder="Buscar por fornecedor, CNPJ ou chave NF-e..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Fornecedor', 'CNPJ', 'Emissão', 'Total NF-e', 'Situação', 'Status']}
            campos={['codigo', 'fornecedor', 'cnpj', 'emissao', 'total_nfe', 'situacao', 'status_genus']}
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
            <div className="modal-content" style={{ width: '90vw', maxWidth: '1000px', maxHeight: '85vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Nota Destinada' : 'Nova Nota Destinada'}</strong>
              </div>
              <div className="modal-body">
                <CamposNotaDestinada form={form} setForm={setForm} />
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

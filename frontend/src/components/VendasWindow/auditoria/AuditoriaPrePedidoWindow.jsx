import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposAuditoriaPrePedido from './CamposAuditoriaPrePedido.jsx';
import { FORM_VAZIO_AUDITORIA_PRE_PEDIDO, normalizarAuditoriaPrePedido } from './camposAuditoriaPrePedido.js';

/**
 * Janela de listagem/edição da Auditoria de Pré-Pedido (GENUS.AUDITORIA_
 * PREPEDIDO — log de auditoria de eventos ocorridos num pré-pedido). Ver
 * docstring do model `AuditoriaPrePedido` em backend/models/tabelas.py —
 * entidade de log solta, sem cabeçalho "pré-pedido" próprio ainda modelado
 * neste ERP (PREPEDIDO ainda não tem model dedicado).
 */
export default function AuditoriaPrePedidoWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/auditorias-pre-pedido', FORM_VAZIO_AUDITORIA_PRE_PEDIDO, normalizarAuditoriaPrePedido);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Auditoria de Pré-Pedido (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={950} altura={620}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaAuditoriaPrePedido', { onSalvar: recarregar })}
          placeholder="Buscar por texto, operação ou lote..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Pré-Pedido (cód.)', 'Data', 'Hora', 'Operação', 'Funcionário (cód.)']}
            campos={['codigo', 'cod_pre_pedido', 'data', 'hora', 'operacao', 'cod_funcionario']}
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
            <div className="modal-content" style={{ width: '90vw', maxWidth: '900px', maxHeight: '85vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Auditoria de Pré-Pedido' : 'Nova Auditoria de Pré-Pedido'}</strong>
              </div>
              <div className="modal-body">
                <CamposAuditoriaPrePedido form={form} setForm={setForm} />
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

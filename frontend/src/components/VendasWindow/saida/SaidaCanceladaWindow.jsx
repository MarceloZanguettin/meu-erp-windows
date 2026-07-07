import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposSaidaCancelada from './CamposSaidaCancelada.jsx';
import { FORM_VAZIO_SAIDA_CANCELADA, normalizarSaidaCancelada } from './camposSaidaCancelada.js';

/**
 * Janela de listagem/edição de Saída Cancelada (GENUS.SAIDA_CANCELADA —
 * histórico/snapshot de um cabeçalho de nota fiscal de saída no momento em
 * que foi cancelado no GENUS). Ver docstring do model `SaidaCancelada` em
 * backend/models/tabelas.py — irmã de `SaidaExcluida`/GENUS.DELSAIDA, só que
 * para o evento de cancelamento em vez de exclusão.
 */
export default function SaidaCanceladaWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/saidas-canceladas', FORM_VAZIO_SAIDA_CANCELADA, normalizarSaidaCancelada);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Saídas Canceladas (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={640}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaSaidaCancelada', { onSalvar: recarregar })}
          placeholder="Buscar por chave NF-e, série ou CPF/CNPJ..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Doc', 'Série', 'Cliente (cód.)', 'Emissão', 'Total']}
            campos={['codigo', 'doc', 'serie', 'cod_cliente', 'emissao', 'total']}
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
            <div className="modal-content" style={{ width: '90vw', maxWidth: '1100px', maxHeight: '85vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Saída Cancelada' : 'Nova Saída Cancelada'}</strong>
              </div>
              <div className="modal-body">
                <CamposSaidaCancelada form={form} setForm={setForm} />
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

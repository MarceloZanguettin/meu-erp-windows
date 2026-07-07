import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposSaida from './CamposSaida.jsx';
import TabelaSaidaDevolucao from './TabelaSaidaDevolucao.jsx';
import TabelaNotaXml from './TabelaNotaXml.jsx';
import TabelaNotaCorrecao from './TabelaNotaCorrecao.jsx';
import { FORM_VAZIO_SAIDA, normalizarSaida } from './camposSaida.js';

/**
 * Janela de listagem/edição de Saída (GENUS.SAIDA — cabeçalho de nota
 * fiscal de saída/venda). Ver docstring do model `Saida` em
 * backend/models/tabelas.py — entidade de cabeçalho própria, análoga a
 * PedidoVenda/Orcamento, ainda sem contraparte "ERP nativa".
 */
export default function SaidaWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/saidas', FORM_VAZIO_SAIDA, normalizarSaida);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Saídas (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={640}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaSaida', { onSalvar: recarregar })}
          placeholder="Buscar por chave NF-e, série ou status..."
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
                <strong>{editandoId ? 'Editar Saída' : 'Nova Saída'}</strong>
              </div>
              <div className="modal-body">
                <CamposSaida form={form} setForm={setForm} />
                {editandoId && <TabelaSaidaDevolucao saidaId={editandoId} />}
                {editandoId && <TabelaNotaXml saidaId={editandoId} />}
                {editandoId && <TabelaNotaCorrecao saidaId={editandoId} />}
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

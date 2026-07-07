import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposSaidaExcluida from './CamposSaidaExcluida.jsx';
import { FORM_VAZIO_SAIDA_EXCLUIDA, normalizarSaidaExcluida } from './camposSaidaExcluida.js';

/**
 * Janela de listagem/edição de Saída Excluída (GENUS.DELSAIDA —
 * histórico/snapshot de um cabeçalho de nota fiscal de saída no momento em
 * que foi excluído no GENUS). Ver docstring do model `SaidaExcluida` em
 * backend/models/tabelas.py — análoga a `ProdutoExcluido`/GENUS.DEL_PRODUTO
 * e a `ItemSaidaExcluido`/GENUS.DELSAILAN, só que para o cabeçalho de
 * `Saida`/GENUS.SAIDA.
 */
export default function SaidaExcluidaWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/saidas-excluidas', FORM_VAZIO_SAIDA_EXCLUIDA, normalizarSaidaExcluida);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Saídas Excluídas (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={640}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaSaidaExcluida', { onSalvar: recarregar })}
          placeholder="Buscar por chave NF-e, série ou CPF/CNPJ..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Doc', 'Série', 'Cliente (cód.)', 'Emissão', 'Total', 'Data Exclusão']}
            campos={['codigo', 'doc', 'serie', 'cod_cliente', 'emissao', 'total', 'dt_exclusao']}
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
                <strong>{editandoId ? 'Editar Saída Excluída' : 'Nova Saída Excluída'}</strong>
              </div>
              <div className="modal-body">
                <CamposSaidaExcluida form={form} setForm={setForm} />
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

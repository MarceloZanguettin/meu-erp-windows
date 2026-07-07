import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposRequisicaoProduto from './CamposRequisicaoProduto.jsx';
import { FORM_VAZIO_REQUISICAO_PRODUTO, normalizarRequisicaoProduto } from './camposRequisicaoProduto.js';

/**
 * Janela de listagem/edição de Item de Requisição de Material (GENUS.
 * REQUISICAOPRODUTO). Ver docstring do model `RequisicaoProduto` em
 * backend/models/tabelas.py: elo do meio da cadeia REQUISICAOMATERIA
 * (cabeçalho, `RequisicaoMateriaWindow`) -> REQUISICAOPRODUTO (este item:
 * produto, quantidade solicitada/produzida, custo, diferença) ->
 * REQUISICAOMATERIAETAPAS (etapas de entrega,
 * `RequisicaoMateriaEtapasWindow`, ligada a este item via
 * requisicao_produto_id/cod_req_produto). Mesmo padrão de
 * ComprasWindow/requisicaoMateria/RequisicaoMateriaWindow.jsx e
 * ComprasWindow/requisicaoMateriaEtapas/RequisicaoMateriaEtapasWindow.jsx.
 */
export default function RequisicaoProdutoWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/requisicao-produtos', FORM_VAZIO_REQUISICAO_PRODUTO, normalizarRequisicaoProduto);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Requisição de Material - Item (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1000} altura={640}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaRequisicaoProduto', { onSalvar: recarregar })}
          placeholder="Buscar por código, cód. requisição ou cód. produto..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Cód. Requisição', 'Cód. Produto', 'Qtde', 'Qtde Produzida', 'Status']}
            campos={['codigo', 'cod_requisicao', 'cod_produto', 'qtde', 'qtde_produzida', 'status']}
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
            <div className="modal-content" style={{ width: '90vw', maxWidth: '950px', maxHeight: '85vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Item de Requisição' : 'Novo Item de Requisição'}</strong>
              </div>
              <div className="modal-body">
                <CamposRequisicaoProduto form={form} setForm={setForm} />
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

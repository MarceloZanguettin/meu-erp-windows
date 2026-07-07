import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposCentroCustoExcluido from './CamposCentroCustoExcluido.jsx';
import { FORM_VAZIO_CENTRO_CUSTO_EXCLUIDO, normalizarCentroCustoExcluido } from './camposCentroCustoExcluido.js';

/**
 * Janela de listagem/edição de Centro de Custo Excluído (GENUS.DEL_CENTROCUSTO
 * — histórico/snapshot de uma linha de CentroCusto/GENUS.CENTROCUSTO no
 * momento em que foi excluída no GENUS). Ver docstring do model
 * `CentroCustoExcluido` em backend/models/tabelas.py — análoga a
 * `ProdutoExcluido`/GENUS.DEL_PRODUTO e a `SaidaExcluida`/GENUS.DELSAIDA, só
 * que para a extensão de produto por empresa/filial
 * (`CentroCusto`/GENUS.CENTROCUSTO).
 */
export default function CentroCustoExcluidoWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/centros-custo-excluidos', FORM_VAZIO_CENTRO_CUSTO_EXCLUIDO, normalizarCentroCustoExcluido);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Centros de Custo Excluídos (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={640}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novoCentroCustoExcluido', { onSalvar: recarregar })}
          placeholder="Buscar por cód. produto, placa ou chassi..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Cód. Produto', 'Cód. Empresa', 'Custo', 'Venda', 'Placa', 'Chassi']}
            campos={['cod_produto', 'cod_empresa', 'custo', 'venda', 'placa', 'chassi']}
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
                <strong>{editandoId ? 'Editar Centro de Custo Excluído' : 'Novo Centro de Custo Excluído'}</strong>
              </div>
              <div className="modal-body">
                <CamposCentroCustoExcluido form={form} setForm={setForm} />
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

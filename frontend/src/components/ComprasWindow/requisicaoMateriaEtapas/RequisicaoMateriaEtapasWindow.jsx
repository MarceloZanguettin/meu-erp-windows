import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposRequisicaoMateriaEtapas from './CamposRequisicaoMateriaEtapas.jsx';
import { FORM_VAZIO_REQUISICAO_MATERIA_ETAPAS, normalizarRequisicaoMateriaEtapas } from './camposRequisicaoMateriaEtapas.js';

/**
 * Janela de listagem/edição de Etapa de Requisição de Material (GENUS.
 * REQUISICAOMATERIAETAPAS — etapa/apontamento parcial de um item de
 * requisição de material). Ver docstring do model
 * `RequisicaoMateriaEtapas` em backend/models/tabelas.py: cada linha é uma
 * entrega/produção/lote lançado em uma data específica (quantidade + custo)
 * que compõe o total acumulado do item de requisição (GENUS.
 * REQUISICAOPRODUTO, `cod_req_produto` — ainda sem model/janela dedicados
 * neste ERP), primeiro model do grupo GENUS REQUISICAOMATERIA*
 * reconhecido neste ERP.
 */
export default function RequisicaoMateriaEtapasWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/requisicao-materia-etapas', FORM_VAZIO_REQUISICAO_MATERIA_ETAPAS, normalizarRequisicaoMateriaEtapas);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Etapas de Requisição de Material (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={800} altura={560}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaRequisicaoMateriaEtapas', { onSalvar: recarregar })}
          placeholder="Buscar por código ou cód. item de requisição..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Cód. Item Requisição', 'Quantidade', 'Data Entrada', 'Custo Total']}
            campos={['codigo', 'cod_req_produto', 'qtde', 'dt_entrada', 'custo_total']}
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
            <div className="modal-content" style={{ width: '90vw', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Etapa de Requisição' : 'Nova Etapa de Requisição'}</strong>
              </div>
              <div className="modal-body">
                <CamposRequisicaoMateriaEtapas form={form} setForm={setForm} />
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

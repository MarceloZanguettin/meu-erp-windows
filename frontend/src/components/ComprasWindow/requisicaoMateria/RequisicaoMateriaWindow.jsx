import React from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../../shared/TabelaCrud.jsx';
import BarraFerramentas from '../../shared/BarraFerramentas.jsx';
import Portal from '../../shared/Portal.jsx';
import { useCrud } from '../../../hooks/useCrud.js';
import CamposRequisicaoMateria from './CamposRequisicaoMateria.jsx';
import { FORM_VAZIO_REQUISICAO_MATERIA, normalizarRequisicaoMateria } from './camposRequisicaoMateria.js';

/**
 * Janela de listagem/edição do cabeçalho da Requisição de Material (GENUS.
 * REQUISICAOMATERIA). Ver docstring do model `RequisicaoMateria` em
 * backend/models/tabelas.py: cabeçalho — empresa, emissão, tipo, status,
 * lote, solicitante (cliente/funcionário), previsão de entrega/execução e
 * equipamento/tanque/voltagem — do qual GENUS.REQUISICAOPRODUTO (item da
 * requisição, ainda sem model dedicado neste ERP) é filho, e que por sua
 * vez é pai de `RequisicaoMateriaEtapas`/GENUS.REQUISICAOMATERIAETAPAS (já
 * reconhecida nesta mesma sessão). Mesmo padrão de
 * ComprasWindow/requisicaoMateriaEtapas/RequisicaoMateriaEtapasWindow.jsx e
 * ComprasWindow/cotacao/CotacaoPrecoWindow.jsx.
 */
export default function RequisicaoMateriaWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/requisicao-materia', FORM_VAZIO_REQUISICAO_MATERIA, normalizarRequisicaoMateria);

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Requisição de Material - Cabeçalho (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={660}>
      <div className="produto-busca-container">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaRequisicaoMateria', { onSalvar: recarregar })}
          placeholder="Buscar por código, cód. cliente, lote, local de entrega ou equipamento..."
        />
        {loading ? (
          <div className="produto-busca-status">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Cliente (cód.)', 'Emissão', 'Status', 'Lote', 'Previsão']}
            campos={['codigo', 'cod_cliente', 'emissao', 'status', 'lote', 'dt_previsao']}
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
                <strong>{editandoId ? 'Editar Requisição de Material' : 'Nova Requisição de Material'}</strong>
              </div>
              <div className="modal-body">
                <CamposRequisicaoMateria form={form} setForm={setForm} />
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

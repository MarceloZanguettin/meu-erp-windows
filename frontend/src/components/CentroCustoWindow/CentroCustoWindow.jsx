import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposCentroCusto from './CamposCentroCusto.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarCentroCusto } from './services/centroCustoService.js';
import './CentroCustoWindow.css';

/**
 * Janela de listagem/edição do Centro de Custo (GENUS.CENTROCUSTO).
 *
 * Reconhece todos os campos migrados da tabela GENUS CENTROCUSTO — ver
 * docstring do model CentroCusto em backend/models/tabelas.py para o
 * detalhe de que essa tabela GENUS não é o "centro de custo" contábil
 * (esse continua sendo gerenciado em Cadastro > Tabelas Auxiliares).
 */
export default function CentroCustoWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/cadastros/centros-custo', FORM_VAZIO, normalizarCentroCusto);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    i.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    i.codigo?.toLowerCase().includes(busca.toLowerCase()) ||
    i.cod_produto?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => {
    if (campo === 'ativo') return item.ativo ? 'Sim' : 'Não';
    return item[campo] ?? '-';
  };

  return (
    <JanelaBase id={id} titulo="Centro de Custo (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={640}>
      <div className="cc-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novoCentroCusto', { onSalvar: recarregar })}
          placeholder="Buscar por código, nome ou cód. produto..."
        />
        {loading ? (
          <div className="cc-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Nome', 'Cód. Produto', 'Cód. Empresa', 'Venda', 'Ativo']}
            campos={['codigo', 'nome', 'cod_produto', 'cod_empresa', 'venda', 'ativo']}
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
            <div className="modal-content cc-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}</strong>
              </div>
              <div className="modal-body cc-modal-body">
                <CamposCentroCusto form={form} setForm={setForm} />
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

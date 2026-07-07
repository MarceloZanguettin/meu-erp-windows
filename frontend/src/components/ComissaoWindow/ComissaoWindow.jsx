import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposComissao from './CamposComissao.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarComissao } from './services/comissaoService.js';
import './ComissaoWindow.css';

/**
 * Janela de listagem/edição de Comissões (GENUS.COMISSAO).
 *
 * Reconhece todos os campos migrados da tabela GENUS COMISSAO — ver
 * docstring do model Comissao em backend/models/tabelas.py para o detalhe
 * de que cada linha representa o cálculo/lançamento de comissão de um
 * representante sobre uma saída/nota fiscal específica.
 */
export default function ComissaoWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/comissoes', FORM_VAZIO, normalizarComissao);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    String(i.codigo ?? '').includes(busca) ||
    String(i.nota_fiscal ?? '').includes(busca) ||
    i.tipo_comissao?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Comissões (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={900} altura={600}>
      <div className="cm-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaComissao', { onSalvar: recarregar })}
          placeholder="Buscar por código, nota fiscal ou tipo..."
        />
        {loading ? (
          <div className="cm-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Nota Fiscal', 'Valor Comissão', 'Total', 'Tipo']}
            campos={['codigo', 'nota_fiscal', 'valor_comissao', 'total', 'tipo_comissao']}
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
            <div className="modal-content cm-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Comissão' : 'Nova Comissão'}</strong>
              </div>
              <div className="modal-body cm-modal-body">
                <CamposComissao form={form} setForm={setForm} />
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

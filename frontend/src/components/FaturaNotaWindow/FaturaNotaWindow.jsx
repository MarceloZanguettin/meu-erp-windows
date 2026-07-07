import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposFaturaNota from './CamposFaturaNota.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarFaturaNota } from './services/faturaNotaService.js';
import './FaturaNotaWindow.css';

/**
 * Janela de listagem/edição do Vínculo Fatura-Nota Fiscal (GENUS.FATURANOTA).
 *
 * Reconhece todos os campos migrados da tabela GENUS FATURANOTA — ver
 * docstring do model FaturaNota em backend/models/tabelas.py para o detalhe
 * de que esta tabela é o vínculo N:N entre uma fatura (agrupamento de
 * título(s) a receber num boleto/fatura só) e a(s) nota(s) fiscal(is) de
 * saída (CODSAIDA) que a compõem.
 */
export default function FaturaNotaWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/faturas-nota', FORM_VAZIO, normalizarFaturaNota);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    String(i.cod_fatura ?? '').includes(busca) ||
    String(i.cod_saida ?? '').includes(busca)
  );

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Vínculo Fatura-Nota Fiscal (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={900} altura={600}>
      <div className="fn-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novoFaturaNota', { onSalvar: recarregar })}
          placeholder="Buscar por cód. fatura ou cód. saída..."
        />
        {loading ? (
          <div className="fn-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Cód. Empresa', 'Cód. Fatura', 'Cód. Saída', 'Saída (ID interno)']}
            campos={['cod_empresa', 'cod_fatura', 'cod_saida', 'saida_id']}
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
            <div className="modal-content fn-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Vínculo Fatura-Nota' : 'Novo Vínculo Fatura-Nota'}</strong>
              </div>
              <div className="modal-body fn-modal-body">
                <CamposFaturaNota form={form} setForm={setForm} />
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

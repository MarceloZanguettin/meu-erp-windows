import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposFatura from './CamposFatura.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarFatura } from './services/faturaService.js';
import './FaturaWindow.css';

/**
 * Janela de listagem/edição da Fatura (GENUS.FATURA).
 *
 * Reconhece todos os campos migrados da tabela GENUS FATURA — ver
 * docstring do model Fatura em backend/models/tabelas.py para o detalhe de
 * que esta é a tabela mestre do agrupamento de título(s)/nota(s) fiscal(is)
 * de saída faturados para um cliente (lado de contas a receber),
 * referenciada por FATURANOTA.CODFATURA (ver FaturaNotaWindow).
 */
export default function FaturaWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/faturas', FORM_VAZIO, normalizarFatura);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    String(i.codigo ?? '').includes(busca) ||
    String(i.cod_cadastro ?? '').includes(busca) ||
    i.cod_cond_pagto?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => {
    if (campo === 'emissao' && item.emissao) return String(item.emissao).slice(0, 10);
    return item[campo] ?? '-';
  };

  return (
    <JanelaBase id={id} titulo="Faturas (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={900} altura={600}>
      <div className="fat-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaFatura', { onSalvar: recarregar })}
          placeholder="Buscar por código, cadastro ou condição de pagamento..."
        />
        {loading ? (
          <div className="fat-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Cód. Empresa', 'Emissão', 'Cond. Pagto.', 'Cód. Cadastro', 'Cód. Carteira']}
            campos={['codigo', 'cod_empresa', 'emissao', 'cod_cond_pagto', 'cod_cadastro', 'cod_carteira']}
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
            <div className="modal-content fat-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Fatura' : 'Nova Fatura'}</strong>
              </div>
              <div className="modal-body fat-modal-body">
                <CamposFatura form={form} setForm={setForm} />
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

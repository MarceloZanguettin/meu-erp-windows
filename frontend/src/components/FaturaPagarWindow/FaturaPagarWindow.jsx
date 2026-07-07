import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposFaturaPagar from './CamposFaturaPagar.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarFaturaPagar } from './services/faturaPagarService.js';
import './FaturaPagarWindow.css';

/**
 * Janela de listagem/edição da FaturaPagar (GENUS.FATURAPAGAR).
 *
 * Reconhece todos os campos migrados da tabela GENUS FATURAPAGAR — ver
 * docstring do model FaturaPagar em backend/models/tabelas.py para o
 * detalhe de que esta é a tabela mestre do agrupamento de título(s)/nota(s)
 * fiscal(is) de compra (entrada) faturados para um fornecedor (lado de
 * contas a pagar, análoga a Fatura/GENUS.FATURA no lado de contas a
 * receber), referenciada por FATURANOTAPAGAR.CODFATURAPAGAR (ver
 * FaturaNotaPagarWindow).
 */
export default function FaturaPagarWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/faturas-pagar', FORM_VAZIO, normalizarFaturaPagar);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    String(i.codigo ?? '').includes(busca) ||
    String(i.doc ?? '').includes(busca) ||
    String(i.cod_cadastro ?? '').includes(busca) ||
    i.cod_cond_pagto?.toLowerCase().includes(busca.toLowerCase()) ||
    i.obs?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => {
    if ((campo === 'emissao' || campo === 'data_base') && item[campo]) return String(item[campo]).slice(0, 10);
    return item[campo] ?? '-';
  };

  return (
    <JanelaBase id={id} titulo="Faturas a Pagar (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={960} altura={620}>
      <div className="fatpag-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaFaturaPagar', { onSalvar: recarregar })}
          placeholder="Buscar por código, documento, cadastro, condição de pagamento ou observação..."
        />
        {loading ? (
          <div className="fatpag-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Cód. Empresa', 'Doc.', 'Emissão', 'Data-Base', 'Cond. Pagto.', 'Cód. Cadastro', 'Cód. Carteira']}
            campos={['codigo', 'cod_empresa', 'doc', 'emissao', 'data_base', 'cod_cond_pagto', 'cod_cadastro', 'cod_carteira']}
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
            <div className="modal-content fatpag-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Fatura a Pagar' : 'Nova Fatura a Pagar'}</strong>
              </div>
              <div className="modal-body fatpag-modal-body">
                <CamposFaturaPagar form={form} setForm={setForm} />
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

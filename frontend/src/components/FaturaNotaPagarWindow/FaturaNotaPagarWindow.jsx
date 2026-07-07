import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposFaturaNotaPagar from './CamposFaturaNotaPagar.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarFaturaNotaPagar } from './services/faturaNotaPagarService.js';
import './FaturaNotaPagarWindow.css';

/**
 * Janela de listagem/edição do Vínculo Fatura-Nota Pagar (GENUS.FATURANOTAPAGAR).
 *
 * Reconhece todos os campos migrados da tabela GENUS FATURANOTAPAGAR — ver
 * docstring do model FaturaNotaPagar em backend/models/tabelas.py para o
 * detalhe de que esta tabela vincula uma fatura a pagar (agrupamento de
 * título(s) a pagar num boleto/pagamento só — GENUS.FATURAPAGAR, ainda não
 * modelada) com a(s) nota(s) fiscal(is) de compra/entrada (TIPODOCENTRADA/
 * DOCENTRADA/SERIEENTRADA/CODFORNECEDORENTRADA) que a compõem, e com o
 * título original em PAGAR (CODPAGAR/CODEMPRESAPAGAR, já reconhecida neste
 * ERP como ContaPagar).
 */
export default function FaturaNotaPagarWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/faturas-nota-pagar', FORM_VAZIO, normalizarFaturaNotaPagar);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    String(i.codigo ?? '').includes(busca) ||
    String(i.cod_fatura_pagar ?? '').includes(busca) ||
    String(i.cod_pagar ?? '').includes(busca) ||
    i.duplicata?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Vínculo Fatura-Nota Pagar (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={960} altura={640}>
      <div className="fnp-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novoFaturaNotaPagar', { onSalvar: recarregar })}
          placeholder="Buscar por código, cód. fatura a pagar, cód. pagar ou duplicata..."
        />
        {loading ? (
          <div className="fnp-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Código', 'Cód. Fatura a Pagar', 'Cód. Pagar', 'Duplicata', 'Valor', 'Vencimento']}
            campos={['codigo', 'cod_fatura_pagar', 'cod_pagar', 'duplicata', 'valor', 'vencimento']}
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
            <div className="modal-content fnp-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Vínculo Fatura-Nota Pagar' : 'Novo Vínculo Fatura-Nota Pagar'}</strong>
              </div>
              <div className="modal-body fnp-modal-body">
                <CamposFaturaNotaPagar form={form} setForm={setForm} />
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

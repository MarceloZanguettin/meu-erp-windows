import React from 'react';

/**
 * Campos do formulário de Vínculo Fatura-Nota Pagar (GENUS.FATURANOTAPAGAR) —
 * reutilizado tanto pelo modal de edição em FaturaNotaPagarWindow quanto pela
 * janela de criação NovoFaturaNotaPagarWindow, para os dois ficarem sempre em
 * sincronia.
 *
 * FATURANOTAPAGAR espelha praticamente todos os campos de PAGAR (já
 * reconhecida neste ERP como ContaPagar) — ver docstring do model
 * FaturaNotaPagar em backend/models/tabelas.py para o detalhe completo dos
 * dois grupos de campos que não existem em PAGAR: o vínculo com a nota
 * fiscal de compra/entrada de origem (TIPODOCENTRADA/DOCENTRADA/SERIEENTRADA/
 * CODFORNECEDORENTRADA) e o vínculo de volta com o título original em PAGAR
 * (CODPAGAR/CODEMPRESAPAGAR).
 */
export default function CamposFaturaNotaPagar({ form, setForm }) {
  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="fnp-secao">Vínculo com o título a pagar (ContaPagar)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Conta a Pagar (ID interno)</label>
          <input type="number" value={form.conta_pagar_id} onChange={set('conta_pagar_id')} />
        </div>
        <div className="form-group">
          <label>Cód. Empresa</label>
          <input type="number" value={form.cod_empresa} onChange={set('cod_empresa')} />
        </div>
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={form.codigo} onChange={set('codigo')} />
        </div>
      </div>

      <div className="fnp-secao">Título a pagar (espelhado de GENUS.PAGAR)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Tipo Doc.</label>
          <input maxLength={1} value={form.tipo_doc} onChange={set('tipo_doc')} />
        </div>
        <div className="form-group">
          <label>Doc.</label>
          <input type="number" value={form.doc} onChange={set('doc')} />
        </div>
        <div className="form-group">
          <label>Série</label>
          <input maxLength={4} value={form.serie} onChange={set('serie')} />
        </div>
        <div className="form-group">
          <label>Cód. Fornecedor</label>
          <input type="number" value={form.cod_fornecedor} onChange={set('cod_fornecedor')} />
        </div>
        <div className="form-group">
          <label>Emissão</label>
          <input type="date" value={form.emissao} onChange={set('emissao')} />
        </div>
        <div className="form-group">
          <label>Vencimento</label>
          <input type="date" value={form.vencimento} onChange={set('vencimento')} />
        </div>
        <div className="form-group">
          <label>Valor</label>
          <input type="number" step="0.01" value={form.valor} onChange={set('valor')} />
        </div>
        <div className="form-group">
          <label>Parcela</label>
          <input maxLength={7} value={form.parcela} onChange={set('parcela')} />
        </div>
        <div className="form-group">
          <label>Data Pagamento</label>
          <input type="date" value={form.dt_pago} onChange={set('dt_pago')} />
        </div>
        <div className="form-group">
          <label>Valor Pago</label>
          <input type="number" step="0.01" value={form.valor_pago} onChange={set('valor_pago')} />
        </div>
        <div className="form-group">
          <label>Cód. Conta</label>
          <input type="number" value={form.cod_conta} onChange={set('cod_conta')} />
        </div>
        <div className="form-group">
          <label>Cód. Histórico</label>
          <input maxLength={12} value={form.cod_historico} onChange={set('cod_historico')} />
        </div>
        <div className="form-group form-group-full">
          <label>Observação</label>
          <input maxLength={70} value={form.obs} onChange={set('obs')} />
        </div>
        <div className="form-group">
          <label>Cód. Empresa Pag.</label>
          <input type="number" value={form.cod_empresa_pag} onChange={set('cod_empresa_pag')} />
        </div>
        <div className="form-group">
          <label>Duplicata</label>
          <input maxLength={15} value={form.duplicata} onChange={set('duplicata')} />
        </div>
      </div>

      <div className="fnp-secao">Boleto / Controle</div>
      <div className="form-grid-2">
        <div className="form-group form-group-full">
          <label>Linha Digitável</label>
          <input maxLength={60} value={form.linha_digitavel} onChange={set('linha_digitavel')} />
        </div>
        <div className="form-group">
          <label>Previsão</label>
          <input maxLength={1} value={form.previsao} onChange={set('previsao')} />
        </div>
        <div className="form-group">
          <label>Cód. Controle</label>
          <input type="number" value={form.cod_controle} onChange={set('cod_controle')} />
        </div>
        <div className="form-group">
          <label>Cód. Controle Empresa</label>
          <input type="number" value={form.cod_controle_empresa} onChange={set('cod_controle_empresa')} />
        </div>
        <div className="form-group">
          <label>Cód. Controle Tipo</label>
          <input maxLength={1} value={form.cod_controle_tipo} onChange={set('cod_controle_tipo')} />
        </div>
        <div className="form-group">
          <label>Núm. Doc.</label>
          <input maxLength={20} value={form.num_doc} onChange={set('num_doc')} />
        </div>
        <div className="form-group">
          <label>Valor Documento</label>
          <input type="number" step="0.01" value={form.valor_documento} onChange={set('valor_documento')} />
        </div>
        <div className="form-group">
          <label>Conta Cheque</label>
          <input type="number" value={form.conta_cheque} onChange={set('conta_cheque')} />
        </div>
        <div className="form-group">
          <label>Doc. Cheque</label>
          <input type="number" value={form.doc_cheque} onChange={set('doc_cheque')} />
        </div>
        <div className="form-group">
          <label>Cód. Frete</label>
          <input type="number" value={form.cod_frete} onChange={set('cod_frete')} />
        </div>
        <div className="form-group">
          <label>Parc. Real</label>
          <input maxLength={1} value={form.parc_real} onChange={set('parc_real')} />
        </div>
        <div className="form-group">
          <label>Cód. Empresa Entrada</label>
          <input type="number" value={form.cod_empresa_entrada} onChange={set('cod_empresa_entrada')} />
        </div>
        <div className="form-group">
          <label>Doc. Parcela</label>
          <input maxLength={15} value={form.doc_parcela} onChange={set('doc_parcela')} />
        </div>
        <div className="form-group">
          <label>Cód. Carteira</label>
          <input type="number" value={form.cod_carteira} onChange={set('cod_carteira')} />
        </div>
        <div className="form-group">
          <label>Cód. Fixo</label>
          <input type="number" value={form.cod_fixo} onChange={set('cod_fixo')} />
        </div>
        <div className="form-group">
          <label>Valor Crédito Fornecedor</label>
          <input type="number" step="0.01" value={form.valor_credito_fornecedor} onChange={set('valor_credito_fornecedor')} />
        </div>
      </div>

      <div className="fnp-secao">Fatura a Pagar (GENUS.FATURAPAGAR)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Fatura a Pagar</label>
          <input type="number" value={form.cod_fatura_pagar} onChange={set('cod_fatura_pagar')} />
        </div>
        <div className="form-group">
          <label>Cód. Fatura a Pagar (Anterior)</label>
          <input type="number" value={form.cod_fatura_pagar_ant} onChange={set('cod_fatura_pagar_ant')} />
        </div>
        <div className="form-group">
          <label>Cód. Empresa Fat. (Anterior)</label>
          <input type="number" value={form.cod_empresa_fat_ant} onChange={set('cod_empresa_fat_ant')} />
        </div>
      </div>

      <div className="fnp-secao">Nota Fiscal de Compra/Entrada de Origem</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Tipo Doc. Entrada</label>
          <input maxLength={1} value={form.tipo_doc_entrada} onChange={set('tipo_doc_entrada')} />
        </div>
        <div className="form-group">
          <label>Doc. Entrada</label>
          <input type="number" value={form.doc_entrada} onChange={set('doc_entrada')} />
        </div>
        <div className="form-group">
          <label>Série Entrada</label>
          <input maxLength={4} value={form.serie_entrada} onChange={set('serie_entrada')} />
        </div>
        <div className="form-group">
          <label>Cód. Fornecedor Entrada</label>
          <input type="number" value={form.cod_fornecedor_entrada} onChange={set('cod_fornecedor_entrada')} />
        </div>
      </div>

      <div className="fnp-secao">Título original em PAGAR</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Pagar</label>
          <input type="number" value={form.cod_pagar} onChange={set('cod_pagar')} />
        </div>
        <div className="form-group">
          <label>Cód. Empresa Pagar</label>
          <input type="number" value={form.cod_empresa_pagar} onChange={set('cod_empresa_pagar')} />
        </div>
      </div>

      <div className="fnp-secao">Auditoria (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Alteração</label>
          <input type="number" value={form.cod_alteracao} onChange={set('cod_alteracao')} />
        </div>
        <div className="form-group">
          <label>Hora Alteração</label>
          <input maxLength={8} value={form.hora_alteracao_genus} onChange={set('hora_alteracao_genus')} />
        </div>
        <div className="form-group">
          <label>Data Alteração</label>
          <input type="date" value={form.data_alteracao_genus} onChange={set('data_alteracao_genus')} />
        </div>
      </div>
    </>
  );
}

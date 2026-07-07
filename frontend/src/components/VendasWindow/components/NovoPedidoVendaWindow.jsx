import React, { useState, useEffect, useMemo } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import { salvarPedidoVenda, fetchFormasPagamento, fetchRepresentantes } from '../services/vendasService.js';
import '../VendasWindow.css';

const FORM_VAZIO = {
  nome_cliente: '', data_entrega_prevista: '', forma_pagamento_id: '', representante_id: '', desconto_percentual: '0', observacao: '',
  // Dados adicionais (GENUS.PEDIDO) — ver models/tabelas.py::PedidoVenda
  cod_empresa: '', codigo_genus: '', doc: '', serie: '', cod_cliente: '', cod_representante: '', cod_cond_pagto: '', cod_chave: '',
  cod_cfop: '', cod_cfop2: '', icms_base: '', icms_valor: '', icms_base_subst: '', icms_valor_subst: '', ipi_valor: '', credito_icms: '',
  tipo_nf: '', tipo_cliente: '', cte: '', numero_nf: '', total_nf: '',
  valor_produtos: '', quantidade_genus: '', peso_bruto_genus: '', peso_liquido_genus: '', valor_unit: '', qtde_kg: '', valor_kg: '',
  frete: '', seguro: '', outras_despesas: '', cod_transportador: '', frete_conta: '', tipo_frete: '', perc_frete: '', valor_frete: '',
  frete_interno: '', tipo_transporte: '', local_entrega: '', voltagem: '',
  desc_acres: '', descto1: '', descto2: '', descto3: '', descto4: '', descto5: '', perc_desconto: '', desconto_interno: '', perc_divisao: '', comissao: '',
  avista_prazo: '', vencimento: '', cod_contas: '', cod_carteira: '', cod_tabela_preco: '', cod_tipo_venda: '', lote: '',
  tipo_pedido: '', tipo: '', tipo_pre_pedido: '', cod_tipo_ocorrencia: '', status_genus: '', excluido: '', telemarketing: '', contato: '',
  liberado: '', cod_liberacao: '', dt_liberacao: '', cod_aprovacao: '', dt_aprovacao: '', motivo_bloqueio: '', antes_bloqueado: '',
  orcamento_negado: '', motivo_orcamento_negado: '', cod_func_orcamento_negado: '',
  liberado_para_producao: '', producao_etapas: '', cod_movto_grade: '', cod_agregado: '', cod_empresa_saida_prod: '', codigo_saida_prod: '', doc_saida_prod: '',
  faturado: '', obs_interna: '', pedido_representante: '',
  cod_alteracao: '', hora_alteracao_genus: '', data_alteracao_genus: '',
};

// Campos GENUS.PEDIDO que são inteiros — precisam de parseInt (ou null) antes de enviar
const CAMPOS_GENUS_INT = [
  'cod_empresa', 'codigo_genus', 'doc', 'cod_cliente', 'cod_representante', 'cod_chave',
  'cte', 'numero_nf', 'cod_transportador', 'cod_contas', 'cod_carteira', 'cod_tabela_preco', 'cod_tipo_venda',
  'cod_tipo_ocorrencia', 'cod_liberacao', 'cod_aprovacao', 'cod_func_orcamento_negado',
  'cod_movto_grade', 'cod_agregado', 'cod_empresa_saida_prod', 'codigo_saida_prod', 'cod_alteracao', 'voltagem',
];
// Campos GENUS.PEDIDO do tipo float — vazio deve virar null
const CAMPOS_GENUS_FLOAT = [
  'icms_base', 'icms_valor', 'icms_base_subst', 'icms_valor_subst', 'ipi_valor', 'credito_icms', 'total_nf',
  'valor_produtos', 'valor_unit', 'qtde_kg', 'valor_kg', 'frete', 'seguro', 'outras_despesas', 'perc_frete', 'valor_frete',
  'frete_interno', 'desc_acres', 'descto1', 'descto2', 'descto3', 'descto4', 'descto5', 'perc_desconto',
  'desconto_interno', 'perc_divisao', 'comissao',
];
// Campos GENUS.PEDIDO do tipo data — vazio deve virar null
const CAMPOS_GENUS_DATA = ['vencimento', 'dt_liberacao', 'dt_aprovacao', 'data_alteracao_genus'];
const ITEM_VAZIO = { descricao: '', quantidade: '', preco_unitario: '', unidade: '' };

const fmtMoeda = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function NovoPedidoVendaWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });
  const [itens, setItens] = useState([{ ...ITEM_VAZIO }]);
  const [formasPag, setFormasPag] = useState([]);
  const [representantes, setRepresentantes] = useState([]);

  useEffect(() => {
    Promise.all([fetchFormasPagamento(), fetchRepresentantes()]).then(([fp, rep]) => {
      setFormasPag(fp);
      setRepresentantes(rep);
    }).catch(console.error);
  }, []);

  const addItem = () => setItens(prev => [...prev, { ...ITEM_VAZIO }]);
  const remItem = (i) => setItens(prev => prev.filter((_, idx) => idx !== i));
  const setItem = (i, field, val) => setItens(prev => {
    const novo = [...prev];
    novo[i] = { ...novo[i], [field]: val };
    return novo;
  });

  const subtotal = useMemo(() =>
    itens.reduce((s, it) => s + (parseFloat(it.quantidade) || 0) * (parseFloat(it.preco_unitario) || 0), 0),
    [itens]
  );
  const desconto = (parseFloat(form.desconto_percentual) || 0) / 100;
  const total = subtotal * (1 - desconto);

  const salvar = async () => {
    const payload = {
      ...form,
      forma_pagamento_id: form.forma_pagamento_id ? parseInt(form.forma_pagamento_id) : null,
      representante_id: form.representante_id ? parseInt(form.representante_id) : null,
      desconto_percentual: parseFloat(form.desconto_percentual) || 0,
      itens: itens.map(it => ({
        ...it,
        quantidade: parseFloat(it.quantidade) || 0,
        preco_unitario: parseFloat(it.preco_unitario) || 0,
      })),
    };
    CAMPOS_GENUS_INT.forEach(campo => {
      payload[campo] = form[campo] !== '' && form[campo] != null ? parseInt(form[campo], 10) : null;
    });
    CAMPOS_GENUS_FLOAT.forEach(campo => {
      payload[campo] = form[campo] !== '' && form[campo] != null ? parseFloat(form[campo]) : null;
    });
    CAMPOS_GENUS_DATA.forEach(campo => {
      payload[campo] = form[campo] || null;
    });
    await salvarPedidoVenda(payload, null);
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Pedido de Venda" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={950} altura={600} minLargura={640} minAltura={420}
      salvar={salvar}
    >
      <div className="form-grid-3">
        <div className="form-group form-group-full">
          <label>Cliente</label>
          <input value={form.nome_cliente} onChange={e => setForm({ ...form, nome_cliente: e.target.value })} placeholder="Nome do cliente" />
        </div>
        <div className="form-group">
          <label>Entrega Prevista</label>
          <input type="date" value={form.data_entrega_prevista} onChange={e => setForm({ ...form, data_entrega_prevista: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Forma de Pagamento</label>
          <select value={form.forma_pagamento_id} onChange={e => setForm({ ...form, forma_pagamento_id: e.target.value })}>
            <option value="">Selecione...</option>
            {formasPag.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Representante</label>
          <select value={form.representante_id} onChange={e => setForm({ ...form, representante_id: e.target.value })}>
            <option value="">Nenhum</option>
            {representantes.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Desconto (%)</label>
          <input type="number" step="0.01" min="0" max="100" value={form.desconto_percentual} onChange={e => setForm({ ...form, desconto_percentual: e.target.value })} />
        </div>
        <div className="form-group form-group-full">
          <label>Observação</label>
          <input value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
        </div>
      </div>

      <div className="vendas-itens-header">
        <span>Itens do Pedido</span>
        <button type="button" className="btn-adicionar-item" onClick={addItem}>+ Item</button>
      </div>

      <div className="vendas-itens-tabela">
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th style={{ width: 70 }}>Qtd</th>
              <th style={{ width: 70 }}>Unidade</th>
              <th style={{ width: 110 }}>Preço Un.</th>
              <th style={{ width: 110 }}>Subtotal</th>
              <th style={{ width: 32 }}></th>
            </tr>
          </thead>
          <tbody>
            {itens.map((it, i) => {
              const sub = (parseFloat(it.quantidade) || 0) * (parseFloat(it.preco_unitario) || 0);
              return (
                <tr key={i}>
                  <td><input value={it.descricao} onChange={e => setItem(i, 'descricao', e.target.value)} placeholder="Descrição" /></td>
                  <td><input type="number" min="0" value={it.quantidade} onChange={e => setItem(i, 'quantidade', e.target.value)} /></td>
                  <td><input value={it.unidade} onChange={e => setItem(i, 'unidade', e.target.value)} placeholder="un, kg..." /></td>
                  <td><input type="number" step="0.01" min="0" value={it.preco_unitario} onChange={e => setItem(i, 'preco_unitario', e.target.value)} /></td>
                  <td className="vendas-subtotal">{fmtMoeda(sub)}</td>
                  <td><button type="button" className="btn-remover-item" onClick={() => remItem(i)} disabled={itens.length === 1}>✕</button></td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {desconto > 0 && (
              <>
                <tr>
                  <td colSpan={4} className="vendas-total-label">Subtotal</td>
                  <td className="vendas-subtotal-valor">{fmtMoeda(subtotal)}</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={4} className="vendas-total-label">Desconto ({form.desconto_percentual}%)</td>
                  <td className="vendas-desconto-valor">-{fmtMoeda(subtotal * desconto)}</td>
                  <td></td>
                </tr>
              </>
            )}
            <tr>
              <td colSpan={4} className="vendas-total-label">Total</td>
              <td className="vendas-total-valor">{fmtMoeda(total)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <details className="vendas-genus-detalhes">
        <summary>Dados adicionais (GENUS)</summary>
        <div className="form-grid-3">
          <div className="form-group"><label>Cód. Empresa</label><input type="number" value={form.cod_empresa} onChange={e => setForm({ ...form, cod_empresa: e.target.value })} /></div>
          <div className="form-group"><label>Código (GENUS)</label><input type="number" value={form.codigo_genus} onChange={e => setForm({ ...form, codigo_genus: e.target.value })} /></div>
          <div className="form-group"><label>Doc.</label><input type="number" value={form.doc} onChange={e => setForm({ ...form, doc: e.target.value })} /></div>
          <div className="form-group"><label>Série</label><input maxLength={4} value={form.serie} onChange={e => setForm({ ...form, serie: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Cliente (GENUS)</label><input type="number" value={form.cod_cliente} onChange={e => setForm({ ...form, cod_cliente: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Representante</label><input type="number" value={form.cod_representante} onChange={e => setForm({ ...form, cod_representante: e.target.value })} /></div>
          <div className="form-group"><label>Cond. Pagamento (cód.)</label><input maxLength={5} value={form.cod_cond_pagto} onChange={e => setForm({ ...form, cod_cond_pagto: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Chave</label><input type="number" value={form.cod_chave} onChange={e => setForm({ ...form, cod_chave: e.target.value })} /></div>

          <div className="form-group"><label>CFOP</label><input maxLength={5} value={form.cod_cfop} onChange={e => setForm({ ...form, cod_cfop: e.target.value })} /></div>
          <div className="form-group"><label>CFOP 2</label><input maxLength={5} value={form.cod_cfop2} onChange={e => setForm({ ...form, cod_cfop2: e.target.value })} /></div>
          <div className="form-group"><label>ICMS Base</label><input type="number" step="0.01" value={form.icms_base} onChange={e => setForm({ ...form, icms_base: e.target.value })} /></div>
          <div className="form-group"><label>ICMS Valor</label><input type="number" step="0.01" value={form.icms_valor} onChange={e => setForm({ ...form, icms_valor: e.target.value })} /></div>
          <div className="form-group"><label>ICMS Base Subst.</label><input type="number" step="0.01" value={form.icms_base_subst} onChange={e => setForm({ ...form, icms_base_subst: e.target.value })} /></div>
          <div className="form-group"><label>ICMS Valor Subst.</label><input type="number" step="0.01" value={form.icms_valor_subst} onChange={e => setForm({ ...form, icms_valor_subst: e.target.value })} /></div>
          <div className="form-group"><label>IPI Valor</label><input type="number" step="0.01" value={form.ipi_valor} onChange={e => setForm({ ...form, ipi_valor: e.target.value })} /></div>
          <div className="form-group"><label>Crédito ICMS</label><input type="number" step="0.01" value={form.credito_icms} onChange={e => setForm({ ...form, credito_icms: e.target.value })} /></div>
          <div className="form-group"><label>Tipo NF</label><input maxLength={1} value={form.tipo_nf} onChange={e => setForm({ ...form, tipo_nf: e.target.value })} /></div>
          <div className="form-group"><label>Tipo Cliente</label><input maxLength={1} value={form.tipo_cliente} onChange={e => setForm({ ...form, tipo_cliente: e.target.value })} /></div>
          <div className="form-group"><label>CT-e</label><input type="number" value={form.cte} onChange={e => setForm({ ...form, cte: e.target.value })} /></div>
          <div className="form-group"><label>Número NF</label><input type="number" value={form.numero_nf} onChange={e => setForm({ ...form, numero_nf: e.target.value })} /></div>
          <div className="form-group"><label>Total NF</label><input type="number" step="0.01" value={form.total_nf} onChange={e => setForm({ ...form, total_nf: e.target.value })} /></div>

          <div className="form-group"><label>Valor Produtos</label><input type="number" step="0.01" value={form.valor_produtos} onChange={e => setForm({ ...form, valor_produtos: e.target.value })} /></div>
          <div className="form-group"><label>Quantidade (GENUS)</label><input maxLength={10} value={form.quantidade_genus} onChange={e => setForm({ ...form, quantidade_genus: e.target.value })} /></div>
          <div className="form-group"><label>Peso Bruto (GENUS)</label><input maxLength={15} value={form.peso_bruto_genus} onChange={e => setForm({ ...form, peso_bruto_genus: e.target.value })} /></div>
          <div className="form-group"><label>Peso Líquido (GENUS)</label><input maxLength={15} value={form.peso_liquido_genus} onChange={e => setForm({ ...form, peso_liquido_genus: e.target.value })} /></div>
          <div className="form-group"><label>Valor Unitário</label><input type="number" step="0.01" value={form.valor_unit} onChange={e => setForm({ ...form, valor_unit: e.target.value })} /></div>
          <div className="form-group"><label>Qtde. (Kg)</label><input type="number" step="0.01" value={form.qtde_kg} onChange={e => setForm({ ...form, qtde_kg: e.target.value })} /></div>
          <div className="form-group"><label>Valor por Kg</label><input type="number" step="0.01" value={form.valor_kg} onChange={e => setForm({ ...form, valor_kg: e.target.value })} /></div>

          <div className="form-group"><label>Frete (R$)</label><input type="number" step="0.01" value={form.frete} onChange={e => setForm({ ...form, frete: e.target.value })} /></div>
          <div className="form-group"><label>Seguro (R$)</label><input type="number" step="0.01" value={form.seguro} onChange={e => setForm({ ...form, seguro: e.target.value })} /></div>
          <div className="form-group"><label>Outras Despesas</label><input type="number" step="0.01" value={form.outras_despesas} onChange={e => setForm({ ...form, outras_despesas: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Transportador</label><input type="number" value={form.cod_transportador} onChange={e => setForm({ ...form, cod_transportador: e.target.value })} /></div>
          <div className="form-group"><label>Frete por Conta</label><input maxLength={1} value={form.frete_conta} onChange={e => setForm({ ...form, frete_conta: e.target.value })} /></div>
          <div className="form-group"><label>Tipo de Frete</label><input maxLength={3} value={form.tipo_frete} onChange={e => setForm({ ...form, tipo_frete: e.target.value })} /></div>
          <div className="form-group"><label>% Frete</label><input type="number" step="0.01" value={form.perc_frete} onChange={e => setForm({ ...form, perc_frete: e.target.value })} /></div>
          <div className="form-group"><label>Valor do Frete</label><input type="number" step="0.01" value={form.valor_frete} onChange={e => setForm({ ...form, valor_frete: e.target.value })} /></div>
          <div className="form-group"><label>Frete Interno</label><input type="number" step="0.01" value={form.frete_interno} onChange={e => setForm({ ...form, frete_interno: e.target.value })} /></div>
          <div className="form-group"><label>Tipo de Transporte</label><input maxLength={1} value={form.tipo_transporte} onChange={e => setForm({ ...form, tipo_transporte: e.target.value })} /></div>
          <div className="form-group form-group-full"><label>Local de Entrega</label><input maxLength={50} value={form.local_entrega} onChange={e => setForm({ ...form, local_entrega: e.target.value })} /></div>
          <div className="form-group"><label>Voltagem</label><input type="number" value={form.voltagem} onChange={e => setForm({ ...form, voltagem: e.target.value })} /></div>

          <div className="form-group"><label>Desc./Acréscimo</label><input type="number" step="0.01" value={form.desc_acres} onChange={e => setForm({ ...form, desc_acres: e.target.value })} /></div>
          <div className="form-group"><label>Desconto 1</label><input type="number" step="0.01" value={form.descto1} onChange={e => setForm({ ...form, descto1: e.target.value })} /></div>
          <div className="form-group"><label>Desconto 2</label><input type="number" step="0.01" value={form.descto2} onChange={e => setForm({ ...form, descto2: e.target.value })} /></div>
          <div className="form-group"><label>Desconto 3</label><input type="number" step="0.01" value={form.descto3} onChange={e => setForm({ ...form, descto3: e.target.value })} /></div>
          <div className="form-group"><label>Desconto 4</label><input type="number" step="0.01" value={form.descto4} onChange={e => setForm({ ...form, descto4: e.target.value })} /></div>
          <div className="form-group"><label>Desconto 5</label><input type="number" step="0.01" value={form.descto5} onChange={e => setForm({ ...form, descto5: e.target.value })} /></div>
          <div className="form-group"><label>% Desconto</label><input type="number" step="0.01" value={form.perc_desconto} onChange={e => setForm({ ...form, perc_desconto: e.target.value })} /></div>
          <div className="form-group"><label>Desconto Interno</label><input type="number" step="0.01" value={form.desconto_interno} onChange={e => setForm({ ...form, desconto_interno: e.target.value })} /></div>
          <div className="form-group"><label>% Divisão</label><input type="number" step="0.01" value={form.perc_divisao} onChange={e => setForm({ ...form, perc_divisao: e.target.value })} /></div>
          <div className="form-group"><label>Comissão (%)</label><input type="number" step="0.01" value={form.comissao} onChange={e => setForm({ ...form, comissao: e.target.value })} /></div>

          <div className="form-group">
            <label>À vista / A prazo</label>
            <select value={form.avista_prazo} onChange={e => setForm({ ...form, avista_prazo: e.target.value })}>
              <option value="">-</option>
              <option value="A">À vista</option>
              <option value="P">A prazo</option>
            </select>
          </div>
          <div className="form-group"><label>Vencimento</label><input type="date" value={form.vencimento} onChange={e => setForm({ ...form, vencimento: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Contas</label><input type="number" value={form.cod_contas} onChange={e => setForm({ ...form, cod_contas: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Carteira</label><input type="number" value={form.cod_carteira} onChange={e => setForm({ ...form, cod_carteira: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Tabela de Preço</label><input type="number" value={form.cod_tabela_preco} onChange={e => setForm({ ...form, cod_tabela_preco: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Tipo de Venda</label><input type="number" value={form.cod_tipo_venda} onChange={e => setForm({ ...form, cod_tipo_venda: e.target.value })} /></div>
          <div className="form-group"><label>Lote</label><input maxLength={10} value={form.lote} onChange={e => setForm({ ...form, lote: e.target.value })} /></div>

          <div className="form-group"><label>Tipo de Pedido</label><input maxLength={1} value={form.tipo_pedido} onChange={e => setForm({ ...form, tipo_pedido: e.target.value })} /></div>
          <div className="form-group"><label>Tipo</label><input maxLength={1} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} /></div>
          <div className="form-group"><label>Tipo Pré-Pedido</label><input maxLength={1} value={form.tipo_pre_pedido} onChange={e => setForm({ ...form, tipo_pre_pedido: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Tipo Ocorrência</label><input type="number" value={form.cod_tipo_ocorrencia} onChange={e => setForm({ ...form, cod_tipo_ocorrencia: e.target.value })} /></div>
          <div className="form-group"><label>Status (GENUS)</label><input maxLength={15} value={form.status_genus} onChange={e => setForm({ ...form, status_genus: e.target.value })} /></div>
          <div className="form-group">
            <label>Excluído</label>
            <select value={form.excluido} onChange={e => setForm({ ...form, excluido: e.target.value })}>
              <option value="">-</option>
              <option value="S">Sim</option>
              <option value="N">Não</option>
            </select>
          </div>
          <div className="form-group">
            <label>Telemarketing</label>
            <select value={form.telemarketing} onChange={e => setForm({ ...form, telemarketing: e.target.value })}>
              <option value="">-</option>
              <option value="S">Sim</option>
              <option value="N">Não</option>
            </select>
          </div>
          <div className="form-group"><label>Contato</label><input maxLength={40} value={form.contato} onChange={e => setForm({ ...form, contato: e.target.value })} /></div>

          <div className="form-group">
            <label>Liberado</label>
            <select value={form.liberado} onChange={e => setForm({ ...form, liberado: e.target.value })}>
              <option value="">-</option>
              <option value="S">Sim</option>
              <option value="N">Não</option>
            </select>
          </div>
          <div className="form-group"><label>Cód. Liberação</label><input type="number" value={form.cod_liberacao} onChange={e => setForm({ ...form, cod_liberacao: e.target.value })} /></div>
          <div className="form-group"><label>Data Liberação</label><input type="date" value={form.dt_liberacao} onChange={e => setForm({ ...form, dt_liberacao: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Aprovação</label><input type="number" value={form.cod_aprovacao} onChange={e => setForm({ ...form, cod_aprovacao: e.target.value })} /></div>
          <div className="form-group"><label>Data Aprovação</label><input type="date" value={form.dt_aprovacao} onChange={e => setForm({ ...form, dt_aprovacao: e.target.value })} /></div>
          <div className="form-group form-group-full"><label>Motivo do Bloqueio</label><input value={form.motivo_bloqueio} onChange={e => setForm({ ...form, motivo_bloqueio: e.target.value })} /></div>
          <div className="form-group">
            <label>Antes Bloqueado</label>
            <select value={form.antes_bloqueado} onChange={e => setForm({ ...form, antes_bloqueado: e.target.value })}>
              <option value="">-</option>
              <option value="S">Sim</option>
              <option value="N">Não</option>
            </select>
          </div>
          <div className="form-group">
            <label>Orçamento Negado</label>
            <select value={form.orcamento_negado} onChange={e => setForm({ ...form, orcamento_negado: e.target.value })}>
              <option value="">-</option>
              <option value="S">Sim</option>
              <option value="N">Não</option>
            </select>
          </div>
          <div className="form-group form-group-full"><label>Motivo Orçamento Negado</label><input value={form.motivo_orcamento_negado} onChange={e => setForm({ ...form, motivo_orcamento_negado: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Funcionário (Orç. Negado)</label><input type="number" value={form.cod_func_orcamento_negado} onChange={e => setForm({ ...form, cod_func_orcamento_negado: e.target.value })} /></div>

          <div className="form-group">
            <label>Liberado para Produção</label>
            <select value={form.liberado_para_producao} onChange={e => setForm({ ...form, liberado_para_producao: e.target.value })}>
              <option value="">-</option>
              <option value="S">Sim</option>
              <option value="N">Não</option>
            </select>
          </div>
          <div className="form-group"><label>Produção em Etapas</label><input maxLength={1} value={form.producao_etapas} onChange={e => setForm({ ...form, producao_etapas: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Movto. Grade</label><input type="number" value={form.cod_movto_grade} onChange={e => setForm({ ...form, cod_movto_grade: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Agregado</label><input type="number" value={form.cod_agregado} onChange={e => setForm({ ...form, cod_agregado: e.target.value })} /></div>
          <div className="form-group"><label>Cód. Empresa Saída Prod.</label><input type="number" value={form.cod_empresa_saida_prod} onChange={e => setForm({ ...form, cod_empresa_saida_prod: e.target.value })} /></div>
          <div className="form-group"><label>Código Saída Prod.</label><input type="number" value={form.codigo_saida_prod} onChange={e => setForm({ ...form, codigo_saida_prod: e.target.value })} /></div>
          <div className="form-group"><label>Doc. Saída Prod.</label><input maxLength={20} value={form.doc_saida_prod} onChange={e => setForm({ ...form, doc_saida_prod: e.target.value })} /></div>

          <div className="form-group">
            <label>Faturado</label>
            <select value={form.faturado} onChange={e => setForm({ ...form, faturado: e.target.value })}>
              <option value="">-</option>
              <option value="S">Sim</option>
              <option value="N">Não</option>
            </select>
          </div>
          <div className="form-group form-group-full"><label>Observação Interna</label><input value={form.obs_interna} onChange={e => setForm({ ...form, obs_interna: e.target.value })} /></div>
          <div className="form-group"><label>Pedido Representante</label><input maxLength={15} value={form.pedido_representante} onChange={e => setForm({ ...form, pedido_representante: e.target.value })} /></div>
        </div>
      </details>
    </CadastroFormWindow>
  );
}

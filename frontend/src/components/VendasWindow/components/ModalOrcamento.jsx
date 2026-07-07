import React, { useMemo } from 'react';
import Portal from '../../shared/Portal.jsx';
import TabelaItemOrcamentoGenus from './TabelaItemOrcamentoGenus.jsx';

const fmtMoeda = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ModalOrcamento({ editandoId, form, setForm, itens, setItens, formasPag, onSalvar, onFechar, ITEM_VAZIO }) {
  const addItem = () => setItens([...itens, { ...ITEM_VAZIO }]);
  const remItem = (i) => setItens(itens.filter((_, idx) => idx !== i));
  const setItem = (i, field, val) => {
    const novo = [...itens];
    novo[i] = { ...novo[i], [field]: val };
    setItens(novo);
  };

  const subtotal = useMemo(() =>
    itens.reduce((s, it) => s + (parseFloat(it.quantidade) || 0) * (parseFloat(it.preco_unitario) || 0), 0),
    [itens]
  );
  const desconto = (parseFloat(form.desconto_percentual) || 0) / 100;
  const total = subtotal * (1 - desconto);

  return (
    <Portal>
      <div className="modal-overlay">
      <div className="modal-content vendas-modal vendas-modal-lg">
        <div className="modal-header">
          <strong>{editandoId ? 'Editar Orçamento' : 'Novo Orçamento'}</strong>
        </div>
        <div className="modal-body vendas-modal-body">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Cliente</label>
              <input value={form.nome_cliente} onChange={e => setForm({ ...form, nome_cliente: e.target.value })} placeholder="Nome do cliente" />
            </div>
            <div className="form-group">
              <label>Validade</label>
              <input type="date" value={form.data_validade} onChange={e => setForm({ ...form, data_validade: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Forma de Pagamento</label>
              <select value={form.forma_pagamento_id} onChange={e => setForm({ ...form, forma_pagamento_id: e.target.value })}>
                <option value="">Selecione...</option>
                {formasPag.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
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
            <span>Itens do Orçamento</span>
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
                  <tr>
                    <td colSpan={4} className="vendas-total-label">Subtotal</td>
                    <td className="vendas-subtotal-valor">{fmtMoeda(subtotal)}</td>
                    <td></td>
                  </tr>
                )}
                {desconto > 0 && (
                  <tr>
                    <td colSpan={4} className="vendas-total-label">Desconto ({form.desconto_percentual}%)</td>
                    <td className="vendas-desconto-valor">-{fmtMoeda(subtotal * desconto)}</td>
                    <td></td>
                  </tr>
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
              <div className="form-group">
                <label>Cód. Empresa</label>
                <input type="number" value={form.cod_empresa} onChange={e => setForm({ ...form, cod_empresa: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Código (GENUS)</label>
                <input type="number" value={form.codigo_genus} onChange={e => setForm({ ...form, codigo_genus: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Cód. Cliente (GENUS)</label>
                <input type="number" value={form.cod_cliente} onChange={e => setForm({ ...form, cod_cliente: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Cond. Pagamento (cód.)</label>
                <input maxLength={5} value={form.cod_cond_pagto} onChange={e => setForm({ ...form, cod_cond_pagto: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Cód. Funcionário</label>
                <input type="number" value={form.cod_funcionario} onChange={e => setForm({ ...form, cod_funcionario: e.target.value })} />
              </div>
              <div className="form-group">
                <label>À vista / A prazo</label>
                <select value={form.avista_prazo} onChange={e => setForm({ ...form, avista_prazo: e.target.value })}>
                  <option value="">-</option>
                  <option value="A">À vista</option>
                  <option value="P">A prazo</option>
                </select>
              </div>
              <div className="form-group">
                <label>Data do Pedido</label>
                <input type="date" value={form.dt_pedido} onChange={e => setForm({ ...form, dt_pedido: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Liberado</label>
                <select value={form.liberado} onChange={e => setForm({ ...form, liberado: e.target.value })}>
                  <option value="">-</option>
                  <option value="S">Sim</option>
                  <option value="N">Não</option>
                </select>
              </div>
              <div className="form-group">
                <label>Data Liberação</label>
                <input type="date" value={form.dt_liberado} onChange={e => setForm({ ...form, dt_liberado: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Cód. Adm.</label>
                <input type="number" value={form.cod_adm} onChange={e => setForm({ ...form, cod_adm: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Endereço do Cliente</label>
                <input value={form.cli_endereco} onChange={e => setForm({ ...form, cli_endereco: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Número</label>
                <input maxLength={6} value={form.cli_numero} onChange={e => setForm({ ...form, cli_numero: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Cód. Cidade</label>
                <input type="number" value={form.cli_cod_cidade} onChange={e => setForm({ ...form, cli_cod_cidade: e.target.value })} />
              </div>
              <div className="form-group">
                <label>CEP</label>
                <input maxLength={10} value={form.cli_cep} onChange={e => setForm({ ...form, cli_cep: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Fone do Cliente</label>
                <input maxLength={15} value={form.cli_fone} onChange={e => setForm({ ...form, cli_fone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Contato</label>
                <input maxLength={20} value={form.cli_contato} onChange={e => setForm({ ...form, cli_contato: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Bairro</label>
                <input maxLength={35} value={form.cli_bairro} onChange={e => setForm({ ...form, cli_bairro: e.target.value })} />
              </div>
              <div className="form-group">
                <label>CPF/CNPJ Cliente</label>
                <input maxLength={14} value={form.cli_cpf_cnpj} onChange={e => setForm({ ...form, cli_cpf_cnpj: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Frete (R$)</label>
                <input type="number" step="0.01" min="0" value={form.frete} onChange={e => setForm({ ...form, frete: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Cód. Transportador</label>
                <input type="number" value={form.cod_transportador} onChange={e => setForm({ ...form, cod_transportador: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Tipo de Frete</label>
                <input maxLength={3} value={form.tipo_frete} onChange={e => setForm({ ...form, tipo_frete: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Cód. Tabela de Preço</label>
                <input type="number" value={form.cod_tabela_preco} onChange={e => setForm({ ...form, cod_tabela_preco: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Status (GENUS)</label>
                <input maxLength={2} value={form.status_genus} onChange={e => setForm({ ...form, status_genus: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Motivo</label>
                <input maxLength={2} value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Prazo de Entrega</label>
                <input type="date" value={form.prazo_entrega} onChange={e => setForm({ ...form, prazo_entrega: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Cód. Agregado</label>
                <input type="number" value={form.cod_agregado} onChange={e => setForm({ ...form, cod_agregado: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Espécie</label>
                <input maxLength={15} value={form.especie} onChange={e => setForm({ ...form, especie: e.target.value })} />
              </div>
            </div>
          </details>

          {editandoId && <TabelaItemOrcamentoGenus orcamentoId={editandoId} />}
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onFechar}>Cancelar</button>
          <button className="btn-save" onClick={onSalvar}>Salvar</button>
        </div>
      </div>
      </div>
    </Portal>
  );
}

import React, { useCallback, useEffect, useState } from 'react';
import {
  listarItensOrcamentoGenus,
  criarItemOrcamentoGenus,
  atualizarItemOrcamentoGenus,
  deletarItemOrcamentoGenus,
} from '../services/itemOrcamentoGenusService.js';

const LINHA_VAZIA = {
  codigo: '',
  cod_empresa: '',
  cod_orcamento: '',
  cod_produto: '',
  descricao_produto: '',
  qtde: '',
  unitario: '',
  custo: '',
  desconto: '',
  per_desconto: '',
  frete: '',
  total: '',
  ipi: '',
  observacao: '',
};

/**
 * Gerencia os itens de orçamento (GENUS: ORCAMENTO2) de um orçamento já
 * salvo — linhas do orçamento no sistema legado (quantidade, valores
 * unitário/total, custo, desconto, frete e IPI por produto orçado). Cada
 * orçamento pode ter muitas linhas em ORCAMENTO2 (uma por produto orçado) —
 * por isso é uma lista, e não campos únicos do formulário principal do
 * orçamento, seguindo o mesmo padrão de lista + formulário usado por
 * `TabelaItemSaida` (GENUS: SAILAN) na janela de Produto.
 *
 * Diferente da lista "Itens do Orçamento" já existente neste formulário
 * (modelo ERP-nativo `ItemOrcamento`, usado para lançar itens livres do
 * orçamento), esta tabela reconhece a estrutura bruta migrada do legado
 * GENUS (ORCAMENTO2) — os dois convivem lado a lado, sem se misturar, pelo
 * mesmo motivo documentado em `ItemOrcamentoGenus` (models/tabelas.py).
 */
export default function TabelaItemOrcamentoGenus({ orcamentoId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [form, setForm] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!orcamentoId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarItensOrcamentoGenus(orcamentoId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [orcamentoId]);

  useEffect(() => { carregar(); }, [carregar]);

  const setCampo = (campo, valor) => setForm(v => ({ ...v, [campo]: valor }));

  const limparForm = () => {
    setForm(LINHA_VAZIA);
    setEditandoId(null);
  };

  const iniciarEdicao = (linha) => {
    setEditandoId(linha.id);
    setForm({ ...LINHA_VAZIA, ...linha });
  };

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      if (editandoId) {
        await atualizarItemOrcamentoGenus(editandoId, form);
      } else {
        await criarItemOrcamentoGenus({ ...form, orcamento_id: orcamentoId });
      }
      limparForm();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este item de orçamento (GENUS)?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarItemOrcamentoGenus(id);
      if (editandoId === id) limparForm();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!orcamentoId) {
    return (
      <div className="aba-placeholder">
        Salve o orçamento primeiro para gerenciar os itens (GENUS: ORCAMENTO2).
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Itens do Orçamento (GENUS: ORCAMENTO2)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Cód. Produto</th>
            <th>Descrição</th>
            <th>Qtde</th>
            <th>Unitário</th>
            <th>Total</th>
            <th>IPI</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={7} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={7} className="produto-busca-status">Nenhum item (GENUS) cadastrado para este orçamento.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.cod_produto ?? '—'}</td>
              <td>{linha.descricao_produto ?? '—'}</td>
              <td>{linha.qtde ?? '—'}</td>
              <td>{linha.unitario ?? '—'}</td>
              <td>{linha.total ?? '—'}</td>
              <td>{linha.ipi ?? '—'}</td>
              <td>
                <button type="button" className="btn-search" disabled={salvando} onClick={() => iniciarEdicao(linha)}>Editar</button>
                <button type="button" className="btn-cancel" disabled={salvando} onClick={() => excluir(linha.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={salvar} style={{ marginTop: 16 }}>
        <h4 style={{ margin: '8px 0' }}>
          {editandoId ? `Editando item #${editandoId}` : 'Novo item (GENUS: ORCAMENTO2)'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Identificação</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Código (GENUS)</label>
              <input type="number" value={form.codigo} onChange={e => setCampo('codigo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Empresa</label>
              <input type="number" value={form.cod_empresa} onChange={e => setCampo('cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Orçamento (GENUS)</label>
              <input type="number" value={form.cod_orcamento} onChange={e => setCampo('cod_orcamento', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Produto (GENUS)</label>
              <input type="text" maxLength={15} value={form.cod_produto} onChange={e => setCampo('cod_produto', e.target.value)} />
            </div>
            <div className="form-group form-group-full">
              <label>Descrição do Produto (snapshot)</label>
              <input type="text" maxLength={120} value={form.descricao_produto} onChange={e => setCampo('descricao_produto', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Quantidades / Valores comerciais</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Qtde.</label>
              <input type="number" step="0.01" value={form.qtde} onChange={e => setCampo('qtde', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor Unitário</label>
              <input type="number" step="0.01" value={form.unitario} onChange={e => setCampo('unitario', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Custo</label>
              <input type="number" step="0.01" value={form.custo} onChange={e => setCampo('custo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Desconto</label>
              <input type="number" step="0.01" value={form.desconto} onChange={e => setCampo('desconto', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Desconto</label>
              <input type="number" step="0.01" value={form.per_desconto} onChange={e => setCampo('per_desconto', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Frete</label>
              <input type="number" step="0.01" value={form.frete} onChange={e => setCampo('frete', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Total</label>
              <input type="number" step="0.01" value={form.total} onChange={e => setCampo('total', e.target.value)} />
            </div>
            <div className="form-group">
              <label>IPI</label>
              <input type="number" step="0.01" value={form.ipi} onChange={e => setCampo('ipi', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Observação</legend>
          <div className="form-row">
            <div className="form-group form-group-full">
              <label>Observação (GENUS: OBS)</label>
              <textarea rows={2} value={form.observacao} onChange={e => setCampo('observacao', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
          {editandoId && (
            <button type="button" className="btn-cancel" disabled={salvando} onClick={limparForm}>Cancelar edição</button>
          )}
          <button type="button" className="btn-save" disabled={salvando} onClick={salvar}>
            {salvando ? 'Salvando...' : (editandoId ? 'Salvar alterações' : '+ Adicionar item')}
          </button>
        </div>
      </form>
    </fieldset>
  );
}

import React, { useCallback, useEffect, useState } from 'react';
import {
  listarItensSaidaCancelados,
  criarItemSaidaCancelado,
  atualizarItemSaidaCancelado,
  deletarItemSaidaCancelado,
} from '../services/itemSaidaCanceladoService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  cod_saida: '',
  cod_produto: '',
  cod_sailan: '',
  qtde: '',
  unitario: '',
  total: '',
  desconto: '',
  per_desconto: '',
  frete: '',
  retirar: '',
  estoque_cli: '',
  perc_comissao: '',
  cal_comissao: '',
  val_comissao: '',
  entrada_saida: '',
  cod_cfop: '',
  aliq_icms: '',
  icms: '',
  reducao_icms: '',
  iva: '',
  ipi: '',
};

/**
 * Gerencia o histórico de itens de saída/venda cancelados (GENUS:
 * SAILAN_CANCELADA) de um produto — cópia dos atributos comerciais/fiscais
 * de uma linha de SAILAN no momento em que ela foi cancelada no GENUS.
 *
 * Irmã de `TabelaItemSaidaExcluido` (DELSAILAN, quando o item é excluído):
 * aqui o evento é o cancelamento (ver também `ItemSaida.cancelado`,
 * GENUS.SAILAN.CANCELADO). SAILAN_CANCELADA tem chave primária composta no
 * GENUS (CODEMPRESA + CODSAIDA + CODPRODUTO + CODSAILAN), mas — assim como
 * em `ItemSaida`/`ItemSaidaExcluido` — essa chave não é reaproveitada como
 * PK aqui; um mesmo produto pode ter tido várias linhas de saída
 * canceladas, por isso esta aba é uma lista + formulário, não um registro
 * único.
 */
export default function TabelaItemSaidaCancelado({ produtoId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [form, setForm] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!produtoId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarItensSaidaCancelados(produtoId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [produtoId]);

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
        await atualizarItemSaidaCancelado(editandoId, form);
      } else {
        await criarItemSaidaCancelado({ ...form, produto_id: produtoId });
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
    if (!window.confirm('Remover este registro de item de saída cancelado?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarItemSaidaCancelado(id);
      if (editandoId === id) limparForm();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!produtoId) {
    return (
      <div className="aba-placeholder">
        Salve o produto primeiro para consultar os itens de saída cancelados.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Itens de Saída Cancelados (GENUS: SAILAN_CANCELADA)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Cód. Saída</th>
            <th>Cód. SAILAN</th>
            <th>Qtde</th>
            <th>Unitário</th>
            <th>Total</th>
            <th>CFOP</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={7} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={7} className="produto-busca-status">Nenhum item de saída cancelado registrado para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.cod_saida ?? '—'}</td>
              <td>{linha.cod_sailan ?? '—'}</td>
              <td>{linha.qtde ?? '—'}</td>
              <td>{linha.unitario ?? '—'}</td>
              <td>{linha.total ?? '—'}</td>
              <td>{linha.cod_cfop ?? '—'}</td>
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
          {editandoId ? `Editando registro #${editandoId}` : 'Novo item de saída cancelado'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Identificação</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Empresa</label>
              <input type="number" value={form.cod_empresa} onChange={e => setCampo('cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Saída</label>
              <input type="number" value={form.cod_saida} onChange={e => setCampo('cod_saida', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Produto (GENUS)</label>
              <input type="text" maxLength={15} value={form.cod_produto} onChange={e => setCampo('cod_produto', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. SAILAN</label>
              <input type="number" value={form.cod_sailan} onChange={e => setCampo('cod_sailan', e.target.value)} />
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
              <label>Total</label>
              <input type="number" step="0.01" value={form.total} onChange={e => setCampo('total', e.target.value)} />
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
              <label>Retirar (S/N)</label>
              <input type="text" maxLength={1} value={form.retirar} onChange={e => setCampo('retirar', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Estoque no Cliente (S/N)</label>
              <input type="text" maxLength={1} value={form.estoque_cli} onChange={e => setCampo('estoque_cli', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Comissão</legend>
          <div className="form-row">
            <div className="form-group">
              <label>% Comissão</label>
              <input type="number" step="0.01" value={form.perc_comissao} onChange={e => setCampo('perc_comissao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cálc. Comissão</label>
              <input type="number" step="0.01" value={form.cal_comissao} onChange={e => setCampo('cal_comissao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Val. Comissão</label>
              <input type="number" step="0.01" value={form.val_comissao} onChange={e => setCampo('val_comissao', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Fiscal: ICMS / IPI / CFOP</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Entrada/Saída (E/S)</label>
              <input type="text" maxLength={1} value={form.entrada_saida} onChange={e => setCampo('entrada_saida', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. CFOP</label>
              <input type="text" maxLength={5} value={form.cod_cfop} onChange={e => setCampo('cod_cfop', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Alíq. ICMS</label>
              <input type="text" maxLength={5} value={form.aliq_icms} onChange={e => setCampo('aliq_icms', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS</label>
              <input type="number" step="0.01" value={form.icms} onChange={e => setCampo('icms', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Redução ICMS</label>
              <input type="number" step="0.01" value={form.reducao_icms} onChange={e => setCampo('reducao_icms', e.target.value)} />
            </div>
            <div className="form-group">
              <label>IVA</label>
              <input type="number" step="0.01" value={form.iva} onChange={e => setCampo('iva', e.target.value)} />
            </div>
            <div className="form-group">
              <label>IPI</label>
              <input type="number" step="0.01" value={form.ipi} onChange={e => setCampo('ipi', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
          {editandoId && (
            <button type="button" className="btn-cancel" disabled={salvando} onClick={limparForm}>Cancelar edição</button>
          )}
          <button type="button" className="btn-save" disabled={salvando} onClick={salvar}>
            {salvando ? 'Salvando...' : (editandoId ? 'Salvar alterações' : '+ Adicionar registro')}
          </button>
        </div>
      </form>
    </fieldset>
  );
}

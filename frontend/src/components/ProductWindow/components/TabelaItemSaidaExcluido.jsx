import React, { useCallback, useEffect, useState } from 'react';
import {
  listarItensSaidaExcluidos,
  criarItemSaidaExcluido,
  atualizarItemSaidaExcluido,
  deletarItemSaidaExcluido,
} from '../services/itemSaidaExcluidoService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  cod_saida: '',
  cod_produto: '',
  lote_produto: '',
  qtde: '',
  unitario: '',
  total: '',
  custo: '',
  desconto: '',
  per_desconto: '',
  frete: '',
  seguro: '',
  outras: '',
  retirar: '',
  estoque_cli: '',
  perc_comissao: '',
  cal_comissao: '',
  val_comissao: '',
  entrada_saida: '',
  cst: '',
  csosn: '',
  cod_cfop: '',
  aliq_icms: '',
  icms: '',
  icms_base: '',
  icms_valor: '',
  icms_outras: '',
  icms_isento: '',
  reducao_icms: '',
  iva: '',
  icmsst: '',
  reducao_icmsst: '',
  icms_base_subst: '',
  icms_valor_subst: '',
  reduzir_base_st: '',
  ipi: '',
  ipi_cst: '',
  ipi_valor: '',
  ipi_base_calculo: '',
  calcula_ipi_base: '',
  pis_cst: '',
  pis_valor: '',
  pis_base: '',
  pis_aliquota: '',
  quantidade_pis: '',
  aliq_pis_reais: '',
  cofins_cst: '',
  cofins_valor: '',
  cofins_base: '',
  cofins_aliquota: '',
  quantidade_cofins: '',
  aliq_cofins_reais: '',
  cod_romaneio: '',
  obs_produto: '',
  dt_exclusao: '',
};

const fmtData = (v) => (v ? String(v).slice(0, 10) : '');

/**
 * Gerencia o histórico de itens de saída/venda excluídos (GENUS: DELSAILAN)
 * de um produto — cópia dos atributos comerciais/fiscais de uma linha de
 * SAILAN no momento em que ela foi excluída no GENUS.
 *
 * Diferente de `ProdutoExcluido`/GENUS.DEL_PRODUTO (1:1 por produto, pois
 * CODIGO é a própria PK de DEL_PRODUTO), DELSAILAN não tem PK nem FK
 * nenhuma no GENUS e um mesmo produto pode ter sido vendido/excluído várias
 * vezes — por isso, assim como `TabelaItemSaida` (SAILAN "viva"), esta aba
 * é uma lista + formulário, não um registro único.
 */
export default function TabelaItemSaidaExcluido({ produtoId }) {
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
      const dados = await listarItensSaidaExcluidos(produtoId);
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
    setForm({
      ...LINHA_VAZIA,
      ...linha,
      dt_exclusao: fmtData(linha.dt_exclusao),
    });
  };

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      if (editandoId) {
        await atualizarItemSaidaExcluido(editandoId, form);
      } else {
        await criarItemSaidaExcluido({ ...form, produto_id: produtoId });
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
    if (!window.confirm('Remover este registro de item de saída excluído?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarItemSaidaExcluido(id);
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
        Salve o produto primeiro para consultar os itens de saída excluídos.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Itens de Saída Excluídos (GENUS: DELSAILAN)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Cód. Saída</th>
            <th>Qtde</th>
            <th>Unitário</th>
            <th>Total</th>
            <th>CFOP</th>
            <th>Data Exclusão</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={7} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={7} className="produto-busca-status">Nenhum item de saída excluído registrado para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.cod_saida ?? '—'}</td>
              <td>{linha.qtde ?? '—'}</td>
              <td>{linha.unitario ?? '—'}</td>
              <td>{linha.total ?? '—'}</td>
              <td>{linha.cod_cfop ?? '—'}</td>
              <td>{fmtData(linha.dt_exclusao) || '—'}</td>
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
          {editandoId ? `Editando registro #${editandoId}` : 'Novo item de saída excluído'}
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
              <label>Lote Produto</label>
              <input type="text" maxLength={15} value={form.lote_produto} onChange={e => setCampo('lote_produto', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Data Exclusão</label>
              <input type="date" value={form.dt_exclusao} onChange={e => setCampo('dt_exclusao', e.target.value)} />
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
              <label>Seguro</label>
              <input type="number" step="0.01" value={form.seguro} onChange={e => setCampo('seguro', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Outras Despesas</label>
              <input type="number" step="0.01" value={form.outras} onChange={e => setCampo('outras', e.target.value)} />
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
          <legend style={{ fontSize: 12, color: '#777' }}>Fiscal: ICMS / ICMS-ST</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Entrada/Saída (E/S)</label>
              <input type="text" maxLength={1} value={form.entrada_saida} onChange={e => setCampo('entrada_saida', e.target.value)} />
            </div>
            <div className="form-group">
              <label>CST</label>
              <input type="text" maxLength={3} value={form.cst} onChange={e => setCampo('cst', e.target.value)} />
            </div>
            <div className="form-group">
              <label>CSOSN</label>
              <input type="text" maxLength={4} value={form.csosn} onChange={e => setCampo('csosn', e.target.value)} />
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
              <label>ICMS Base</label>
              <input type="number" step="0.01" value={form.icms_base} onChange={e => setCampo('icms_base', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Valor</label>
              <input type="number" step="0.01" value={form.icms_valor} onChange={e => setCampo('icms_valor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Outras</label>
              <input type="number" step="0.01" value={form.icms_outras} onChange={e => setCampo('icms_outras', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Isento</label>
              <input type="number" step="0.01" value={form.icms_isento} onChange={e => setCampo('icms_isento', e.target.value)} />
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
              <label>ICMS-ST</label>
              <input type="number" step="0.01" value={form.icmsst} onChange={e => setCampo('icmsst', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Redução ICMS-ST</label>
              <input type="number" step="0.01" value={form.reducao_icmsst} onChange={e => setCampo('reducao_icmsst', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Base Subst.</label>
              <input type="number" step="0.01" value={form.icms_base_subst} onChange={e => setCampo('icms_base_subst', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Valor Subst.</label>
              <input type="number" step="0.01" value={form.icms_valor_subst} onChange={e => setCampo('icms_valor_subst', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Reduzir Base ST (S/N)</label>
              <input type="text" maxLength={1} value={form.reduzir_base_st} onChange={e => setCampo('reduzir_base_st', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Fiscal: IPI</legend>
          <div className="form-row">
            <div className="form-group">
              <label>IPI</label>
              <input type="number" step="0.01" value={form.ipi} onChange={e => setCampo('ipi', e.target.value)} />
            </div>
            <div className="form-group">
              <label>IPI CST</label>
              <input type="text" maxLength={3} value={form.ipi_cst} onChange={e => setCampo('ipi_cst', e.target.value)} />
            </div>
            <div className="form-group">
              <label>IPI Valor</label>
              <input type="number" step="0.01" value={form.ipi_valor} onChange={e => setCampo('ipi_valor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>IPI Base Cálculo</label>
              <input type="number" step="0.01" value={form.ipi_base_calculo} onChange={e => setCampo('ipi_base_calculo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Calcula IPI Base (S/N)</label>
              <input type="text" maxLength={1} value={form.calcula_ipi_base} onChange={e => setCampo('calcula_ipi_base', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Fiscal: PIS / COFINS</legend>
          <div className="form-row">
            <div className="form-group">
              <label>PIS CST</label>
              <input type="text" maxLength={3} value={form.pis_cst} onChange={e => setCampo('pis_cst', e.target.value)} />
            </div>
            <div className="form-group">
              <label>PIS Valor</label>
              <input type="number" step="0.01" value={form.pis_valor} onChange={e => setCampo('pis_valor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>PIS Base</label>
              <input type="number" step="0.01" value={form.pis_base} onChange={e => setCampo('pis_base', e.target.value)} />
            </div>
            <div className="form-group">
              <label>PIS Alíquota</label>
              <input type="number" step="0.01" value={form.pis_aliquota} onChange={e => setCampo('pis_aliquota', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Quantidade PIS</label>
              <input type="number" step="0.01" value={form.quantidade_pis} onChange={e => setCampo('quantidade_pis', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Alíq. PIS (R$)</label>
              <input type="number" step="0.01" value={form.aliq_pis_reais} onChange={e => setCampo('aliq_pis_reais', e.target.value)} />
            </div>
            <div className="form-group">
              <label>COFINS CST</label>
              <input type="text" maxLength={3} value={form.cofins_cst} onChange={e => setCampo('cofins_cst', e.target.value)} />
            </div>
            <div className="form-group">
              <label>COFINS Valor</label>
              <input type="number" step="0.01" value={form.cofins_valor} onChange={e => setCampo('cofins_valor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>COFINS Base</label>
              <input type="number" step="0.01" value={form.cofins_base} onChange={e => setCampo('cofins_base', e.target.value)} />
            </div>
            <div className="form-group">
              <label>COFINS Alíquota</label>
              <input type="number" step="0.01" value={form.cofins_aliquota} onChange={e => setCampo('cofins_aliquota', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Quantidade COFINS</label>
              <input type="number" step="0.01" value={form.quantidade_cofins} onChange={e => setCampo('quantidade_cofins', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Alíq. COFINS (R$)</label>
              <input type="number" step="0.01" value={form.aliq_cofins_reais} onChange={e => setCampo('aliq_cofins_reais', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Referências / Observação</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Romaneio</label>
              <input type="number" value={form.cod_romaneio} onChange={e => setCampo('cod_romaneio', e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Observação do Produto</label>
              <textarea rows={2} value={form.obs_produto} onChange={e => setCampo('obs_produto', e.target.value)} />
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

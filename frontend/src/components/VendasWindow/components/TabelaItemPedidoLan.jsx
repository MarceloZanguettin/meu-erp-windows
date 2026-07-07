import React, { useCallback, useEffect, useState } from 'react';
import {
  listarItensPedidoLan,
  criarItemPedidoLan,
  atualizarItemPedidoLan,
  deletarItemPedidoLan,
} from '../services/itemPedidoLanService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  cod_pedido: '',
  cod_produto: '',
  lote_produto: '',
  num_item: '',
  unidade: '',
  pai_filho: '',
  qtde: '',
  qtde_embal: '',
  qtde_controle: '',
  qtde_fisico: '',
  qtde_faturado: '',
  fat_parcial_qtde_fisico: '',
  diferenca: '',
  unitario: '',
  total: '',
  custo_atual: '',
  desconto: '',
  per_desconto: '',
  frete: '',
  outras: '',
  comissao_item: '',
  fechado: '',
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
  icms_fcp: '',
  cenq: '',
  ipi: '',
  ipi_cst: '',
  ipi_valor: '',
  ipi_base_calculo: '',
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
  cod_tipo_estampa: '',
  cod_decreto: '',
  estoque_reservado_tipo: '',
  obs_produto: '',
};

/**
 * Gerencia os itens de pedido de venda (GENUS: PEDIDOLAN) de um pedido já
 * salvo — linhas do pedido no sistema legado (quantidade, valores unitário/
 * total, custo atual, desconto, frete e a tributação completa ICMS/ICMS-ST/
 * IPI/PIS/COFINS por produto pedido). Cada pedido pode ter muitas linhas em
 * PEDIDOLAN (uma por produto pedido) — por isso é uma lista, e não campos
 * únicos do formulário principal do pedido, seguindo o mesmo padrão de
 * lista + formulário usado por `TabelaItemOrcamentoGenus` (GENUS:
 * ORCAMENTO2) na janela de Orçamentos e `TabelaItemSaida` (GENUS: SAILAN)
 * na janela de Produto.
 *
 * Diferente da lista "Itens do Pedido" já existente neste formulário
 * (modelo ERP-nativo `ItemPedidoVenda`, usado para lançar itens livres do
 * pedido), esta tabela reconhece a estrutura bruta migrada do legado GENUS
 * (PEDIDOLAN) — os dois convivem lado a lado, sem se misturar, pelo mesmo
 * motivo documentado em `ItemPedidoLan` (models/tabelas.py).
 */
export default function TabelaItemPedidoLan({ pedidoId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [form, setForm] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!pedidoId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarItensPedidoLan(pedidoId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [pedidoId]);

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
        await atualizarItemPedidoLan(editandoId, form);
      } else {
        await criarItemPedidoLan({ ...form, pedido_id: pedidoId });
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
    if (!window.confirm('Excluir este item de pedido (GENUS)?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarItemPedidoLan(id);
      if (editandoId === id) limparForm();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!pedidoId) {
    return (
      <div className="aba-placeholder">
        Salve o pedido primeiro para gerenciar os itens (GENUS: PEDIDOLAN).
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Itens do Pedido (GENUS: PEDIDOLAN)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Cód. Produto</th>
            <th>N. Item</th>
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
            <tr><td colSpan={7} className="produto-busca-status">Nenhum item (GENUS) cadastrado para este pedido.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.cod_produto ?? '—'}</td>
              <td>{linha.num_item ?? '—'}</td>
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
          {editandoId ? `Editando item #${editandoId}` : 'Novo item (GENUS: PEDIDOLAN)'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Identificação</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Empresa</label>
              <input type="number" value={form.cod_empresa} onChange={e => setCampo('cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Pedido (GENUS)</label>
              <input type="number" value={form.cod_pedido} onChange={e => setCampo('cod_pedido', e.target.value)} />
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
              <label>Núm. Item</label>
              <input type="text" maxLength={7} value={form.num_item} onChange={e => setCampo('num_item', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Unidade</label>
              <input type="text" maxLength={6} value={form.unidade} onChange={e => setCampo('unidade', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Pai/Filho</label>
              <input type="text" maxLength={1} value={form.pai_filho} onChange={e => setCampo('pai_filho', e.target.value)} />
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
              <label>Qtde. Embalagem</label>
              <input type="number" step="0.01" value={form.qtde_embal} onChange={e => setCampo('qtde_embal', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Qtde. Controle</label>
              <input type="number" step="0.01" value={form.qtde_controle} onChange={e => setCampo('qtde_controle', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Qtde. Físico</label>
              <input type="number" step="0.01" value={form.qtde_fisico} onChange={e => setCampo('qtde_fisico', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Qtde. Faturado</label>
              <input type="number" step="0.01" value={form.qtde_faturado} onChange={e => setCampo('qtde_faturado', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Fat. Parcial Qtde. Físico</label>
              <input type="number" step="0.01" value={form.fat_parcial_qtde_fisico} onChange={e => setCampo('fat_parcial_qtde_fisico', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Diferença</label>
              <input type="number" step="0.01" value={form.diferenca} onChange={e => setCampo('diferenca', e.target.value)} />
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
              <label>Custo Atual</label>
              <input type="number" step="0.01" value={form.custo_atual} onChange={e => setCampo('custo_atual', e.target.value)} />
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
              <label>Outras Despesas</label>
              <input type="number" step="0.01" value={form.outras} onChange={e => setCampo('outras', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Comissão do Item</label>
              <input type="number" step="0.01" value={form.comissao_item} onChange={e => setCampo('comissao_item', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Fechado</label>
              <input type="number" step="0.01" value={form.fechado} onChange={e => setCampo('fechado', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Fiscal: ICMS / ICMS-ST</legend>
          <div className="form-row">
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
              <label>ICMS FCP</label>
              <input type="number" step="0.01" value={form.icms_fcp} onChange={e => setCampo('icms_fcp', e.target.value)} />
            </div>
            <div className="form-group">
              <label>CENQ</label>
              <input type="text" maxLength={3} value={form.cenq} onChange={e => setCampo('cenq', e.target.value)} />
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
          <legend style={{ fontSize: 12, color: '#777' }}>Referências / Classificação</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Romaneio</label>
              <input type="number" value={form.cod_romaneio} onChange={e => setCampo('cod_romaneio', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Tipo Estampa</label>
              <input type="number" value={form.cod_tipo_estampa} onChange={e => setCampo('cod_tipo_estampa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Decreto</label>
              <input type="number" value={form.cod_decreto} onChange={e => setCampo('cod_decreto', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Estoque Reservado (Tipo)</label>
              <input type="text" maxLength={1} value={form.estoque_reservado_tipo} onChange={e => setCampo('estoque_reservado_tipo', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Observação</legend>
          <div className="form-row">
            <div className="form-group form-group-full">
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
            {salvando ? 'Salvando...' : (editandoId ? 'Salvar alterações' : '+ Adicionar item')}
          </button>
        </div>
      </form>
    </fieldset>
  );
}

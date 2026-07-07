import React, { useCallback, useEffect, useState } from 'react';
import {
  listarItensSaida,
  criarItemSaida,
  atualizarItemSaida,
  deletarItemSaida,
} from '../services/itemSaidaService.js';

const LINHA_VAZIA = {
  codigo: '',
  cod_empresa: '',
  cod_saida: '',
  cod_produto: '',
  nitem: '',
  num_item: '',
  lote_produto: '',
  unidade: '',
  pai_filho: '',
  cancelado: '',
  qtde: '',
  qtde_controle: '',
  qtde_embal: '',
  cod_embalagem: '',
  qtde_embalagem: '',
  qtde_faturamento_parcial: '',
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
  comissao_item: '',
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
  icms_fcp: '',
  aliq_uf_dest: '',
  aliq_inter: '',
  perc_partilha: '',
  vl_icms_uf_dest: '',
  vl_icms_uf_rem: '',
  vl_icms_fcp: '',
  credito: '',
  ipi: '',
  ipi_cst: '',
  ipi_valor: '',
  ipi_base_calculo: '',
  calcula_ipi_base: '',
  calcula_ipi_base_subst: '',
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
  aliq_ibpt: '',
  cenq: '',
  di_doc: '',
  di_dt: '',
  desemb_dt: '',
  desemb_local: '',
  desemb_uf: '',
  di_exportador: '',
  di_fabricante: '',
  cod_romaneio: '',
  cod_classificacao2: '',
  cod_empresa_nao_fiscal: '',
  cod_pre_pedido: '',
  cod_empresa_pre_pedido: '',
  num_pedido: '',
  num_lote_prod_etapas: '',
  ref_fabrica: '',
  cod_cbenef: '',
  obs_produto: '',
  reforma_cst_ibscbs: '',
  reforma_cclasstrib: '',
  reforma_vbc_ibscbs: '',
  reforma_vitem: '',
  reforma_chave_acesso: '',
  reforma_nitem: '',
  reforma_inddoacao: '',
  reforma_pibsuf_ibsuf: '',
  reforma_pdif_ibsuf: '',
  reforma_vdif_ibsuf: '',
  reforma_vdevtrib_ibsuf: '',
  reforma_predaliq_ibsuf: '',
  reforma_paliqefet_ibsuf: '',
  reforma_vibsuf_ibsuf: '',
  reforma_paliqefetregibsuf: '',
  reforma_vtribregibsuf: '',
  reforma_paliqibsuf_gov: '',
  reforma_vtribibsuf_gov: '',
  reforma_vibs_transfcred: '',
  reforma_vibsestcred: '',
  reforma_pibsmun_ibsmun: '',
  reforma_pdif_ibsmun: '',
  reforma_vdif_ibsmun: '',
  reforma_vdevtrib_ibsmun: '',
  reforma_predaliq_ibsmun: '',
  reforma_paliqefet_ibsmun: '',
  reforma_vibsmun_ibsmun: '',
  reforma_paliqefetregibsmun: '',
  reforma_vtribregibsmun: '',
  reforma_paliqibsmun_gov: '',
  reforma_vtribibsmun_gov: '',
  reforma_vibs: '',
  reforma_pcbs_cbs: '',
  reforma_pdif_cbs: '',
  reforma_vdif_cbs: '',
  reforma_vdevtrib_cbs: '',
  reforma_predaliq_cbs: '',
  reforma_paliqefet_cbs: '',
  reforma_vcbs_cbs: '',
  reforma_paliqefetregcbs: '',
  reforma_vtribregcbs: '',
  reforma_paliqcbs_gov: '',
  reforma_vtribcbs_gov: '',
  reforma_vcbs_transfcred: '',
  reforma_vcbsestcred: '',
  reforma_cstreg: '',
  reforma_cclasstribreg: '',
  reforma_ccredpres_ibs: '',
  reforma_pcredpres_ibs: '',
  reforma_vcredpres_ibs: '',
  reforma_vcredprescondsus_ibs: '',
  reforma_ccredpres_cbs: '',
  reforma_pcredpres_cbs: '',
  reforma_vcredpres_cbs: '',
  reforma_vcredprescondsus_cbs: '',
  reforma_tpcredpresibszfm: '',
  reforma_vcredpresibszfm: '',
  reforma_cstis_is: '',
  reforma_cclasstribis_is: '',
  reforma_vbcis_is: '',
  reforma_pis_is: '',
  reforma_pisespec_is: '',
  reforma_utrib_is: '',
  reforma_qtrib_is: '',
  reforma_vis_is: '',
};

const fmtData = (v) => (v ? String(v).slice(0, 10) : '');

/**
 * Gerencia os itens de saída/venda (GENUS: SAILAN) de um produto — linhas de
 * nota fiscal de saída (faturamento) em que este produto foi vendido. Cada
 * produto pode ter muitas linhas em SAILAN (uma por saída/nota fiscal em que
 * aparece) — por isso é uma lista, e não campos únicos do form principal do
 * produto, seguindo o mesmo padrão de lista + formulário usado pelas demais
 * abas filhas de produto (Produção, Movimentos, Processos).
 *
 * SAILAN é uma tabela "filha" de SAIDA (cabeçalho da nota fiscal de saída),
 * que ainda não tem model/janela própria neste ERP — por isso os códigos
 * `cod_empresa`/`cod_saida` são mantidos como campos brutos aqui, sem
 * combo/vínculo de fato com uma "Saída" (isso será resolvido quando SAIDA
 * ganhar seu próprio model, o próximo passo natural do módulo Vendas/
 * Faturamento).
 *
 * Dado o grande número de campos originais da tabela GENUS (inclusive os da
 * Reforma Tributária — IBS/CBS/IS), o formulário de inclusão/edição é
 * organizado em seções, no mesmo espírito usado na aba Produção.
 */
export default function TabelaItemSaida({ produtoId }) {
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
      const dados = await listarItensSaida(produtoId);
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
      di_dt: fmtData(linha.di_dt),
      desemb_dt: fmtData(linha.desemb_dt),
    });
  };

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      if (editandoId) {
        await atualizarItemSaida(editandoId, form);
      } else {
        await criarItemSaida({ ...form, produto_id: produtoId });
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
    if (!window.confirm('Excluir este item de saída?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarItemSaida(id);
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
        Salve o produto primeiro para gerenciar os itens de saída.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Itens de Saída (GENUS: SAILAN)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Cód. Saída</th>
            <th>N. Item</th>
            <th>Qtde</th>
            <th>Unitário</th>
            <th>Total</th>
            <th>CFOP</th>
            <th>Cancelado</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={8} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={8} className="produto-busca-status">Nenhum item de saída cadastrado para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.cod_saida ?? '—'}</td>
              <td>{linha.nitem ?? '—'}</td>
              <td>{linha.qtde ?? '—'}</td>
              <td>{linha.unitario ?? '—'}</td>
              <td>{linha.total ?? '—'}</td>
              <td>{linha.cod_cfop ?? '—'}</td>
              <td>{linha.cancelado ?? '—'}</td>
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
          {editandoId ? `Editando item #${editandoId}` : 'Novo item de saída'}
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
              <label>Cód. Saída</label>
              <input type="number" value={form.cod_saida} onChange={e => setCampo('cod_saida', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Produto (GENUS)</label>
              <input type="text" maxLength={15} value={form.cod_produto} onChange={e => setCampo('cod_produto', e.target.value)} />
            </div>
            <div className="form-group">
              <label>N. Item</label>
              <input type="number" value={form.nitem} onChange={e => setCampo('nitem', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Núm. Item</label>
              <input type="text" maxLength={7} value={form.num_item} onChange={e => setCampo('num_item', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Lote Produto</label>
              <input type="text" maxLength={15} value={form.lote_produto} onChange={e => setCampo('lote_produto', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Unidade</label>
              <input type="text" maxLength={6} value={form.unidade} onChange={e => setCampo('unidade', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Pai/Filho</label>
              <input type="text" maxLength={1} value={form.pai_filho} onChange={e => setCampo('pai_filho', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cancelado (S/N)</label>
              <input type="text" maxLength={1} value={form.cancelado} onChange={e => setCampo('cancelado', e.target.value)} />
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
              <label>Qtde. Controle</label>
              <input type="number" step="0.01" value={form.qtde_controle} onChange={e => setCampo('qtde_controle', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Qtde. Embalagem (unid.)</label>
              <input type="number" step="0.01" value={form.qtde_embal} onChange={e => setCampo('qtde_embal', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Embalagem</label>
              <input type="text" maxLength={15} value={form.cod_embalagem} onChange={e => setCampo('cod_embalagem', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Qtde. Embalagens</label>
              <input type="number" step="0.01" value={form.qtde_embalagem} onChange={e => setCampo('qtde_embalagem', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Qtde. Faturamento Parcial</label>
              <input type="number" step="0.01" value={form.qtde_faturamento_parcial} onChange={e => setCampo('qtde_faturamento_parcial', e.target.value)} />
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
            <div className="form-group">
              <label>Comissão do Item</label>
              <input type="number" step="0.01" value={form.comissao_item} onChange={e => setCampo('comissao_item', e.target.value)} />
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
            <div className="form-group">
              <label>ICMS FCP</label>
              <input type="number" step="0.01" value={form.icms_fcp} onChange={e => setCampo('icms_fcp', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Fiscal: ICMS Partilha Interestadual (DIFAL)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Alíq. UF Destino</label>
              <input type="number" step="0.01" value={form.aliq_uf_dest} onChange={e => setCampo('aliq_uf_dest', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Alíq. Interestadual</label>
              <input type="text" maxLength={5} value={form.aliq_inter} onChange={e => setCampo('aliq_inter', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Partilha</label>
              <input type="text" maxLength={5} value={form.perc_partilha} onChange={e => setCampo('perc_partilha', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. ICMS UF Destino</label>
              <input type="number" step="0.01" value={form.vl_icms_uf_dest} onChange={e => setCampo('vl_icms_uf_dest', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. ICMS UF Remetente</label>
              <input type="number" step="0.01" value={form.vl_icms_uf_rem} onChange={e => setCampo('vl_icms_uf_rem', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. ICMS FCP</label>
              <input type="number" step="0.01" value={form.vl_icms_fcp} onChange={e => setCampo('vl_icms_fcp', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Crédito</label>
              <input type="number" step="0.01" value={form.credito} onChange={e => setCampo('credito', e.target.value)} />
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
            <div className="form-group">
              <label>Calcula IPI Base Subst. (S/N)</label>
              <input type="text" maxLength={1} value={form.calcula_ipi_base_subst} onChange={e => setCampo('calcula_ipi_base_subst', e.target.value)} />
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
            <div className="form-group">
              <label>Alíq. IBPT</label>
              <input type="number" step="0.01" value={form.aliq_ibpt} onChange={e => setCampo('aliq_ibpt', e.target.value)} />
            </div>
            <div className="form-group">
              <label>CENQ</label>
              <input type="text" maxLength={3} value={form.cenq} onChange={e => setCampo('cenq', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Importação (DI — Declaração de Importação)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>DI - Documento</label>
              <input type="text" maxLength={10} value={form.di_doc} onChange={e => setCampo('di_doc', e.target.value)} />
            </div>
            <div className="form-group">
              <label>DI - Data</label>
              <input type="date" value={form.di_dt} onChange={e => setCampo('di_dt', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Desembaraço - Data</label>
              <input type="date" value={form.desemb_dt} onChange={e => setCampo('desemb_dt', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Desembaraço - Local</label>
              <input type="text" maxLength={40} value={form.desemb_local} onChange={e => setCampo('desemb_local', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Desembaraço - UF</label>
              <input type="text" maxLength={2} value={form.desemb_uf} onChange={e => setCampo('desemb_uf', e.target.value)} />
            </div>
            <div className="form-group">
              <label>DI - Exportador</label>
              <input type="text" maxLength={10} value={form.di_exportador} onChange={e => setCampo('di_exportador', e.target.value)} />
            </div>
            <div className="form-group">
              <label>DI - Fabricante</label>
              <input type="text" maxLength={10} value={form.di_fabricante} onChange={e => setCampo('di_fabricante', e.target.value)} />
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
              <label>Cód. Classificação 2</label>
              <input type="number" value={form.cod_classificacao2} onChange={e => setCampo('cod_classificacao2', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Empresa Não Fiscal</label>
              <input type="number" value={form.cod_empresa_nao_fiscal} onChange={e => setCampo('cod_empresa_nao_fiscal', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Pré-Pedido</label>
              <input type="number" value={form.cod_pre_pedido} onChange={e => setCampo('cod_pre_pedido', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Empresa Pré-Pedido</label>
              <input type="number" value={form.cod_empresa_pre_pedido} onChange={e => setCampo('cod_empresa_pre_pedido', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Núm. Pedido</label>
              <input type="text" maxLength={15} value={form.num_pedido} onChange={e => setCampo('num_pedido', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Núm. Lote Prod. Etapas</label>
              <input type="text" maxLength={20} value={form.num_lote_prod_etapas} onChange={e => setCampo('num_lote_prod_etapas', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Ref. Fábrica</label>
              <input type="text" maxLength={20} value={form.ref_fabrica} onChange={e => setCampo('ref_fabrica', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. cBenef</label>
              <input type="number" value={form.cod_cbenef} onChange={e => setCampo('cod_cbenef', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Observação</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Observação do Produto</label>
              <textarea rows={2} value={form.obs_produto} onChange={e => setCampo('obs_produto', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Reforma Tributária: IBS/CBS gerais do item</legend>
          <div className="form-row">
            <div className="form-group">
              <label>CST IBS/CBS</label>
              <input type="text" maxLength={3} value={form.reforma_cst_ibscbs} onChange={e => setCampo('reforma_cst_ibscbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Classe Tributária (cClassTrib)</label>
              <input type="text" maxLength={10} value={form.reforma_cclasstrib} onChange={e => setCampo('reforma_cclasstrib', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Base Cálculo IBS/CBS</label>
              <input type="number" step="0.01" value={form.reforma_vbc_ibscbs} onChange={e => setCampo('reforma_vbc_ibscbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor do Item (Reforma)</label>
              <input type="number" step="0.01" value={form.reforma_vitem} onChange={e => setCampo('reforma_vitem', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Chave de Acesso</label>
              <input type="text" maxLength={44} value={form.reforma_chave_acesso} onChange={e => setCampo('reforma_chave_acesso', e.target.value)} />
            </div>
            <div className="form-group">
              <label>N. Item (Reforma)</label>
              <input type="number" value={form.reforma_nitem} onChange={e => setCampo('reforma_nitem', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Indicador Doação (S/N)</label>
              <input type="text" maxLength={1} value={form.reforma_inddoacao} onChange={e => setCampo('reforma_inddoacao', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Reforma Tributária: IBS-UF</legend>
          <div className="form-row">
            <div className="form-group">
              <label>% IBS UF</label>
              <input type="number" step="0.01" value={form.reforma_pibsuf_ibsuf} onChange={e => setCampo('reforma_pibsuf_ibsuf', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Diferimento IBS UF</label>
              <input type="number" step="0.01" value={form.reforma_pdif_ibsuf} onChange={e => setCampo('reforma_pdif_ibsuf', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor Diferido IBS UF</label>
              <input type="number" step="0.01" value={form.reforma_vdif_ibsuf} onChange={e => setCampo('reforma_vdif_ibsuf', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Devolução Tributária IBS UF</label>
              <input type="number" step="0.01" value={form.reforma_vdevtrib_ibsuf} onChange={e => setCampo('reforma_vdevtrib_ibsuf', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Redução Alíquota IBS UF</label>
              <input type="number" step="0.01" value={form.reforma_predaliq_ibsuf} onChange={e => setCampo('reforma_predaliq_ibsuf', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Alíquota Efetiva IBS UF</label>
              <input type="number" step="0.01" value={form.reforma_paliqefet_ibsuf} onChange={e => setCampo('reforma_paliqefet_ibsuf', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor IBS UF</label>
              <input type="number" step="0.01" value={form.reforma_vibsuf_ibsuf} onChange={e => setCampo('reforma_vibsuf_ibsuf', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Alíq. Efetiva Regime IBS UF</label>
              <input type="number" step="0.01" value={form.reforma_paliqefetregibsuf} onChange={e => setCampo('reforma_paliqefetregibsuf', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Tributo Regime IBS UF</label>
              <input type="number" step="0.01" value={form.reforma_vtribregibsuf} onChange={e => setCampo('reforma_vtribregibsuf', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Alíq. IBS UF (Gov)</label>
              <input type="number" step="0.01" value={form.reforma_paliqibsuf_gov} onChange={e => setCampo('reforma_paliqibsuf_gov', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Tributo IBS UF (Gov)</label>
              <input type="number" step="0.01" value={form.reforma_vtribibsuf_gov} onChange={e => setCampo('reforma_vtribibsuf_gov', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. IBS Transf. Crédito</label>
              <input type="number" step="0.01" value={form.reforma_vibs_transfcred} onChange={e => setCampo('reforma_vibs_transfcred', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. IBS Estimativa Crédito</label>
              <input type="number" step="0.01" value={form.reforma_vibsestcred} onChange={e => setCampo('reforma_vibsestcred', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Reforma Tributária: IBS-Município</legend>
          <div className="form-row">
            <div className="form-group">
              <label>% IBS Município</label>
              <input type="number" step="0.01" value={form.reforma_pibsmun_ibsmun} onChange={e => setCampo('reforma_pibsmun_ibsmun', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Diferimento IBS Município</label>
              <input type="number" step="0.01" value={form.reforma_pdif_ibsmun} onChange={e => setCampo('reforma_pdif_ibsmun', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor Diferido IBS Município</label>
              <input type="number" step="0.01" value={form.reforma_vdif_ibsmun} onChange={e => setCampo('reforma_vdif_ibsmun', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Devolução Tributária IBS Mun.</label>
              <input type="number" step="0.01" value={form.reforma_vdevtrib_ibsmun} onChange={e => setCampo('reforma_vdevtrib_ibsmun', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Redução Alíquota IBS Mun.</label>
              <input type="number" step="0.01" value={form.reforma_predaliq_ibsmun} onChange={e => setCampo('reforma_predaliq_ibsmun', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Alíquota Efetiva IBS Mun.</label>
              <input type="number" step="0.01" value={form.reforma_paliqefet_ibsmun} onChange={e => setCampo('reforma_paliqefet_ibsmun', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor IBS Município</label>
              <input type="number" step="0.01" value={form.reforma_vibsmun_ibsmun} onChange={e => setCampo('reforma_vibsmun_ibsmun', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Alíq. Efetiva Regime IBS Mun.</label>
              <input type="number" step="0.01" value={form.reforma_paliqefetregibsmun} onChange={e => setCampo('reforma_paliqefetregibsmun', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Tributo Regime IBS Mun.</label>
              <input type="number" step="0.01" value={form.reforma_vtribregibsmun} onChange={e => setCampo('reforma_vtribregibsmun', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Alíq. IBS Mun. (Gov)</label>
              <input type="number" step="0.01" value={form.reforma_paliqibsmun_gov} onChange={e => setCampo('reforma_paliqibsmun_gov', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Tributo IBS Mun. (Gov)</label>
              <input type="number" step="0.01" value={form.reforma_vtribibsmun_gov} onChange={e => setCampo('reforma_vtribibsmun_gov', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Reforma Tributária: IBS total</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Valor Total IBS</label>
              <input type="number" step="0.01" value={form.reforma_vibs} onChange={e => setCampo('reforma_vibs', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Reforma Tributária: CBS</legend>
          <div className="form-row">
            <div className="form-group">
              <label>% CBS</label>
              <input type="number" step="0.01" value={form.reforma_pcbs_cbs} onChange={e => setCampo('reforma_pcbs_cbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Diferimento CBS</label>
              <input type="number" step="0.01" value={form.reforma_pdif_cbs} onChange={e => setCampo('reforma_pdif_cbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor Diferido CBS</label>
              <input type="number" step="0.01" value={form.reforma_vdif_cbs} onChange={e => setCampo('reforma_vdif_cbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Devolução Tributária CBS</label>
              <input type="number" step="0.01" value={form.reforma_vdevtrib_cbs} onChange={e => setCampo('reforma_vdevtrib_cbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Redução Alíquota CBS</label>
              <input type="number" step="0.01" value={form.reforma_predaliq_cbs} onChange={e => setCampo('reforma_predaliq_cbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Alíquota Efetiva CBS</label>
              <input type="number" step="0.01" value={form.reforma_paliqefet_cbs} onChange={e => setCampo('reforma_paliqefet_cbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor CBS</label>
              <input type="number" step="0.01" value={form.reforma_vcbs_cbs} onChange={e => setCampo('reforma_vcbs_cbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Alíq. Efetiva Regime CBS</label>
              <input type="number" step="0.01" value={form.reforma_paliqefetregcbs} onChange={e => setCampo('reforma_paliqefetregcbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Tributo Regime CBS</label>
              <input type="number" step="0.01" value={form.reforma_vtribregcbs} onChange={e => setCampo('reforma_vtribregcbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Alíq. CBS (Gov)</label>
              <input type="number" step="0.01" value={form.reforma_paliqcbs_gov} onChange={e => setCampo('reforma_paliqcbs_gov', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Tributo CBS (Gov)</label>
              <input type="number" step="0.01" value={form.reforma_vtribcbs_gov} onChange={e => setCampo('reforma_vtribcbs_gov', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. CBS Transf. Crédito</label>
              <input type="number" step="0.01" value={form.reforma_vcbs_transfcred} onChange={e => setCampo('reforma_vcbs_transfcred', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. CBS Estimativa Crédito</label>
              <input type="number" step="0.01" value={form.reforma_vcbsestcred} onChange={e => setCampo('reforma_vcbsestcred', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Reforma Tributária: Registro Especial (regime regional)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>CST Regime Especial</label>
              <input type="text" maxLength={3} value={form.reforma_cstreg} onChange={e => setCampo('reforma_cstreg', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Classe Trib. Regime Especial</label>
              <input type="text" maxLength={10} value={form.reforma_cclasstribreg} onChange={e => setCampo('reforma_cclasstribreg', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Reforma Tributária: Crédito Presumido IBS/CBS</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Crédito Presumido IBS</label>
              <input type="text" maxLength={2} value={form.reforma_ccredpres_ibs} onChange={e => setCampo('reforma_ccredpres_ibs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Crédito Presumido IBS</label>
              <input type="number" step="0.01" value={form.reforma_pcredpres_ibs} onChange={e => setCampo('reforma_pcredpres_ibs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Crédito Presumido IBS</label>
              <input type="number" step="0.01" value={form.reforma_vcredpres_ibs} onChange={e => setCampo('reforma_vcredpres_ibs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Créd. Pres. Cond. Suspensiva IBS</label>
              <input type="number" step="0.01" value={form.reforma_vcredprescondsus_ibs} onChange={e => setCampo('reforma_vcredprescondsus_ibs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Crédito Presumido CBS</label>
              <input type="text" maxLength={2} value={form.reforma_ccredpres_cbs} onChange={e => setCampo('reforma_ccredpres_cbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% Crédito Presumido CBS</label>
              <input type="number" step="0.01" value={form.reforma_pcredpres_cbs} onChange={e => setCampo('reforma_pcredpres_cbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Crédito Presumido CBS</label>
              <input type="number" step="0.01" value={form.reforma_vcredpres_cbs} onChange={e => setCampo('reforma_vcredpres_cbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Créd. Pres. Cond. Suspensiva CBS</label>
              <input type="number" step="0.01" value={form.reforma_vcredprescondsus_cbs} onChange={e => setCampo('reforma_vcredprescondsus_cbs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tipo Créd. Pres. IBS ZFM</label>
              <input type="text" maxLength={1} value={form.reforma_tpcredpresibszfm} onChange={e => setCampo('reforma_tpcredpresibszfm', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. Créd. Pres. IBS ZFM</label>
              <input type="number" step="0.01" value={form.reforma_vcredpresibszfm} onChange={e => setCampo('reforma_vcredpresibszfm', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Reforma Tributária: IS (Imposto Seletivo)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>CST IS</label>
              <input type="text" maxLength={3} value={form.reforma_cstis_is} onChange={e => setCampo('reforma_cstis_is', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Classe Trib. IS</label>
              <input type="text" maxLength={10} value={form.reforma_cclasstribis_is} onChange={e => setCampo('reforma_cclasstribis_is', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Base Cálculo IS</label>
              <input type="number" step="0.01" value={form.reforma_vbcis_is} onChange={e => setCampo('reforma_vbcis_is', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% IS</label>
              <input type="number" step="0.01" value={form.reforma_pis_is} onChange={e => setCampo('reforma_pis_is', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% IS Específico</label>
              <input type="number" step="0.01" value={form.reforma_pisespec_is} onChange={e => setCampo('reforma_pisespec_is', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Unidade Tributável IS</label>
              <input type="text" maxLength={10} value={form.reforma_utrib_is} onChange={e => setCampo('reforma_utrib_is', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Qtde. Tributável IS</label>
              <input type="number" step="0.01" value={form.reforma_qtrib_is} onChange={e => setCampo('reforma_qtrib_is', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor IS</label>
              <input type="number" step="0.01" value={form.reforma_vis_is} onChange={e => setCampo('reforma_vis_is', e.target.value)} />
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

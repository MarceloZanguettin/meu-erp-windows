import React, { useCallback, useEffect, useState } from 'react';
import {
  listarItensEntrada,
  criarItemEntrada,
  atualizarItemEntrada,
  deletarItemEntrada,
} from '../services/itemEntradaService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  tipo_doc: '',
  doc: '',
  serie: '',
  cod_fornecedor: '',
  cod_produto: '',
  lote_produto: '',
  nitem_fornec: '',
  qtde: '',
  qtde_estq: '',
  unitario: '',
  total: '',
  frete: '',
  retirar: '',
  perc_a_prazo: '',
  vl_venda: '',
  taxa_fornecedor: '',
  credito_fornecedor: '',
  cpr: '',
  custo_item: '',
  custo_real: '',
  preco_custo: '',
  outros_custo: '',
  icms_custo: '',
  cod_empresa_nao_fiscal: '',
  cod_saida_vinculada: '',
  cod_empresa_saida_vinculada: '',
  doc_saida_vinculada: '',
  cf: '',
  fiscal: '',
  cod_cfop: '',
  tipo_imposto: '',
  csosn: '',
  cenq: '',
  icms: '',
  iva: '',
  iva_reajusta: '',
  icms_valor: '',
  icms_base_calculo: '',
  icms_reducao: '',
  icms_isento: '',
  icms_outras: '',
  icms_percentual_st: '',
  icms_reducao_st: '',
  icms_subst_tributaria: '',
  icms_base_subst_tributaria: '',
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
  reforma_cst_ibscbs: '',
  reforma_cclasstrib: '',
  reforma_vbc_ibscbs: '',
  reforma_vitem: '',
  reforma_pibsuf_ibsuf: '',
  reforma_pdif_ibsuf: '',
  reforma_vdif_ibsuf: '',
  reforma_vdevtrib_ibsuf: '',
  reforma_predaliq_ibsuf: '',
  reforma_paliqefet_ibsuf: '',
  reforma_vibsuf_ibsuf: '',
  reforma_paliqefetregibsuf: '',
  reforma_vtribregibsuf: '',
  reforma_vtribibsuf_gov: '',
  reforma_vibs_transfcred: '',
  reforma_pibsmun_ibsmun: '',
  reforma_pdif_ibsmun: '',
  reforma_vdif_ibsmun: '',
  reforma_vdevtrib_ibsmun: '',
  reforma_predaliq_ibsmun: '',
  reforma_paliqefet_ibsmun: '',
  reforma_vibsmun_ibsmun: '',
  reforma_paliqefetregibsmun: '',
  reforma_vtribregibsmun: '',
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
  reforma_vtribcbs_gov: '',
  reforma_vcbs_transfcred: '',
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
};

/**
 * Gerencia os itens de entrada/compra (GENUS: ENTLAN) de um produto — linhas
 * de nota fiscal de entrada em que este produto foi comprado/recebido. Cada
 * produto pode ter muitas linhas em ENTLAN (uma por entrada/nota fiscal em
 * que aparece) — por isso é uma lista, e não campos únicos do form principal
 * do produto, seguindo o mesmo padrão de lista + formulário já usado para
 * Itens de Saída (e demais abas filhas de produto: Produção, Movimentos,
 * Processos).
 *
 * ENTLAN não tem uma coluna única "CODENTRADA": o documento de entrada
 * (nota fiscal de compra, cabeçalho ainda sem model/janela própria neste
 * ERP) é identificado, dentro de ENTLAN, pela combinação de campos
 * Cód. Empresa + Tipo Documento + Documento + Série + Cód. Fornecedor —
 * por isso esses cinco campos são mantidos aqui como campos brutos, sem
 * combo/vínculo de fato com um cabeçalho de "Entrada" (isso será resolvido
 * quando esse cabeçalho ganhar seu próprio model, o próximo passo natural
 * do módulo Compras, análogo ao que falta para SAIDA/SAILAN no módulo
 * Vendas/Faturamento).
 *
 * Dado o grande número de campos originais da tabela GENUS (inclusive os da
 * Reforma Tributária — IBS/CBS), o formulário de inclusão/edição é
 * organizado em seções, no mesmo espírito usado na aba Itens de Saída.
 */
export default function TabelaItemEntrada({ produtoId }) {
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
      const dados = await listarItensEntrada(produtoId);
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
        await atualizarItemEntrada(editandoId, form);
      } else {
        await criarItemEntrada({ ...form, produto_id: produtoId });
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
    if (!window.confirm('Excluir este item de entrada?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarItemEntrada(id);
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
        Salve o produto primeiro para gerenciar os itens de entrada.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Itens de Entrada (GENUS: ENTLAN)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Documento</th>
            <th>Série</th>
            <th>Fornecedor</th>
            <th>Qtde</th>
            <th>Unitário</th>
            <th>Total</th>
            <th>CFOP</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={8} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={8} className="produto-busca-status">Nenhum item de entrada cadastrado para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.doc ?? '—'}</td>
              <td>{linha.serie ?? '—'}</td>
              <td>{linha.cod_fornecedor ?? '—'}</td>
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
          {editandoId ? `Editando item #${editandoId}` : 'Novo item de entrada'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Identificação / Documento de Entrada</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Empresa</label>
              <input type="number" value={form.cod_empresa} onChange={e => setCampo('cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tipo Documento</label>
              <input type="text" maxLength={1} value={form.tipo_doc} onChange={e => setCampo('tipo_doc', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Documento (Nº)</label>
              <input type="number" value={form.doc} onChange={e => setCampo('doc', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Série</label>
              <input type="text" maxLength={4} value={form.serie} onChange={e => setCampo('serie', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Fornecedor (GENUS)</label>
              <input type="number" value={form.cod_fornecedor} onChange={e => setCampo('cod_fornecedor', e.target.value)} />
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
              <label>Nº Item Fornecedor</label>
              <input type="number" value={form.nitem_fornec} onChange={e => setCampo('nitem_fornec', e.target.value)} />
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
              <label>Qtde. Estoque</label>
              <input type="number" step="0.01" value={form.qtde_estq} onChange={e => setCampo('qtde_estq', e.target.value)} />
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
              <label>Frete</label>
              <input type="number" step="0.01" value={form.frete} onChange={e => setCampo('frete', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Retirar (S/N)</label>
              <input type="text" maxLength={1} value={form.retirar} onChange={e => setCampo('retirar', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% a Prazo</label>
              <input type="number" step="0.01" value={form.perc_a_prazo} onChange={e => setCampo('perc_a_prazo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor de Venda</label>
              <input type="number" step="0.01" value={form.vl_venda} onChange={e => setCampo('vl_venda', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Taxa Fornecedor</label>
              <input type="number" step="0.01" value={form.taxa_fornecedor} onChange={e => setCampo('taxa_fornecedor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Crédito Fornecedor</label>
              <input type="number" step="0.01" value={form.credito_fornecedor} onChange={e => setCampo('credito_fornecedor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>CPR</label>
              <input type="number" step="0.01" value={form.cpr} onChange={e => setCampo('cpr', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Custos</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Custo do Item</label>
              <input type="number" step="0.01" value={form.custo_item} onChange={e => setCampo('custo_item', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Custo Real</label>
              <input type="number" step="0.01" value={form.custo_real} onChange={e => setCampo('custo_real', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Preço de Custo</label>
              <input type="number" step="0.01" value={form.preco_custo} onChange={e => setCampo('preco_custo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Outros Custos</label>
              <input type="number" step="0.01" value={form.outros_custo} onChange={e => setCampo('outros_custo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Custo</label>
              <input type="number" step="0.01" value={form.icms_custo} onChange={e => setCampo('icms_custo', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Referências / Saída vinculada (devolução)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Empresa Não Fiscal</label>
              <input type="number" value={form.cod_empresa_nao_fiscal} onChange={e => setCampo('cod_empresa_nao_fiscal', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Saída Vinculada</label>
              <input type="number" value={form.cod_saida_vinculada} onChange={e => setCampo('cod_saida_vinculada', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Empresa Saída Vinculada</label>
              <input type="number" value={form.cod_empresa_saida_vinculada} onChange={e => setCampo('cod_empresa_saida_vinculada', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Documento Saída Vinculada</label>
              <input type="number" value={form.doc_saida_vinculada} onChange={e => setCampo('doc_saida_vinculada', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Fiscal: ICMS / ICMS-ST</legend>
          <div className="form-row">
            <div className="form-group">
              <label>CF</label>
              <input type="text" maxLength={3} value={form.cf} onChange={e => setCampo('cf', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Fiscal</label>
              <input type="text" maxLength={12} value={form.fiscal} onChange={e => setCampo('fiscal', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. CFOP</label>
              <input type="text" maxLength={5} value={form.cod_cfop} onChange={e => setCampo('cod_cfop', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tipo Imposto</label>
              <input type="text" maxLength={1} value={form.tipo_imposto} onChange={e => setCampo('tipo_imposto', e.target.value)} />
            </div>
            <div className="form-group">
              <label>CSOSN</label>
              <input type="text" maxLength={4} value={form.csosn} onChange={e => setCampo('csosn', e.target.value)} />
            </div>
            <div className="form-group">
              <label>CENQ</label>
              <input type="text" maxLength={3} value={form.cenq} onChange={e => setCampo('cenq', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS</label>
              <input type="number" step="0.01" value={form.icms} onChange={e => setCampo('icms', e.target.value)} />
            </div>
            <div className="form-group">
              <label>IVA</label>
              <input type="number" step="0.01" value={form.iva} onChange={e => setCampo('iva', e.target.value)} />
            </div>
            <div className="form-group">
              <label>IVA Reajustado (S/N)</label>
              <input type="text" maxLength={1} value={form.iva_reajusta} onChange={e => setCampo('iva_reajusta', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Valor</label>
              <input type="number" step="0.01" value={form.icms_valor} onChange={e => setCampo('icms_valor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Base Cálculo</label>
              <input type="number" step="0.01" value={form.icms_base_calculo} onChange={e => setCampo('icms_base_calculo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Redução</label>
              <input type="number" step="0.01" value={form.icms_reducao} onChange={e => setCampo('icms_reducao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Isento</label>
              <input type="number" step="0.01" value={form.icms_isento} onChange={e => setCampo('icms_isento', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Outras</label>
              <input type="number" step="0.01" value={form.icms_outras} onChange={e => setCampo('icms_outras', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS % ST</label>
              <input type="number" step="0.01" value={form.icms_percentual_st} onChange={e => setCampo('icms_percentual_st', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Redução ST</label>
              <input type="number" step="0.01" value={form.icms_reducao_st} onChange={e => setCampo('icms_reducao_st', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Subst. Tributária</label>
              <input type="number" step="0.01" value={form.icms_subst_tributaria} onChange={e => setCampo('icms_subst_tributaria', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ICMS Base Subst. Tributária</label>
              <input type="number" step="0.01" value={form.icms_base_subst_tributaria} onChange={e => setCampo('icms_base_subst_tributaria', e.target.value)} />
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
              <label>Vl. Tributo IBS UF (Gov)</label>
              <input type="number" step="0.01" value={form.reforma_vtribibsuf_gov} onChange={e => setCampo('reforma_vtribibsuf_gov', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. IBS Transf. Crédito</label>
              <input type="number" step="0.01" value={form.reforma_vibs_transfcred} onChange={e => setCampo('reforma_vibs_transfcred', e.target.value)} />
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
              <label>Vl. Tributo CBS (Gov)</label>
              <input type="number" step="0.01" value={form.reforma_vtribcbs_gov} onChange={e => setCampo('reforma_vtribcbs_gov', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vl. CBS Transf. Crédito</label>
              <input type="number" step="0.01" value={form.reforma_vcbs_transfcred} onChange={e => setCampo('reforma_vcbs_transfcred', e.target.value)} />
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

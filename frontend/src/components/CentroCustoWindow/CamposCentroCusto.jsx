import React from 'react';

/**
 * Campos do formulário de Centro de Custo (GENUS.CENTROCUSTO) — reutilizado
 * tanto pelo modal de edição em CentroCustoWindow quanto pela janela de
 * criação NovoCentroCustoWindow, para os dois ficarem sempre em sincronia.
 */
export default function CamposCentroCusto({ form, setForm }) {
  const set = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [campo]: valor });
  };

  return (
    <>
      <div className="cc-secao">Identidade do Centro de Custo (ERP)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Código *</label>
          <input value={form.codigo} onChange={set('codigo')} required />
        </div>
        <div className="form-group form-group-full">
          <label>Nome *</label>
          <input value={form.nome} onChange={set('nome')} required />
        </div>
        <div className="form-group form-group-checkbox">
          <label>
            <input type="checkbox" checked={!!form.ativo} onChange={set('ativo')} />
            Ativo
          </label>
        </div>
      </div>

      <div className="cc-secao">Identificação (GENUS — chave real CODPRODUTO + CODEMPRESA)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Produto (GENUS)</label>
          <input value={form.cod_produto} onChange={set('cod_produto')} />
        </div>
        <div className="form-group">
          <label>Cód. Empresa (GENUS)</label>
          <input type="number" value={form.cod_empresa} onChange={set('cod_empresa')} />
        </div>
        <div className="form-group">
          <label>Pertence à Empresa</label>
          <input maxLength={1} value={form.pertence_empresa} onChange={set('pertence_empresa')} placeholder="S/N" />
        </div>
      </div>

      <div className="cc-secao">Preço / Comercial</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>ECF Alíquota</label>
          <input value={form.ecf_aliquota} onChange={set('ecf_aliquota')} />
        </div>
        <div className="form-group">
          <label>Custo</label>
          <input type="number" step="0.01" value={form.custo} onChange={set('custo')} />
        </div>
        <div className="form-group">
          <label>Venda</label>
          <input type="number" step="0.01" value={form.venda} onChange={set('venda')} />
        </div>
        <div className="form-group">
          <label>Frete</label>
          <input type="number" step="0.01" value={form.frete} onChange={set('frete')} />
        </div>
        <div className="form-group">
          <label>Mínimo</label>
          <input type="number" step="0.01" value={form.minimo} onChange={set('minimo')} />
        </div>
        <div className="form-group">
          <label>Máximo</label>
          <input type="number" step="0.01" value={form.maximo} onChange={set('maximo')} />
        </div>
        <div className="form-group">
          <label>Quantidade</label>
          <input type="number" step="0.01" value={form.qtde} onChange={set('qtde')} />
        </div>
        <div className="form-group">
          <label>Consignação</label>
          <input type="number" step="0.01" value={form.consignacao} onChange={set('consignacao')} />
        </div>
        <div className="form-group">
          <label>Valor Promoção</label>
          <input type="number" step="0.01" value={form.valor_promocao} onChange={set('valor_promocao')} />
        </div>
        <div className="form-group">
          <label>Início Promoção</label>
          <input type="date" value={form.inicio_promocao} onChange={set('inicio_promocao')} />
        </div>
        <div className="form-group">
          <label>Fim Promoção</label>
          <input type="date" value={form.fim_promocao} onChange={set('fim_promocao')} />
        </div>
        <div className="form-group">
          <label>Estoque Cliente</label>
          <input type="number" step="0.01" value={form.estoque_cliente} onChange={set('estoque_cliente')} />
        </div>
        <div className="form-group">
          <label>Custo Fixo</label>
          <input type="number" step="0.01" value={form.custo_fixo} onChange={set('custo_fixo')} />
        </div>
        <div className="form-group">
          <label>Margem de Lucro (%)</label>
          <input type="number" step="0.01" value={form.margem_lucro} onChange={set('margem_lucro')} />
        </div>
        <div className="form-group">
          <label>Comissão (%)</label>
          <input type="number" step="0.01" value={form.comissao} onChange={set('comissao')} />
        </div>
        <div className="form-group">
          <label>À Vista</label>
          <input type="number" step="0.01" value={form.avista} onChange={set('avista')} />
        </div>
        <div className="form-group">
          <label>Comissão À Vista (%)</label>
          <input type="number" step="0.01" value={form.comissao_avista} onChange={set('comissao_avista')} />
        </div>
        <div className="form-group">
          <label>Percentual À Vista</label>
          <input type="number" step="0.01" value={form.percentual_avista} onChange={set('percentual_avista')} />
        </div>
        <div className="form-group">
          <label>Preço Mínimo</label>
          <input type="number" step="0.01" value={form.preco_minimo} onChange={set('preco_minimo')} />
        </div>
        <div className="form-group">
          <label>Percentual a Prazo</label>
          <input type="number" step="0.01" value={form.percentual_a_prazo} onChange={set('percentual_a_prazo')} />
        </div>
        <div className="form-group">
          <label>Percentual Mínimo</label>
          <input type="number" step="0.01" value={form.percentual_minimo} onChange={set('percentual_minimo')} />
        </div>
        <div className="form-group">
          <label>Último Custo</label>
          <input type="number" step="0.01" value={form.ultimo_custo} onChange={set('ultimo_custo')} />
        </div>
        <div className="form-group">
          <label>Custo Médio</label>
          <input type="number" step="0.01" value={form.custo_medio} onChange={set('custo_medio')} />
        </div>
        <div className="form-group">
          <label>Preço Sugerido</label>
          <input type="number" step="0.01" value={form.preco_sugerido} onChange={set('preco_sugerido')} />
        </div>
        <div className="form-group">
          <label>Unitário Compra</label>
          <input type="number" step="0.01" value={form.unitario_compra} onChange={set('unitario_compra')} />
        </div>
        <div className="form-group">
          <label>Cód. Fornecedor Compra (GENUS)</label>
          <input type="number" value={form.fornecedor_compra} onChange={set('fornecedor_compra')} />
        </div>
        <div className="form-group">
          <label>Mão de Obra</label>
          <input type="number" step="0.01" value={form.mao_de_obra} onChange={set('mao_de_obra')} />
        </div>
        <div className="form-group">
          <label>Custo Matéria</label>
          <input type="number" step="0.01" value={form.custo_materia} onChange={set('custo_materia')} />
        </div>
        <div className="form-group form-group-full">
          <label>Localização do Produto</label>
          <input value={form.localizacao_produto} onChange={set('localizacao_produto')} />
        </div>
      </div>

      <div className="cc-secao">Estoque</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Estoque Reservado</label>
          <input type="number" step="0.01" value={form.estoque_reservado} onChange={set('estoque_reservado')} />
        </div>
        <div className="form-group">
          <label>Físico</label>
          <input type="number" step="0.01" value={form.fisico} onChange={set('fisico')} />
        </div>
      </div>

      <div className="cc-secao">Fiscal — ICMS / IPI</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Redução ICMS</label>
          <input type="number" step="0.01" value={form.reducao_icms} onChange={set('reducao_icms')} />
        </div>
        <div className="form-group">
          <label>Diferença Subst. Tributária</label>
          <input type="number" step="0.01" value={form.diferenca_subst} onChange={set('diferenca_subst')} />
        </div>
        <div className="form-group">
          <label>Diferença ICMS</label>
          <input type="number" step="0.01" value={form.diferenca_icms} onChange={set('diferenca_icms')} />
        </div>
        <div className="form-group">
          <label>IPI Entrada</label>
          <input type="number" step="0.01" value={form.ipi_entrada} onChange={set('ipi_entrada')} />
        </div>
        <div className="form-group">
          <label>IPI CST Entrada</label>
          <input value={form.ipi_cst_entrada} onChange={set('ipi_cst_entrada')} />
        </div>
        <div className="form-group">
          <label>IPI CST Saída</label>
          <input value={form.ipi_cst_saida} onChange={set('ipi_cst_saida')} />
        </div>
      </div>

      <div className="cc-secao">Fiscal — PIS / COFINS</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>PIS CST</label>
          <input value={form.pis_cst} onChange={set('pis_cst')} />
        </div>
        <div className="form-group">
          <label>PIS Alíquota</label>
          <input type="number" step="0.0001" value={form.pis_aliquota} onChange={set('pis_aliquota')} />
        </div>
        <div className="form-group">
          <label>PIS Reais</label>
          <input type="number" step="0.01" value={form.pis_reais} onChange={set('pis_reais')} />
        </div>
        <div className="form-group">
          <label>PIS CST Entrada</label>
          <input value={form.pis_cst_entrada} onChange={set('pis_cst_entrada')} />
        </div>
        <div className="form-group">
          <label>PIS Alíquota Entrada</label>
          <input type="number" step="0.0001" value={form.pis_aliquota_entrada} onChange={set('pis_aliquota_entrada')} />
        </div>
        <div className="form-group">
          <label>PIS Reais Entrada</label>
          <input type="number" step="0.01" value={form.pis_reais_entrada} onChange={set('pis_reais_entrada')} />
        </div>
        <div className="form-group">
          <label>COFINS CST</label>
          <input value={form.cofins_cst} onChange={set('cofins_cst')} />
        </div>
        <div className="form-group">
          <label>COFINS Alíquota</label>
          <input type="number" step="0.0001" value={form.cofins_aliquota} onChange={set('cofins_aliquota')} />
        </div>
        <div className="form-group">
          <label>COFINS Reais</label>
          <input type="number" step="0.01" value={form.cofins_reais} onChange={set('cofins_reais')} />
        </div>
        <div className="form-group">
          <label>COFINS CST Entrada</label>
          <input value={form.cofins_cst_entrada} onChange={set('cofins_cst_entrada')} />
        </div>
        <div className="form-group">
          <label>COFINS Alíquota Entrada</label>
          <input type="number" step="0.0001" value={form.cofins_aliquota_entrada} onChange={set('cofins_aliquota_entrada')} />
        </div>
        <div className="form-group">
          <label>COFINS Reais Entrada</label>
          <input type="number" step="0.01" value={form.cofins_reais_entrada} onChange={set('cofins_reais_entrada')} />
        </div>
      </div>

      <div className="cc-secao">Balança</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Tecla Balança</label>
          <input type="number" value={form.tecla_balanca} onChange={set('tecla_balanca')} />
        </div>
        <div className="form-group">
          <label>Tipo Balança</label>
          <input maxLength={1} value={form.tipo_balanca} onChange={set('tipo_balanca')} />
        </div>
        <div className="form-group">
          <label>Cód. Balança</label>
          <input type="number" value={form.cod_balanca} onChange={set('cod_balanca')} />
        </div>
        <div className="form-group">
          <label>Validade (dias)</label>
          <input type="number" value={form.validade} onChange={set('validade')} />
        </div>
      </div>

      <div className="cc-secao">Patrimônio / Bem (veículo, equipamento etc.)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Data de Aquisição</label>
          <input type="date" value={form.data_aquisicao} onChange={set('data_aquisicao')} />
        </div>
        <div className="form-group">
          <label>Nota Patrimônio</label>
          <input type="number" value={form.nota_patrimonio} onChange={set('nota_patrimonio')} />
        </div>
        <div className="form-group">
          <label>Cód. Patrimônio</label>
          <input type="number" value={form.cod_patrimonio} onChange={set('cod_patrimonio')} />
        </div>
        <div className="form-group">
          <label>Valor Patrimônio</label>
          <input type="number" step="0.01" value={form.valor_patrimonio} onChange={set('valor_patrimonio')} />
        </div>
        <div className="form-group">
          <label>Data de Garantia</label>
          <input type="date" value={form.data_garantia} onChange={set('data_garantia')} />
        </div>
        <div className="form-group">
          <label>Data de Depreciação</label>
          <input type="date" value={form.data_depreciacao} onChange={set('data_depreciacao')} />
        </div>
        <div className="form-group">
          <label>Taxa de Depreciação (%)</label>
          <input type="number" step="0.01" value={form.taxa_depreciacao} onChange={set('taxa_depreciacao')} />
        </div>
        <div className="form-group">
          <label>Valor de Depreciação</label>
          <input type="number" step="0.01" value={form.valor_depreciacao} onChange={set('valor_depreciacao')} />
        </div>
        <div className="form-group">
          <label>Data de Revisão</label>
          <input type="date" value={form.data_revisao} onChange={set('data_revisao')} />
        </div>
        <div className="form-group">
          <label>Placa</label>
          <input value={form.placa} onChange={set('placa')} />
        </div>
        <div className="form-group">
          <label>Chassi</label>
          <input value={form.chassi} onChange={set('chassi')} />
        </div>
        <div className="form-group">
          <label>Capacidade</label>
          <input type="number" step="0.01" value={form.capacidade} onChange={set('capacidade')} />
        </div>
        <div className="form-group">
          <label>Troca de Óleo (km)</label>
          <input type="number" value={form.troca_oleo_km} onChange={set('troca_oleo_km')} />
        </div>
        <div className="form-group">
          <label>Data Troca de Óleo</label>
          <input type="date" value={form.data_troca_oleo} onChange={set('data_troca_oleo')} />
        </div>
      </div>

      <div className="cc-secao">Auditoria de Origem (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Data de Alteração</label>
          <input type="date" value={form.data_alteracao_genus} onChange={set('data_alteracao_genus')} />
        </div>
        <div className="form-group">
          <label>Data/Hora Alterado</label>
          <input type="date" value={form.data_hora_alterado_genus} onChange={set('data_hora_alterado_genus')} />
        </div>
      </div>
    </>
  );
}

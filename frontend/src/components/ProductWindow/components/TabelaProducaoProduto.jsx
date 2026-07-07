import React, { useCallback, useEffect, useState } from 'react';
import {
  listarProdutoProducoes,
  criarProdutoProducao,
  atualizarProdutoProducao,
  deletarProdutoProducao,
} from '../services/produtoProducaoService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  codigo: '',
  lote: '',
  cod_produto: '',

  data_producao: '',
  data_previsao: '',
  hora_previsao: '',
  fechado: '',
  auditado: '',
  data_entrega: '',

  cod_funcionario: '',
  cod_solicitante: '',
  cod_pedido_lan: '',
  cod_producao_etapas: '',
  cod_funcionario_audita: '',
  cod_funcionario_fecha: '',

  observacao: '',
  observacao_detalhe: '',

  imprimiu_etiqueta: '',
  estoque_reservado: '',
  processos_finalizados: '',
  tipo_calculo: '',
  considerar_tarugo_extrusao: '',

  qtde_fisico: '',
  qtde_fisico_pedido: '',
  qtde: '',
  qtde_produzida: '',
  total_produzido_real: '',
  porcentagem: '',
  aparas: '',
  estoque: '',

  sanfona: '',
  extrusao: '',
  espessura: '',
  largura: '',
  comprimento: '',
  linear: '',
  unidade_medida: '',
  cor_selecionada: '',
  pigmento: '',

  variacao_espessura: '',
  variacao_largura: '',
  variacao_comprimento: '',
};

const fmtData = (v) => (v ? String(v).slice(0, 10) : '');

/**
 * Gerencia os registros de produção (lotes/ordens de produção — GENUS.
 * PRODUTOPRODUCAO) de um produto. Cada produto pode ter vários registros em
 * PRODUTOPRODUCAO — um por lote/ordem de produção gerado — por isso é uma
 * lista, e não campos únicos do form principal do produto.
 *
 * Dado o grande número de campos originais da tabela GENUS, o formulário de
 * inclusão/edição é organizado em seções (identificação, datas,
 * responsáveis, quantidades, medidas, situação, observações) em vez de uma
 * única linha inline — mas continua no mesmo padrão de lista + formulário
 * usado pelas demais abas filhas de produto (Processos, Regras cliente,
 * Código de barras).
 */
export default function TabelaProducaoProduto({ produtoId }) {
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
      const dados = await listarProdutoProducoes(produtoId);
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
      data_producao: fmtData(linha.data_producao),
      data_previsao: fmtData(linha.data_previsao),
      fechado: fmtData(linha.fechado),
      auditado: fmtData(linha.auditado),
      data_entrega: fmtData(linha.data_entrega),
    });
  };

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      if (editandoId) {
        await atualizarProdutoProducao(editandoId, form);
      } else {
        await criarProdutoProducao({ ...form, produto_id: produtoId });
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
    if (!window.confirm('Excluir este registro de produção?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarProdutoProducao(id);
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
        Salve o produto primeiro para gerenciar os registros de produção.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Produção (GENUS: PRODUTOPRODUCAO)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Lote</th>
            <th>Data Produção</th>
            <th>Data Previsão</th>
            <th>Qtde</th>
            <th>Qtde Produzida</th>
            <th>Situação</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={7} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={7} className="produto-busca-status">Nenhum registro de produção cadastrado para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.lote ?? '—'}</td>
              <td>{fmtData(linha.data_producao) || '—'}</td>
              <td>{fmtData(linha.data_previsao) || '—'}</td>
              <td>{linha.qtde ?? '—'}</td>
              <td>{linha.qtde_produzida ?? '—'}</td>
              <td>{linha.fechado ? 'Fechado' : 'Aberto'}</td>
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
          {editandoId ? `Editando registro #${editandoId}` : 'Novo registro de produção'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Identificação</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Lote</label>
              <input type="text" maxLength={10} value={form.lote} onChange={e => setCampo('lote', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Empresa</label>
              <input type="number" value={form.cod_empresa} onChange={e => setCampo('cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Código (GENUS)</label>
              <input type="number" value={form.codigo} onChange={e => setCampo('codigo', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Datas</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Data Produção</label>
              <input type="date" value={form.data_producao} onChange={e => setCampo('data_producao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Data Previsão</label>
              <input type="date" value={form.data_previsao} onChange={e => setCampo('data_previsao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Hora Previsão</label>
              <input type="text" maxLength={10} value={form.hora_previsao} onChange={e => setCampo('hora_previsao', e.target.value)} placeholder="hh:mm" />
            </div>
            <div className="form-group">
              <label>Fechado em</label>
              <input type="date" value={form.fechado} onChange={e => setCampo('fechado', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Auditado em</label>
              <input type="date" value={form.auditado} onChange={e => setCampo('auditado', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Data Entrega</label>
              <input type="date" value={form.data_entrega} onChange={e => setCampo('data_entrega', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Responsáveis (códigos GENUS)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Funcionário</label>
              <input type="number" value={form.cod_funcionario} onChange={e => setCampo('cod_funcionario', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Solicitante</label>
              <input type="number" value={form.cod_solicitante} onChange={e => setCampo('cod_solicitante', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Pedido/Lan.</label>
              <input type="number" value={form.cod_pedido_lan} onChange={e => setCampo('cod_pedido_lan', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Etapas Produção</label>
              <input type="number" value={form.cod_producao_etapas} onChange={e => setCampo('cod_producao_etapas', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Funcionário Audita</label>
              <input type="number" value={form.cod_funcionario_audita} onChange={e => setCampo('cod_funcionario_audita', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Funcionário Fecha</label>
              <input type="number" value={form.cod_funcionario_fecha} onChange={e => setCampo('cod_funcionario_fecha', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Quantidades</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Qtde. Físico</label>
              <input type="number" step="0.01" value={form.qtde_fisico} onChange={e => setCampo('qtde_fisico', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Qtde. Físico Pedido</label>
              <input type="number" step="0.01" value={form.qtde_fisico_pedido} onChange={e => setCampo('qtde_fisico_pedido', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Qtde.</label>
              <input type="number" step="0.01" value={form.qtde} onChange={e => setCampo('qtde', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Qtde. Produzida</label>
              <input type="number" step="0.01" value={form.qtde_produzida} onChange={e => setCampo('qtde_produzida', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Total Produzido Real</label>
              <input type="number" step="0.01" value={form.total_produzido_real} onChange={e => setCampo('total_produzido_real', e.target.value)} />
            </div>
            <div className="form-group">
              <label>% (PORPCT)</label>
              <input type="number" step="0.01" value={form.porcentagem} onChange={e => setCampo('porcentagem', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Aparas</label>
              <input type="number" step="0.01" value={form.aparas} onChange={e => setCampo('aparas', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Estoque</label>
              <input type="number" step="0.01" value={form.estoque} onChange={e => setCampo('estoque', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Medidas / Especificações</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Sanfona</label>
              <input type="text" maxLength={100} value={form.sanfona} onChange={e => setCampo('sanfona', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Extrusão</label>
              <input type="text" maxLength={100} value={form.extrusao} onChange={e => setCampo('extrusao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Espessura</label>
              <input type="number" step="0.01" value={form.espessura} onChange={e => setCampo('espessura', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Largura</label>
              <input type="number" step="0.01" value={form.largura} onChange={e => setCampo('largura', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Comprimento</label>
              <input type="number" step="0.01" value={form.comprimento} onChange={e => setCampo('comprimento', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Linear</label>
              <input type="number" step="0.01" value={form.linear} onChange={e => setCampo('linear', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Unidade Medida</label>
              <input type="text" maxLength={5} value={form.unidade_medida} onChange={e => setCampo('unidade_medida', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cor Selecionada</label>
              <input type="text" maxLength={25} value={form.cor_selecionada} onChange={e => setCampo('cor_selecionada', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Pigmento</label>
              <input type="text" maxLength={60} value={form.pigmento} onChange={e => setCampo('pigmento', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Variações Apuradas</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Variação Espessura</label>
              <input type="number" step="0.01" value={form.variacao_espessura} onChange={e => setCampo('variacao_espessura', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Variação Largura</label>
              <input type="number" step="0.01" value={form.variacao_largura} onChange={e => setCampo('variacao_largura', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Variação Comprimento</label>
              <input type="number" step="0.01" value={form.variacao_comprimento} onChange={e => setCampo('variacao_comprimento', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Situação</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Imprimiu Etiqueta (S/N)</label>
              <input type="text" maxLength={1} value={form.imprimiu_etiqueta} onChange={e => setCampo('imprimiu_etiqueta', e.target.value.toUpperCase())} />
            </div>
            <div className="form-group">
              <label>Estoque Reservado (S/N)</label>
              <input type="text" maxLength={1} value={form.estoque_reservado} onChange={e => setCampo('estoque_reservado', e.target.value.toUpperCase())} />
            </div>
            <div className="form-group">
              <label>Processos Finalizados (S/N)</label>
              <input type="text" maxLength={1} value={form.processos_finalizados} onChange={e => setCampo('processos_finalizados', e.target.value.toUpperCase())} />
            </div>
            <div className="form-group">
              <label>Tipo Cálculo</label>
              <input type="text" maxLength={1} value={form.tipo_calculo} onChange={e => setCampo('tipo_calculo', e.target.value.toUpperCase())} />
            </div>
            <div className="form-group">
              <label>Considerar Tarugo Extrusão (S/N)</label>
              <input type="text" maxLength={1} value={form.considerar_tarugo_extrusao} onChange={e => setCampo('considerar_tarugo_extrusao', e.target.value.toUpperCase())} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Observações</legend>
          <div className="form-group">
            <label>Observação</label>
            <textarea rows={2} value={form.observacao} onChange={e => setCampo('observacao', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Observação Detalhada</label>
            <textarea rows={2} value={form.observacao_detalhe} onChange={e => setCampo('observacao_detalhe', e.target.value)} />
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

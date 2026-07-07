import React, { useCallback, useEffect, useState } from 'react';
import {
  listarProdutosExcluidos,
  criarProdutoExcluido,
  atualizarProdutoExcluido,
  deletarProdutoExcluido,
} from '../services/produtoExcluidoService.js';

const REGISTRO_VAZIO = {
  cod_produto: '',
  descricao: '',
  unidade: '',
  cod_grupo: '',
  cod_subgrupo: '',
  cod_marca: '',
  situacao: '',
  ecf_descricao: '',
  qtde_embalagem: '',
  ncm: '',
  cst: '',
  cod_classificacao: '',
  margem_lucro: '',
  marcador: '',
  csosn: '',
  peso_liquido: '',
  peso_bruto: '',
  codigo_interno: '',
  tipo_produto: '',
  validade_dias: '',
  cubicagem: '',
  observacao: '',
  descricao_interna: '',
  referencia: '',
  multiplo_producao: '',
  descricao_detalhada: '',
  cod_cor: '',
  cod_tamanho: '',
  cod_alteracao: '',
  hora_alteracao_genus: '',
  data_alteracao_genus: '',
  cod_funcionario_inclusao: '',
  cod_funcionario_alteracao: '',
};

/**
 * Gerencia o registro de exclusão (GENUS.DEL_PRODUTO) de um produto.
 * Diferente das outras tabelas "filhas" de PRODUTO (código de barras,
 * processos, movimentos etc.), DEL_PRODUTO não tem foreign key alguma no
 * GENUS — é um "lixo"/histórico com uma cópia dos atributos do produto no
 * momento em que ele foi excluído de PRODUTO. Por isso, assim como
 * PRODUTOFOTO, é modelado aqui como 1:1 (no máximo um registro por
 * produto), não como uma lista.
 */
export default function ProdutoExcluido({ produtoId }) {
  const [registro, setRegistro] = useState(null); // ProdutoExcluidoOut atual ou null
  const [form, setForm] = useState(REGISTRO_VAZIO);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    if (!produtoId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarProdutosExcluidos(produtoId);
      const atual = dados[0] ?? null;
      setRegistro(atual);
      setForm(atual ? { ...REGISTRO_VAZIO, ...atual } : REGISTRO_VAZIO);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [produtoId]);

  useEffect(() => { carregar(); }, [carregar]);

  const setCampo = (campo, valor) => setForm(v => ({ ...v, [campo]: valor }));

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      if (registro?.id) {
        await atualizarProdutoExcluido(registro.id, form);
      } else {
        await criarProdutoExcluido({ ...form, produto_id: produtoId });
      }
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async () => {
    if (!registro?.id) return;
    if (!window.confirm('Remover o registro de exclusão deste produto?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarProdutoExcluido(registro.id);
      setForm(REGISTRO_VAZIO);
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
        Salve o produto primeiro para consultar o histórico de exclusão.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Histórico de Exclusão (GENUS: DEL_PRODUTO)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}
      {carregando && <div className="produto-busca-status">Carregando...</div>}

      {!carregando && !registro && (
        <div className="produto-busca-status" style={{ marginBottom: 10 }}>
          Nenhum registro de exclusão encontrado para este produto no GENUS.
        </div>
      )}

      <form onSubmit={salvar}>
        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Identificação</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Código (GENUS)</label>
              <input type="text" maxLength={15} value={form.cod_produto} onChange={e => setCampo('cod_produto', e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Descrição</label>
              <input type="text" maxLength={120} value={form.descricao} onChange={e => setCampo('descricao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Código Interno</label>
              <input type="text" maxLength={30} value={form.codigo_interno} onChange={e => setCampo('codigo_interno', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Referência</label>
              <input type="text" maxLength={20} value={form.referencia} onChange={e => setCampo('referencia', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Descrição Interna</label>
              <input type="text" maxLength={50} value={form.descricao_interna} onChange={e => setCampo('descricao_interna', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Descrição ECF</label>
              <input type="text" maxLength={29} value={form.ecf_descricao} onChange={e => setCampo('ecf_descricao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Marcador</label>
              <input type="text" maxLength={10} value={form.marcador} onChange={e => setCampo('marcador', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Situação</label>
              <input type="text" maxLength={1} value={form.situacao} onChange={e => setCampo('situacao', e.target.value.toUpperCase())} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Descrição Detalhada</label>
              <textarea rows={2} value={form.descricao_detalhada} onChange={e => setCampo('descricao_detalhada', e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Observação</label>
              <textarea rows={2} value={form.observacao} onChange={e => setCampo('observacao', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Classificação</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Unidade</label>
              <input type="text" maxLength={6} value={form.unidade} onChange={e => setCampo('unidade', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Grupo</label>
              <input type="number" value={form.cod_grupo} onChange={e => setCampo('cod_grupo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Subgrupo</label>
              <input type="number" value={form.cod_subgrupo} onChange={e => setCampo('cod_subgrupo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Marca</label>
              <input type="number" value={form.cod_marca} onChange={e => setCampo('cod_marca', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Classificação</label>
              <input type="number" value={form.cod_classificacao} onChange={e => setCampo('cod_classificacao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Cor</label>
              <input type="number" value={form.cod_cor} onChange={e => setCampo('cod_cor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Tamanho</label>
              <input type="text" maxLength={5} value={form.cod_tamanho} onChange={e => setCampo('cod_tamanho', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tipo Produto</label>
              <input type="text" maxLength={1} value={form.tipo_produto} onChange={e => setCampo('tipo_produto', e.target.value.toUpperCase())} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Fiscal</legend>
          <div className="form-row">
            <div className="form-group">
              <label>NCM</label>
              <input type="text" maxLength={10} value={form.ncm} onChange={e => setCampo('ncm', e.target.value)} />
            </div>
            <div className="form-group">
              <label>CST</label>
              <input type="text" maxLength={3} value={form.cst} onChange={e => setCampo('cst', e.target.value)} />
            </div>
            <div className="form-group">
              <label>CSOSN</label>
              <input type="text" maxLength={4} value={form.csosn} onChange={e => setCampo('csosn', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Unidades / Pesos / Comercial</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Qtde. Embalagem</label>
              <input type="number" step="0.001" value={form.qtde_embalagem} onChange={e => setCampo('qtde_embalagem', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Múltiplo Produção</label>
              <input type="number" value={form.multiplo_producao} onChange={e => setCampo('multiplo_producao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Peso Líquido</label>
              <input type="number" step="0.001" value={form.peso_liquido} onChange={e => setCampo('peso_liquido', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Peso Bruto</label>
              <input type="number" step="0.001" value={form.peso_bruto} onChange={e => setCampo('peso_bruto', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Cubicagem</label>
              <input type="number" step="0.001" value={form.cubicagem} onChange={e => setCampo('cubicagem', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Margem de Lucro</label>
              <input type="number" step="0.001" value={form.margem_lucro} onChange={e => setCampo('margem_lucro', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Validade (dias)</label>
              <input type="number" value={form.validade_dias} onChange={e => setCampo('validade_dias', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Auditoria (GENUS)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Alteração</label>
              <input type="number" value={form.cod_alteracao} onChange={e => setCampo('cod_alteracao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Hora Alteração</label>
              <input type="text" maxLength={8} value={form.hora_alteracao_genus} onChange={e => setCampo('hora_alteracao_genus', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Data Alteração</label>
              <input type="date" value={form.data_alteracao_genus ? String(form.data_alteracao_genus).slice(0, 10) : ''} onChange={e => setCampo('data_alteracao_genus', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Funcionário Inclusão</label>
              <input type="number" value={form.cod_funcionario_inclusao} onChange={e => setCampo('cod_funcionario_inclusao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Funcionário Alteração</label>
              <input type="number" value={form.cod_funcionario_alteracao} onChange={e => setCampo('cod_funcionario_alteracao', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
          {registro?.id && (
            <button type="button" className="btn-cancel" disabled={salvando} onClick={excluir}>Remover registro</button>
          )}
          <button type="button" className="btn-save" disabled={salvando} onClick={salvar}>
            {salvando ? 'Salvando...' : (registro?.id ? 'Salvar alterações' : '+ Adicionar registro')}
          </button>
        </div>
      </form>
    </fieldset>
  );
}

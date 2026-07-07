import React, { useCallback, useEffect, useState } from 'react';
import {
  listarNotasCorrecao,
  criarNotaCorrecao,
  atualizarNotaCorrecao,
  deletarNotaCorrecao,
} from '../services/notaCorrecaoService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  cod_saida: '',
  sequencia: '',
  texto: '',
  emissao: '',
  arq_xml: '',
  saida_id: '',
};

/**
 * Gerencia a(s) Carta(s) de Correção Eletrônica (CC-e) vinculada(s) a uma
 * saída já salva (GENUS: NOTACORRECAO) — tabela "filha"/detalhe de `Saida`,
 * vinculada pelo par CODEMPRESA + CODSAIDA (o mesmo par natural já usado por
 * `TabelaNotaXml`/NOTAXML neste mesmo módulo de Vendas/Faturamento). 1:N: uma
 * mesma saída pode ter várias CC-e ao longo do tempo, cada uma com seu
 * próprio número sequencial. Segue o mesmo padrão de lista + formulário.
 *
 * `saida_id` (FK para a saída já migrada neste ERP, quando resolvida) é
 * opcional — a resolução de fato de (cod_empresa, cod_saida) contra
 * `Saida.cod_empresa`/`Saida.codigo` é tarefa do agente de migração de
 * dados, não desta janela.
 */
export default function TabelaNotaCorrecao({ saidaId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [form, setForm] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!saidaId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarNotasCorrecao(saidaId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [saidaId]);

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
        await atualizarNotaCorrecao(editandoId, form);
      } else {
        await criarNotaCorrecao({ ...form, saida_id: saidaId });
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
    if (!window.confirm('Excluir esta Carta de Correção (GENUS)?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarNotaCorrecao(id);
      if (editandoId === id) limparForm();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!saidaId) {
    return (
      <div className="aba-placeholder">
        Salve a saída primeiro para consultar as Cartas de Correção vinculadas (GENUS: NOTACORRECAO).
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Cartas de Correção Eletrônica Vinculadas à Saída (GENUS: NOTACORRECAO)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Cód. Empresa</th>
            <th>Cód. Saída (GENUS)</th>
            <th>Sequência</th>
            <th>Emissão</th>
            <th>Texto</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={6} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={6} className="produto-busca-status">Nenhuma Carta de Correção (GENUS) vinculada a esta saída.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.cod_empresa ?? '—'}</td>
              <td>{linha.cod_saida ?? '—'}</td>
              <td>{linha.sequencia ?? '—'}</td>
              <td>{linha.emissao ? String(linha.emissao).replace('T', ' ') : '—'}</td>
              <td>{linha.texto ? `${linha.texto.slice(0, 30)}…` : '—'}</td>
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
          {editandoId ? `Editando Carta de Correção #${editandoId}` : 'Nova Carta de Correção (GENUS: NOTACORRECAO)'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Chave natural original (GENUS)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Empresa</label>
              <input type="number" value={form.cod_empresa} onChange={e => setCampo('cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Saída (GENUS)</label>
              <input type="number" value={form.cod_saida} onChange={e => setCampo('cod_saida', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Sequência</label>
              <input type="number" step="1" value={form.sequencia} onChange={e => setCampo('sequencia', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Dados da Carta de Correção</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Emissão</label>
              <input type="datetime-local" value={form.emissao ?? ''} onChange={e => setCampo('emissao', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Texto da correção</label>
              <textarea rows={4} value={form.texto} onChange={e => setCampo('texto', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>XML do evento (ARQXML)</label>
              <textarea rows={6} value={form.arq_xml} onChange={e => setCampo('arq_xml', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
          {editandoId && (
            <button type="button" className="btn-cancel" disabled={salvando} onClick={limparForm}>Cancelar edição</button>
          )}
          <button type="button" className="btn-save" disabled={salvando} onClick={salvar}>
            {salvando ? 'Salvando...' : (editandoId ? 'Salvar alterações' : '+ Adicionar Carta de Correção')}
          </button>
        </div>
      </form>
    </fieldset>
  );
}

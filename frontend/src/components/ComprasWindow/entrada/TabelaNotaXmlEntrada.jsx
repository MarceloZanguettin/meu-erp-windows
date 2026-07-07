import React, { useCallback, useEffect, useState } from 'react';
import {
  listarNotasXmlEntrada,
  criarNotaXmlEntrada,
  atualizarNotaXmlEntrada,
  deletarNotaXmlEntrada,
} from './notaXmlEntradaService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  tipo_doc: '',
  doc: '',
  serie: '',
  cod_fornecedor: '',
  chave_nfe: '',
  arq_xml: '',
};

/**
 * Gerencia o(s) XML(s) de NF-e recebida vinculado(s) a uma entrada já salva
 * (GENUS: NOTAXMLENTRADA) — tabela "filha"/detalhe de `Entrada`, vinculada
 * pela mesma chave composta CODEMPRESA+TIPODOC+DOC+SERIE+CODFORNECEDOR já
 * usada por `TabelaEntradaFrete`/`TabelaCompraEntrada` neste mesmo módulo de
 * Compras. Ver docstring do model `NotaXmlEntrada` em
 * backend/models/tabelas.py. Segue o mesmo padrão de lista + formulário já
 * usado em `TabelaNotaXml` (VendasWindow/saida), do lado de saída/venda.
 *
 * `entrada_id` (FK para a entrada já reconhecida neste ERP, quando
 * resolvida) é opcional — a resolução de fato dos 5 códigos brutos contra
 * `Entrada.cod_empresa`/`Entrada.tipo_doc`/`Entrada.doc`/`Entrada.serie`/
 * `Entrada.cod_fornecedor` é tarefa do agente de migração de dados, não
 * desta janela.
 */
export default function TabelaNotaXmlEntrada({ entradaId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [form, setForm] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!entradaId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarNotasXmlEntrada(entradaId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [entradaId]);

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
        await atualizarNotaXmlEntrada(editandoId, form);
      } else {
        await criarNotaXmlEntrada({ ...form, entrada_id: entradaId });
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
    if (!window.confirm('Excluir este XML de NF-e de entrada (GENUS)?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarNotaXmlEntrada(id);
      if (editandoId === id) limparForm();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!entradaId) {
    return (
      <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '12px', borderRadius: '4px' }}>
        <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
          XML da NF-e Recebida (GENUS: NOTAXMLENTRADA)
        </legend>
        <div className="aba-placeholder">
          Salve a entrada primeiro para consultar o XML da NF-e vinculado (GENUS: NOTAXMLENTRADA).
        </div>
      </fieldset>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '12px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        XML da NF-e Recebida (GENUS: NOTAXMLENTRADA)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Doc.</th>
            <th>Série</th>
            <th>Fornecedor</th>
            <th>Chave NF-e</th>
            <th>XML</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={6} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={6} className="produto-busca-status">Nenhum XML de NF-e (GENUS) vinculado a esta entrada.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.doc ?? '—'}</td>
              <td>{linha.serie ?? '—'}</td>
              <td>{linha.cod_fornecedor ?? '—'}</td>
              <td>{linha.chave_nfe ?? '—'}</td>
              <td>{linha.arq_xml ? `${linha.arq_xml.slice(0, 30)}…` : '—'}</td>
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
          {editandoId ? `Editando XML de NF-e #${editandoId}` : 'Novo XML de NF-e (GENUS: NOTAXMLENTRADA)'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Chave natural original (mesma chave de ENTRADA)</legend>
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
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Dados do XML da NF-e recebida</legend>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Chave NF-e</label>
              <input type="text" maxLength={70} value={form.chave_nfe} onChange={e => setCampo('chave_nfe', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>XML (ARQXML)</label>
              <textarea rows={6} value={form.arq_xml} onChange={e => setCampo('arq_xml', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
          {editandoId && (
            <button type="button" className="btn-cancel" disabled={salvando} onClick={limparForm}>Cancelar edição</button>
          )}
          <button type="button" className="btn-save" disabled={salvando} onClick={salvar}>
            {salvando ? 'Salvando...' : (editandoId ? 'Salvar alterações' : '+ Adicionar XML')}
          </button>
        </div>
      </form>
    </fieldset>
  );
}

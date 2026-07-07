import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  listarClientesAnexo,
  criarClienteAnexo,
  atualizarClienteAnexo,
  deletarClienteAnexo,
} from '../services/clienteAnexoService.js';

const LINHA_VAZIA = {
  descricao: '',
  tipo: '',
  cod_orcamento: '',
};

function base64ParaBlob(base64) {
  const bin = window.atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: 'application/octet-stream' });
}

function nomeArquivo(linha) {
  const base = (linha.descricao || 'anexo').trim() || 'anexo';
  const ext = (linha.tipo || '').trim();
  return ext ? `${base}.${ext.replace(/^\./, '')}` : base;
}

/**
 * Gerencia a lista de anexos/documentos (GENUS.CLIENTEANEXO) vinculados ao
 * cliente. Um mesmo cliente pode ter vários anexos (documentos, imagens,
 * PDFs etc.), opcionalmente ligados a um orçamento específico dele
 * (CODORCAMENTO, mantido como código bruto) — por isso é uma lista, e não
 * um único registro (diferente de `FotoProduto`, que é 1:1 com o produto).
 *
 * ANEXO é um BLOB binário genuíno no GENUS — aqui o arquivo é lido/enviado
 * como base64 (mesmo padrão já usado em `FotoProduto`/GENUS.PRODUTOFOTO),
 * e a API converte para bytes/BYTEA no controller.
 */
export default function AnexosCliente({ clienteId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [novaLinha, setNovaLinha] = useState(LINHA_VAZIA);
  const [novoArquivoBase64, setNovoArquivoBase64] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [linhaEdicao, setLinhaEdicao] = useState(LINHA_VAZIA);
  const [salvando, setSalvando] = useState(false);
  const inputNovoRef = useRef(null);
  const inputEdicaoRef = useRef(null);

  const carregar = useCallback(async () => {
    if (!clienteId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarClientesAnexo(clienteId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [clienteId]);

  useEffect(() => { carregar(); }, [carregar]);

  const lerArquivoComoBase64 = (arquivo) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result vem como "data:*/*;base64,AAAA..." — só o base64 puro importa
      const base64 = String(reader.result).split(',')[1] ?? '';
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo selecionado.'));
    reader.readAsDataURL(arquivo);
  });

  const handleSelecionarNovoArquivo = async (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    try {
      const base64 = await lerArquivoComoBase64(arquivo);
      setNovoArquivoBase64(base64);
      if (!novaLinha.tipo) {
        const ext = arquivo.name.includes('.') ? arquivo.name.split('.').pop() : '';
        setNovaLinha(v => ({ ...v, tipo: ext.slice(0, 3) }));
      }
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleAdicionar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await criarClienteAnexo({ ...novaLinha, cliente_id: clienteId, anexo: novoArquivoBase64 });
      setNovaLinha(LINHA_VAZIA);
      setNovoArquivoBase64(null);
      if (inputNovoRef.current) inputNovoRef.current.value = '';
      await carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  };

  const iniciarEdicao = (linha) => {
    setEditandoId(linha.id);
    setLinhaEdicao({
      descricao: linha.descricao ?? '',
      tipo: linha.tipo ?? '',
      cod_orcamento: linha.cod_orcamento ?? '',
    });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setLinhaEdicao(LINHA_VAZIA);
    if (inputEdicaoRef.current) inputEdicaoRef.current.value = '';
  };

  const handleSelecionarArquivoEdicao = async (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setSalvando(true);
    setErro(null);
    try {
      const base64 = await lerArquivoComoBase64(arquivo);
      await atualizarClienteAnexo(editandoId, { anexo: base64 });
      await carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
      if (inputEdicaoRef.current) inputEdicaoRef.current.value = '';
    }
  };

  const salvarEdicao = async (id) => {
    setSalvando(true);
    setErro(null);
    try {
      await atualizarClienteAnexo(id, linhaEdicao);
      cancelarEdicao();
      await carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este anexo?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarClienteAnexo(id);
      await carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  };

  const baixar = (linha) => {
    if (!linha.anexo) return;
    const blob = base64ParaBlob(linha.anexo);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo(linha);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (!clienteId) {
    return (
      <div className="aba-placeholder">
        Salve o cliente primeiro para gerenciar os anexos.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Anexos/Documentos (GENUS: CLIENTEANEXO)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Descrição</th>
            <th style={{ width: 70 }}>Tipo</th>
            <th style={{ width: 110 }}>Orçamento</th>
            <th style={{ width: 90 }}>Arquivo</th>
            <th style={{ width: 220 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={5} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={5} className="produto-busca-status">Nenhum anexo cadastrado para este cliente.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            editandoId === linha.id ? (
              <tr key={linha.id}>
                <td><input value={linhaEdicao.descricao} onChange={e => setLinhaEdicao(v => ({ ...v, descricao: e.target.value }))} style={{ width: '100%' }} /></td>
                <td><input maxLength={3} value={linhaEdicao.tipo} onChange={e => setLinhaEdicao(v => ({ ...v, tipo: e.target.value }))} style={{ width: '55px' }} /></td>
                <td><input type="number" value={linhaEdicao.cod_orcamento} onChange={e => setLinhaEdicao(v => ({ ...v, cod_orcamento: e.target.value }))} style={{ width: '90px' }} /></td>
                <td>
                  <input ref={inputEdicaoRef} type="file" onChange={handleSelecionarArquivoEdicao} disabled={salvando} style={{ width: '90px' }} />
                </td>
                <td>
                  <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={linha.id}>
                <td>{linha.descricao || '—'}</td>
                <td>{linha.tipo || '—'}</td>
                <td>{linha.cod_orcamento ?? '—'}</td>
                <td>{linha.anexo ? 'Sim' : 'Não'}</td>
                <td>
                  {linha.anexo && (
                    <button type="button" className="btn-search" disabled={salvando} onClick={() => baixar(linha)}>Baixar</button>
                  )}
                  <button type="button" className="btn-search" disabled={salvando} onClick={() => iniciarEdicao(linha)}>Editar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={() => excluir(linha.id)}>Excluir</button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>

      <div className="form-row" style={{ marginTop: '12px', alignItems: 'flex-end' }}>
        <div className="form-group form-group-full">
          <label>Descrição</label>
          <input value={novaLinha.descricao} onChange={e => setNovaLinha(v => ({ ...v, descricao: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Tipo</label>
          <input maxLength={3} value={novaLinha.tipo} onChange={e => setNovaLinha(v => ({ ...v, tipo: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Cód. Orçamento</label>
          <input type="number" value={novaLinha.cod_orcamento} onChange={e => setNovaLinha(v => ({ ...v, cod_orcamento: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Arquivo</label>
          <input ref={inputNovoRef} type="file" onChange={handleSelecionarNovoArquivo} disabled={salvando} />
        </div>
        <div className="form-group">
          <button type="button" className="btn-save" disabled={salvando || !novoArquivoBase64} onClick={handleAdicionar}>+ Adicionar</button>
        </div>
      </div>
    </fieldset>
  );
}

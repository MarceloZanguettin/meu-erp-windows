import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  listarProdutoFotos,
  criarProdutoFoto,
  atualizarProdutoFoto,
  deletarProdutoFoto,
} from '../services/produtoFotoService.js';

/**
 * Gerencia a foto (GENUS.PRODUTOFOTO) de um produto. Diferente das outras
 * tabelas "filhas" de PRODUTO (código de barras, processos etc.), PRODUTOFOTO
 * é 1:1 com o produto — no GENUS sua chave primária é o próprio CODPRODUTO —
 * por isso aqui é um único registro (no máximo uma foto), não uma lista.
 */
export default function FotoProduto({ produtoId }) {
  const [foto, setFoto] = useState(null); // registro atual (ProdutoFotoOut) ou null
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const inputRef = useRef(null);

  const carregar = useCallback(async () => {
    if (!produtoId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarProdutoFotos(produtoId);
      setFoto(dados[0] ?? null);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [produtoId]);

  useEffect(() => { carregar(); }, [carregar]);

  const lerArquivoComoBase64 = (arquivo) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result vem como "data:image/png;base64,AAAA..." — só o base64 puro importa
      const base64 = String(reader.result).split(',')[1] ?? '';
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo selecionado.'));
    reader.readAsDataURL(arquivo);
  });

  const handleSelecionarArquivo = async (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setSalvando(true);
    setErro(null);
    try {
      const base64 = await lerArquivoComoBase64(arquivo);
      if (foto?.id) {
        await atualizarProdutoFoto(foto.id, { foto: base64 });
      } else {
        await criarProdutoFoto({ produto_id: produtoId, foto: base64 });
      }
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemover = async () => {
    if (!foto?.id) return;
    if (!window.confirm('Remover a foto deste produto?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarProdutoFoto(foto.id);
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
        Salve o produto primeiro para gerenciar a foto.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Foto do Produto (GENUS: PRODUTOFOTO)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      {carregando && <div className="produto-busca-status">Carregando...</div>}

      {!carregando && (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{
            width: 200, height: 200, border: '1px solid var(--erp-border-light)', borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            background: 'var(--erp-bg)',
          }}
          >
            {foto?.foto ? (
              <img
                src={`data:image/*;base64,${foto.foto}`}
                alt="Foto do produto"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : (
              <span className="produto-busca-status">Sem foto cadastrada</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleSelecionarArquivo}
              disabled={salvando}
              style={{ display: 'none' }}
            />
            <div>
              <button type="button" className="btn-save" disabled={salvando} onClick={() => inputRef.current?.click()}>
                {salvando ? 'Enviando...' : (foto?.foto ? 'Trocar foto' : 'Enviar foto')}
              </button>
              {foto?.foto && (
                <button type="button" className="btn-cancel" disabled={salvando} onClick={handleRemover} style={{ marginLeft: 8 }}>
                  Remover
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
}

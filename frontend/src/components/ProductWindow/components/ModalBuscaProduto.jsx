import React, { useEffect, useState } from 'react';
import Portal from '../../shared/Portal.jsx';
import { listarProdutos } from '../services/produtoService.js';

const fmtMoeda = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ModalBuscaProduto({ onSelecionar, onFechar }) {
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const termoAtual = termo.trim();
    setBuscando(true);
    setErro(null);
    const timer = setTimeout(async () => {
      try {
        const dados = await listarProdutos(termoAtual || undefined);
        setResultados(dados);
      } catch (e) {
        setErro(e.message);
      } finally {
        setBuscando(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [termo]);

  return (
    <Portal>
      <div className="modal-overlay">
        <div className="modal-content produto-busca-modal">
          <div className="modal-header">
            <strong>Pesquisar Produto</strong>
          </div>
          <div className="modal-body produto-busca-body">
            <input
              type="text"
              autoFocus
              className="produto-busca-input"
              placeholder="Digite código, cód. interno, referência ou descrição..."
              value={termo}
              onChange={e => setTermo(e.target.value)}
            />

            {erro && <div className="produto-busca-erro">{erro}</div>}

            <div className="produto-busca-resultados">
              {buscando && <div className="produto-busca-status">Buscando...</div>}
              {!buscando && resultados.length === 0 && (
                <div className="produto-busca-status">Nenhum produto encontrado.</div>
              )}
              {!buscando && resultados.length > 0 && (
                <table className="produto-busca-tabela">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descrição</th>
                      <th style={{ width: 70 }}>Situação</th>
                      <th style={{ width: 90 }}>Estoque</th>
                      <th style={{ width: 110 }}>Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map(p => (
                      <tr key={p.id} onClick={() => onSelecionar(p)} className="produto-busca-linha">
                        <td>{p.codigo || '—'}</td>
                        <td>{p.nome}</td>
                        <td>{p.situacao === 'I' ? 'Inativo' : 'Ativo'}</td>
                        <td>{p.estoque}</td>
                        <td>{fmtMoeda(p.preco)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onFechar}>Fechar</button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

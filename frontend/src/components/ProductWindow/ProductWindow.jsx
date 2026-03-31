import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import './ProductWindow.css';
import { useWindowResize } from '../../hooks/useWindowResize.jsx';

// Importação das Abas
import AbaDados from './abas/AbaDados';
import AbaTabelaPreco from './abas/AbaTabelaPreco';

export default function ProdutoWindow({ id, onClose, onMinimize }) {
  const nodeRef = useRef(null);
  const [abaAtiva, setAbaAtiva] = useState('Dados');

  const randomOffset = (id % 10) * 15;
  const { winPos, setWinPos, winSize, ResizeHandles } = useWindowResize({
    initX: 100 + randomOffset,
    initY: 100 + randomOffset,
    initW: 950,
    initH: 600,
    minW:  600,
    minH:  400,
  });

  // Variáveis de Estado (Concentradas aqui e passadas para as abas)
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [codigoInterno, setCodigoInterno] = useState('');
  const [codigoFornecedor, setCodigoFornecedor] = useState('');
  const [grupo, setGrupo] = useState('');
  const [subgrupo, setSubgrupo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ncm, setNcm] = useState('');
  const [csosn, setCsosn] = useState('');
  const [cst, setCst] = useState('');
  const [unidadeCompra, setUnidadeCompra] = useState('');
  const [unidadeVenda, setUnidadeVenda] = useState('');
  const [cfopDentro, setCfopDentro] = useState('');
  const [cfopFora, setCfopFora] = useState('');
  const [pesoBruto, setPesoBruto] = useState('');
  const [pesoLiquido, setPesoLiquido] = useState('');

  // Variáveis da Tabela de Preço
  const [estoque, setEstoque] = useState('');
  const [preco, setPreco] = useState('');
  const [custo, setCusto] = useState('');
  const [margemLucro, setMargemLucro] = useState('');
  const [precoMinimo, setPrecoMinimo] = useState('');
  const [precoAtacado, setPrecoAtacado] = useState('');

  const estadosFormulario = {
    codigo, setCodigo, nome, setNome, descricao, setDescricao,
    codigoInterno, setCodigoInterno, codigoFornecedor, setCodigoFornecedor,
    grupo, setGrupo, subgrupo, setSubgrupo, categoria, setCategoria,
    ncm, setNcm, csosn, setCsosn, cst, setCst,
    unidadeCompra, setUnidadeCompra, unidadeVenda, setUnidadeVenda,
    cfopDentro, setCfopDentro, cfopFora, setCfopFora,
    pesoBruto, setPesoBruto, pesoLiquido, setPesoLiquido,
    estoque, setEstoque, preco, setPreco, custo, setCusto,
    margemLucro, setMargemLucro, precoMinimo, setPrecoMinimo, precoAtacado, setPrecoAtacado
  };

  const abas = [
    'Dados', 'Tabela de preço', 'Código de barras', 'Centro de custo',
    'Imagem', 'Referência fornecedor', 'Composição', 'Observação',
    'Processos', 'Regras', 'Regras cliente', 'Código alternativo', 'Conversão fornecedor'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Produto "${nome}" salvo com sucesso!`);
    onClose();
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-header"
      position={winPos}
      onDrag={(e, data) => setWinPos({ x: data.x, y: data.y })}
    >
      <div
        ref={nodeRef}
        className="floating-window"
        style={{ width: winSize.width, height: winSize.height }}
      >
        <ResizeHandles />

        <div className="window-header">
          <span>Cadastro de Produto (ID: {id.toString().slice(-4)})</span>
          <div className="window-controls">
            <button type="button" className="window-btn" onMouseDown={e => e.stopPropagation()} onClick={onMinimize} title="Minimizar">—</button>
            <button type="button" className="window-btn" onMouseDown={e => e.stopPropagation()} onClick={onClose} title="Fechar">✕</button>
          </div>
        </div>

        <div className="window-body">
          <div className="product-top-section">
            <div className="search-container">
              <button type="button" className="btn-search" title="Pesquisar Produto cadastrado">
                🔍 Pesquisar
              </button>
            </div>

            <div className="form-group" style={{ width: '150px', marginBottom: 0 }}>
              <label>Código</label>
              <input
                type="text"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                placeholder="Auto"
                title="Aceita letras, números e caracteres especiais"
              />
            </div>

            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Descrição:</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                placeholder="Ex: Pulverizador..."
              />
            </div>
          </div>

          <div className="tabs-header">
            {abas.map(aba => (
              <button
                key={aba}
                type="button"
                className={`tab-btn ${abaAtiva === aba ? 'active' : ''}`}
                onClick={() => setAbaAtiva(aba)}
              >
                {aba}
              </button>
            ))}
          </div>

          <div className="tab-content">
            <form onSubmit={handleSubmit}>
              {abaAtiva === 'Dados' && <AbaDados estados={estadosFormulario} />}
              {abaAtiva === 'Tabela de preço' && <AbaTabelaPreco estados={estadosFormulario} />}
              {abaAtiva !== 'Dados' && abaAtiva !== 'Tabela de preço' && (
                <div className="aba-placeholder">
                  Configurações da aba <strong>{abaAtiva}</strong> em desenvolvimento...
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar Produto</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Draggable>
  );
}

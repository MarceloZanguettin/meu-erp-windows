import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import './ProductWindow.css';
import { useProdutoForm } from './hooks/useProdutoForm.js';
import { criarProduto, atualizarProduto } from './services/produtoService.js';

import AbaDados          from './abas/AbaDados';
import AbaTabelaPreco    from './abas/AbaTabelaPreco';
import AbaProcessos      from './abas/AbaProcessos';
import AbaComposicao     from './abas/AbaComposicao';
import AbaRegras         from './abas/AbaRegras';
import AbaRegrasCliente  from './abas/AbaRegrasCliente';
import AbaCodigoBarra    from './abas/AbaCodigoBarra';
import AbaProducao       from './abas/AbaProducao';
import AbaReferencia     from './abas/AbaReferencia';
import AbaImagem         from './abas/AbaImagem';
import AbaMovimentos     from './abas/AbaMovimentos';
import AbaItensSaida     from './abas/AbaItensSaida';
import AbaItensSaidaExcluidos from './abas/AbaItensSaidaExcluidos';
import AbaItensSaidaCancelados from './abas/AbaItensSaidaCancelados';
import AbaItensEntrada   from './abas/AbaItensEntrada';
import AbaItensCompra    from './abas/AbaItensCompra';
import AbaExcluido       from './abas/AbaExcluido';
import AbaConversaoFornecedor from './abas/AbaConversaoFornecedor';
import ModalBuscaProduto from './components/ModalBuscaProduto.jsx';

const ABAS = [
  'Dados', 'Tabela de preço', 'Código de barras', 'Centro de custo',
  'Imagem', 'Referência fornecedor', 'Composição', 'Observação',
  'Processos', 'Regras', 'Regras cliente', 'Produção', 'Movimentos', 'Itens de Saída', 'Itens de Saída Excluídos', 'Itens de Saída Cancelados', 'Itens de Entrada', 'Itens de Compra', 'Código alternativo', 'Conversão fornecedor',
  'Excluído',
];

export default function ProdutoWindow({ id, onClose, onMinimize }) {
  const [abaAtiva, setAbaAtiva] = useState('Dados');
  const [salvando, setSalvando] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const { form, setField, resetForm, produtoId, carregarProduto } = useProdutoForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      if (produtoId) {
        await atualizarProduto(produtoId, form);
      } else {
        await criarProduto(form);
      }
      resetForm();
      onClose();
    } catch (e) {
      alert('Erro: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  const handleSelecionarProduto = (produto) => {
    carregarProduto(produto);
    setBuscaAberta(false);
  };

  return (
    <>
    {buscaAberta && (
      <ModalBuscaProduto
        onSelecionar={handleSelecionarProduto}
        onFechar={() => setBuscaAberta(false)}
      />
    )}
    <JanelaBase
      id={id}
      titulo="Cadastro de Produto"
      onClose={onClose}
      onMinimize={onMinimize}
      largura={950}
      altura={600}
      minLargura={600}
      minAltura={400}
      iniciarMaximizado
    >
      <div className="product-top-section">
        <div className="search-container">
          <button type="button" className="btn-search" title="Pesquisar Produto cadastrado" onClick={() => setBuscaAberta(true)}>
            🔍 Pesquisar
          </button>
        </div>

        <div className="form-group" style={{ width: '150px', marginBottom: 0 }}>
          <label>Código</label>
          <input
            type="text"
            value={form.codigo}
            onChange={e => setField('codigo', e.target.value)}
            placeholder="Auto"
          />
        </div>

        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label>Descrição:</label>
          <input
            type="text"
            value={form.nome}
            onChange={e => setField('nome', e.target.value)}
            required
            placeholder="Ex: Pulverizador..."
          />
        </div>
      </div>

      <div className="tabs-header">
        {ABAS.map(aba => (
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

      <div className="tab-content" style={{ flex: 1, maxHeight: 'none', overflowY: 'auto' }}>
        <form onSubmit={handleSubmit}>
          {abaAtiva === 'Dados'           && <AbaDados         form={form} setField={setField} />}
          {abaAtiva === 'Tabela de preço' && <AbaTabelaPreco   form={form} setField={setField} produtoId={produtoId} />}
          {abaAtiva === 'Processos'       && <AbaProcessos     produtoId={produtoId} />}
          {abaAtiva === 'Composição'      && <AbaComposicao    produtoId={produtoId} />}
          {abaAtiva === 'Regras'          && <AbaRegras        produtoId={produtoId} />}
          {abaAtiva === 'Regras cliente'  && <AbaRegrasCliente produtoId={produtoId} />}
          {abaAtiva === 'Código de barras' && <AbaCodigoBarra  produtoId={produtoId} />}
          {abaAtiva === 'Produção'         && <AbaProducao     produtoId={produtoId} />}
          {abaAtiva === 'Referência fornecedor' && <AbaReferencia produtoId={produtoId} />}
          {abaAtiva === 'Imagem'          && <AbaImagem       produtoId={produtoId} />}
          {abaAtiva === 'Movimentos'      && <AbaMovimentos   produtoId={produtoId} />}
          {abaAtiva === 'Itens de Saída'  && <AbaItensSaida   produtoId={produtoId} />}
          {abaAtiva === 'Itens de Saída Excluídos' && <AbaItensSaidaExcluidos produtoId={produtoId} />}
          {abaAtiva === 'Itens de Saída Cancelados' && <AbaItensSaidaCancelados produtoId={produtoId} />}
          {abaAtiva === 'Itens de Entrada' && <AbaItensEntrada produtoId={produtoId} />}
          {abaAtiva === 'Itens de Compra' && <AbaItensCompra  produtoId={produtoId} />}
          {abaAtiva === 'Excluído'        && <AbaExcluido     produtoId={produtoId} />}
          {abaAtiva === 'Conversão fornecedor' && <AbaConversaoFornecedor produtoId={produtoId} />}
          {abaAtiva !== 'Dados' && abaAtiva !== 'Tabela de preço' && abaAtiva !== 'Processos' && abaAtiva !== 'Composição' && abaAtiva !== 'Regras' && abaAtiva !== 'Regras cliente' && abaAtiva !== 'Código de barras' && abaAtiva !== 'Produção' && abaAtiva !== 'Referência fornecedor' && abaAtiva !== 'Imagem' && abaAtiva !== 'Movimentos' && abaAtiva !== 'Itens de Saída' && abaAtiva !== 'Itens de Saída Excluídos' && abaAtiva !== 'Itens de Saída Cancelados' && abaAtiva !== 'Itens de Entrada' && abaAtiva !== 'Itens de Compra' && abaAtiva !== 'Excluído' && abaAtiva !== 'Conversão fornecedor' && (
            <div className="aba-placeholder">
              Configurações da aba <strong>{abaAtiva}</strong> em desenvolvimento...
            </div>
          )}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={salvando}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </JanelaBase>
    </>
  );
}

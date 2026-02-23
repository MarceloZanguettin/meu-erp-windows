import React from 'react';

export default function AbaDados({ estados }) {
  const { 
    nome, setNome, 
    descricao, setDescricao, 
    preco, setPreco, 
    estoque, setEstoque, 
    categoria, setCategoria 
  } = estados;

  return (
    <>
      <div className="form-group">
        <label>Nome do Produto *</label>
        <input type="text" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Teclado Mecânico" />
      </div>

      <div className="form-group">
        <label>Descrição</label>
        <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows="3" placeholder="Detalhes do produto..."></textarea>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Preço de Venda (R$) *</label>
          <input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Estoque Inicial *</label>
          <input type="number" value={estoque} onChange={e => setEstoque(e.target.value)} required placeholder="0" />
        </div>
      </div>

      <div className="form-group">
        <label>Categoria</label>
        <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ex: Informática" />
      </div>
    </>
  );
}
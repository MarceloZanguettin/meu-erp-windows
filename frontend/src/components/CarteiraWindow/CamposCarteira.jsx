import React from 'react';

/**
 * Campos do formulário de Carteira de Cobrança (GENUS.CARTEIRA) — reutilizado
 * tanto pelo modal de edição em CarteiraWindow quanto pela janela de criação
 * NovoCarteiraWindow, para os dois ficarem sempre em sincronia.
 *
 * Ver docstring do model Carteira em backend/models/tabelas.py para o
 * detalhe completo de cada campo (inclui a confirmação ao vivo dos tipos
 * contra a metadata Firebird do GENUS e a lista de tabelas que já
 * referenciam CODCARTEIRA como código bruto).
 */
export default function CamposCarteira({ form, setForm }) {
  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="ct-secao">Identificação (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={form.codigo} onChange={set('codigo')} />
        </div>
        <div className="form-group form-group-full">
          <label>Descrição (GENUS: DESCRI)</label>
          <input maxLength={40} value={form.descricao} onChange={set('descricao')} />
        </div>
      </div>

      <div className="ct-secao">Parâmetros de Cobrança</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Descontada (S/N)</label>
          <input maxLength={1} value={form.descontada} onChange={set('descontada')} />
        </div>
        <div className="form-group">
          <label>Float Pagamento (dias)</label>
          <input type="number" value={form.float_pagto} onChange={set('float_pagto')} />
        </div>
      </div>
    </>
  );
}

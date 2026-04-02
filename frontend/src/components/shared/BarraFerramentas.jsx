import React from 'react';
import './shared.css';

export default function BarraFerramentas({ onAdicionar, busca, setBusca, placeholder = 'Buscar...' }) {
  return (
    <div className="barra-ferramentas">
      <input
        className="campo-busca"
        type="text"
        placeholder={placeholder}
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />
      <button className="btn-adicionar" onClick={onAdicionar}>+ Novo</button>
    </div>
  );
}

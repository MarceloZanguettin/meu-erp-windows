import React from 'react';
import TabelaProducaoProduto from '../components/TabelaProducaoProduto.jsx';

export default function AbaProducao({ produtoId }) {
  return (
    <TabelaProducaoProduto produtoId={produtoId} />
  );
}

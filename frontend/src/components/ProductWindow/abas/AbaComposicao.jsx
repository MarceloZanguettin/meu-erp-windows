import React from 'react';
import TabelaComposicaoProduto from '../components/TabelaComposicaoProduto.jsx';

export default function AbaComposicao({ produtoId }) {
  return (
    <TabelaComposicaoProduto produtoId={produtoId} />
  );
}

import React from 'react';
import TabelaMovtoProduto from '../components/TabelaMovtoProduto.jsx';

export default function AbaMovimentos({ produtoId }) {
  return (
    <TabelaMovtoProduto produtoId={produtoId} />
  );
}

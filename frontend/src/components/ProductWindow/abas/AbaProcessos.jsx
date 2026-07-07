import React from 'react';
import TabelaProcessosProduto from '../components/TabelaProcessosProduto.jsx';

export default function AbaProcessos({ produtoId }) {
  return (
    <TabelaProcessosProduto produtoId={produtoId} />
  );
}

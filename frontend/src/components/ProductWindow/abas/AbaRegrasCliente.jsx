import React from 'react';
import TabelaRegrasProdutoCliente from '../components/TabelaRegrasProdutoCliente.jsx';

export default function AbaRegrasCliente({ produtoId }) {
  return (
    <TabelaRegrasProdutoCliente produtoId={produtoId} />
  );
}

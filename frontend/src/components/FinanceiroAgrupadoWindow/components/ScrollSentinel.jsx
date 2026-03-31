import React from 'react';

/**
 * Exibe um indicador no topo ou no fim da lista de scroll infinito.
 * Mostra "Carregando..." enquanto busca dados, ou "Início/Fim dos registros"
 * quando não há mais dados a carregar.
 *
 * @param {{ loading: boolean, hasMore: boolean, msgLoading: string, msgFim: string }} props
 */
export default function ScrollSentinel({ loading, hasMore, msgLoading, msgFim }) {
  return (
    <div className="fagrup-sentinel">
      {loading  && <span className="fagrup-loading-msg">{msgLoading}</span>}
      {!hasMore && <span className="fagrup-sem-mais">{msgFim}</span>}
    </div>
  );
}

import { useState } from 'react';

/**
 * Hook Controller — gerencia o ciclo de vida das janelas flutuantes.
 *
 * Expõe:
 *   janelas          — array de janelas abertas { id, tipo, minimizada }
 *   abrirJanela(tipo)— abre uma nova janela pelo tipo registrado em janelasConfig
 *   fecharJanela(id) — remove a janela do estado
 *   alternarMinimizar(id) — alterna minimizado/restaurado
 */
export function useJanelas() {
  const [janelas, setJanelas] = useState([]);

  const abrirJanela = (tipo, extraProps = {}) => {
    setJanelas(prev => [...prev, { id: Date.now(), tipo, minimizada: false, extraProps }]);
  };

  const fecharJanela = (id) => {
    setJanelas(prev => prev.filter(j => j.id !== id));
  };

  const alternarMinimizar = (id) => {
    setJanelas(prev =>
      prev.map(j => j.id === id ? { ...j, minimizada: !j.minimizada } : j),
    );
  };

  return { janelas, abrirJanela, fecharJanela, alternarMinimizar };
}

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook Controller — gerencia as larguras redimensionáveis das colunas da tabela.
 *
 * @param {{ empresas: object[], contasBancarias: object[] }} params
 * @returns {{ colWidths: number[], startColResize: Function }}
 */
export function useColunaResize({ empresas, contasBancarias }) {
  const [colWidths, setColWidths] = useState([]);

  // Inicializa as larguras quando os dados estáticos chegam
  useEffect(() => {
    const allBanks = empresas.flatMap(emp =>
      contasBancarias.filter(cb => cb.empresa_id === emp.id),
    );
    const n        = allBanks.length;
    const expected = 6 + n; // data + tipo + desc + n bancos + status + ações + resumo
    if (expected > 0 && colWidths.length !== expected) {
      setColWidths([
        110, 55, 180,           // data, tipo, descrição
        ...Array(n).fill(120),  // uma coluna por banco
        90, 110, 175,           // status, ações, resumo do dia
      ]);
    }
  }, [empresas, contasBancarias]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Inicia o resize de uma coluna pelo índice.
   * Deve ser chamado pelo onMouseDown do handle de resize no <th>.
   */
  const startColResize = useCallback((e, colIdx) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startW = colWidths[colIdx] ?? 80;

    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (ev) => {
      const newW = Math.max(40, startW + ev.clientX - startX);
      setColWidths(prev => prev.map((w, i) => (i === colIdx ? newW : w)));
    };

    const onUp = () => {
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }, [colWidths]);

  return { colWidths, startColResize };
}

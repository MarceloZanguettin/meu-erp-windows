import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook Controller — gerencia as larguras redimensionáveis das colunas da tabela.
 * Quando wrapperWidth muda (maximize, restore, resize manual da janela),
 * todas as colunas são reescaladas proporcionalmente.
 *
 * @param {{ empresas: object[], contasBancarias: object[], wrapperWidth: number }} params
 * @returns {{ colWidths: number[], startColResize: Function }}
 */
export function useColunaResize({ empresas, contasBancarias, wrapperWidth }) {
  const [colWidths, setColWidths]     = useState([]);
  const prevWrapperWidth              = useRef(null);
  const isResizingCol                 = useRef(false);

  // Inicializa as larguras quando os dados chegam, distribuindo pelo espaço disponível
  useEffect(() => {
    const allBanks = empresas.flatMap(emp =>
      contasBancarias.filter(cb => cb.empresa_id === emp.id),
    );
    const n        = allBanks.length;
    const expected = 6 + n;
    if (expected <= 0 || colWidths.length === expected) return;

    const base    = [110, 55, 180, ...Array(n).fill(120), 90, 110, 175];
    const totalBase = base.reduce((s, w) => s + w, 0);
    const avail   = wrapperWidth > 0 ? wrapperWidth : totalBase;
    const scale   = avail / totalBase;

    setColWidths(base.map(w => Math.max(40, Math.round(w * scale))));
    prevWrapperWidth.current = avail;
  }, [empresas, contasBancarias]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reescala proporcionalmente quando o wrapper muda de tamanho
  // (maximize, restore, drag-resize da janela)
  useEffect(() => {
    if (!wrapperWidth || colWidths.length === 0) return;
    if (isResizingCol.current) return;           // ignora durante resize manual de coluna
    const prev = prevWrapperWidth.current;
    if (!prev || Math.abs(wrapperWidth - prev) < 5) return; // threshold anti-jitter

    const scale = wrapperWidth / prev;
    setColWidths(ws => ws.map(w => Math.max(40, Math.round(w * scale))));
    prevWrapperWidth.current = wrapperWidth;
  }, [wrapperWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Inicia o resize manual de uma coluna pelo índice.
   * Durante o drag, o rescale por wrapperWidth fica suspenso para não interferir.
   */
  const startColResize = useCallback((e, colIdx) => {
    e.preventDefault();
    e.stopPropagation();

    isResizingCol.current = true;

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
      // Atualiza a referência de largura para que o próximo resize de janela
      // calcule o scale a partir das larguras manuais atuais
      prevWrapperWidth.current = wrapperWidth;
      isResizingCol.current    = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }, [colWidths, wrapperWidth]);

  return { colWidths, startColResize };
}

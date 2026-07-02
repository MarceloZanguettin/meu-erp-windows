import { useState, useRef } from 'react';

/**
 * Hook que adiciona redimensionamento por bordas e cantos a uma janela flutuante.
 *
 * @param {object} opts
 * @param {number} opts.initX      - posição X inicial
 * @param {number} opts.initY      - posição Y inicial
 * @param {number} opts.initW      - largura inicial
 * @param {number} opts.initH      - altura inicial
 * @param {number} [opts.minW=400] - largura mínima
 * @param {number} [opts.minH=300] - altura mínima
 */
export function useWindowResize({ initX, initY, initW, initH, minW = 400, minH = 300 }) {
  const [winPos,  setWinPos]  = useState({ x: initX, y: initY });
  const [winSize, setWinSize] = useState({ width: initW, height: initH });
  const resizeRef = useRef(null);

  const startResize = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();

    resizeRef.current = {
      direction,
      startX:      e.clientX,
      startY:      e.clientY,
      startWidth:  winSize.width,
      startHeight: winSize.height,
      startPosX:   winPos.x,
      startPosY:   winPos.y,
    };

    const onMove = (ev) => {
      const { direction: dir, startX, startY,
              startWidth, startHeight, startPosX, startPosY } = resizeRef.current;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      let w = startWidth, h = startHeight, x = startPosX, y = startPosY;

      // Bordas
      if (dir === 'e'  || dir === 'ne' || dir === 'se') { w = Math.max(minW, startWidth  + dx); }
      if (dir === 'w'  || dir === 'nw' || dir === 'sw') { w = Math.max(minW, startWidth  - dx); x = startPosX + (startWidth  - w); }
      if (dir === 's'  || dir === 'se' || dir === 'sw') { h = Math.max(minH, startHeight + dy); }
      if (dir === 'n'  || dir === 'ne' || dir === 'nw') { h = Math.max(minH, startHeight - dy); y = startPosY + (startHeight - h); }

      setWinSize({ width: w, height: h });
      setWinPos({ x, y });
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
      resizeRef.current = null;
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  };

  const ResizeHandles = () => (
    <>
      {/* Bordas */}
      <div className="win-rz win-rz-n"  onMouseDown={e => startResize(e, 'n')} />
      <div className="win-rz win-rz-s"  onMouseDown={e => startResize(e, 's')} />
      <div className="win-rz win-rz-e"  onMouseDown={e => startResize(e, 'e')} />
      <div className="win-rz win-rz-w"  onMouseDown={e => startResize(e, 'w')} />
      {/* Cantos */}
      <div className="win-rz win-rz-nw" onMouseDown={e => startResize(e, 'nw')} />
      <div className="win-rz win-rz-ne" onMouseDown={e => startResize(e, 'ne')} />
      <div className="win-rz win-rz-sw" onMouseDown={e => startResize(e, 'sw')} />
      <div className="win-rz win-rz-se" onMouseDown={e => startResize(e, 'se')} />
    </>
  );

  return { winPos, setWinPos, winSize, setWinSize, startResize, ResizeHandles };
}

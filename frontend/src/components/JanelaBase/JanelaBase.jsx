import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useWindowResize } from '../../hooks/useWindowResize.jsx';

function calcMaxSize() {
  const headerEl = document.querySelector('.app-header');
  const headerH  = headerEl ? headerEl.offsetHeight : 60;
  const taskbarH = 45;
  return {
    pos:  { x: 0, y: headerH },
    size: { width: window.innerWidth, height: window.innerHeight - headerH - taskbarH },
  };
}

export default function JanelaBase({
  id,
  titulo,
  onClose,
  onMinimize,
  largura = 1100,
  altura = 680,
  minLargura = 750,
  minAltura = 450,
  maximizavel = false,
  iniciarMaximizado = false,
  children,
}) {
  const nodeRef      = useRef(null);
  const randomOffset = (id % 10) * 18;
  const normalPos    = { x: 90 + randomOffset, y: 70 + randomOffset };
  const normalSize   = { width: largura, height: altura };
  const preMaxRef    = useRef(iniciarMaximizado ? { pos: normalPos, size: normalSize } : null);

  const initMax = iniciarMaximizado ? calcMaxSize() : null;

  const { winPos, setWinPos, winSize, setWinSize, ResizeHandles } = useWindowResize({
    initX: initMax ? initMax.pos.x  : 90 + randomOffset,
    initY: initMax ? initMax.pos.y  : 70 + randomOffset,
    initW: initMax ? initMax.size.width  : largura,
    initH: initMax ? initMax.size.height : altura,
    minW: minLargura,
    minH: minAltura,
  });

  const [maximizada, setMaximizada] = useState(iniciarMaximizado);

  const toggleMaximizar = () => {
    if (maximizada) {
      if (preMaxRef.current) {
        setWinPos(preMaxRef.current.pos);
        setWinSize(preMaxRef.current.size);
      }
      setMaximizada(false);
    } else {
      preMaxRef.current = { pos: { ...winPos }, size: { ...winSize } };
      const m = calcMaxSize();
      setWinPos(m.pos);
      setWinSize(m.size);
      setMaximizada(true);
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-header"
      position={winPos}
      disabled={maximizada}
      onDrag={(_e, data) => setWinPos({ x: data.x, y: data.y })}
    >
      <div
        ref={nodeRef}
        className="floating-window"
        style={{ width: winSize.width, height: winSize.height }}
      >
        <ResizeHandles />
        <div className="window-header">
          <span className="window-title">{titulo}</span>
          <div className="window-controls">
            <button
              type="button"
              className="window-btn window-btn-minimize"
              onMouseDown={e => e.stopPropagation()}
              onClick={onMinimize}
              title="Minimizar"
            />
            {maximizavel && (
              <button
                type="button"
                className="window-btn window-btn-maximize"
                onMouseDown={e => e.stopPropagation()}
                onClick={toggleMaximizar}
                title={maximizada ? 'Restaurar' : 'Maximizar'}
              />
            )}
            <button
              type="button"
              className="window-btn window-btn-close"
              onMouseDown={e => e.stopPropagation()}
              onClick={onClose}
              title="Fechar"
            />
          </div>
        </div>
        <div className="window-body">{children}</div>
      </div>
    </Draggable>
  );
}

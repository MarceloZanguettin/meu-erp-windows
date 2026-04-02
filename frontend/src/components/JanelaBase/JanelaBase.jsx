import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { useWindowResize } from '../../hooks/useWindowResize.jsx';

export default function JanelaBase({
  id,
  titulo,
  onClose,
  onMinimize,
  largura = 1100,
  altura = 680,
  minLargura = 750,
  minAltura = 450,
  children,
}) {
  const nodeRef = useRef(null);
  const randomOffset = (id % 10) * 18;
  const { winPos, setWinPos, winSize, ResizeHandles } = useWindowResize({
    initX: 90 + randomOffset,
    initY: 70 + randomOffset,
    initW: largura,
    initH: altura,
    minW: minLargura,
    minH: minAltura,
  });

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-header"
      position={winPos}
      onDrag={(_e, data) => setWinPos({ x: data.x, y: data.y })}
    >
      <div
        ref={nodeRef}
        className="floating-window"
        style={{ width: winSize.width, height: winSize.height }}
      >
        <ResizeHandles />
        <div className="window-header">
          <span>{titulo}</span>
          <div className="window-controls">
            <button
              type="button"
              className="window-btn"
              onMouseDown={e => e.stopPropagation()}
              onClick={onMinimize}
              title="Minimizar"
            >
              —
            </button>
            <button
              type="button"
              className="window-btn"
              onMouseDown={e => e.stopPropagation()}
              onClick={onClose}
              title="Fechar"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="window-body">{children}</div>
      </div>
    </Draggable>
  );
}

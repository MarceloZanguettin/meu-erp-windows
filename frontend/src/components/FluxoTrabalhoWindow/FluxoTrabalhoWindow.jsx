import { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import './FluxoTrabalhoWindow.css';
import { useWindowResize } from '../../hooks/useWindowResize.jsx';

import AbaFluxo from './abas/AbaFluxo';

const ABAS = ['Contas a Receber', 'Contas a Pagar'];

export default function FluxoTrabalhoWindow({ id, onClose, onMinimize }) {
  const nodeRef     = useRef(null);
  const [abaAtiva,  setAbaAtiva]  = useState('Contas a Receber');
  const [empresas,  setEmpresas]  = useState([]);

  const randomOffset = (id % 10) * 15;
  const { winPos, setWinPos, winSize, ResizeHandles } = useWindowResize({
    initX: 120 + randomOffset,
    initY:  80 + randomOffset,
    initW: 1100,
    initH:  600,
    minW:   700,
    minH:   400,
  });

  useEffect(() => {
    fetch('http://localhost:8050/financeiro/empresas')
      .then(r => r.json())
      .then(setEmpresas)
      .catch(() => {});
  }, []);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-header"
      position={winPos}
      onDrag={(_e, data) => setWinPos({ x: data.x, y: data.y })}
    >
      <div
        ref={nodeRef}
        className="floating-window fluxo-window"
        style={{ width: winSize.width, height: winSize.height }}
      >
        <ResizeHandles />

        <div className="window-header">
          <span>Fluxo de Trabalho</span>
          <div className="window-controls">
            <button type="button" className="window-btn" onMouseDown={e => e.stopPropagation()} onClick={onMinimize} title="Minimizar">—</button>
            <button type="button" className="window-btn" onMouseDown={e => e.stopPropagation()} onClick={onClose}   title="Fechar">✕</button>
          </div>
        </div>

        <div className="window-body">
          <div className="tabs-header fluxo-tabs-header">
            {ABAS.map(aba => (
              <button
                key={aba}
                type="button"
                className={`tab-btn ${abaAtiva === aba ? 'active' : ''}`}
                onClick={() => setAbaAtiva(aba)}
              >
                {aba}
              </button>
            ))}
          </div>

          <div className="tab-content fluxo-tab-content">
            {empresas.length === 0 ? (
              <div className="fluxo-sem-empresas">
                <p>Nenhuma empresa cadastrada ainda.</p>
                <p>Adicione empresas pelo banco de dados para começar.</p>
              </div>
            ) : (
              <>
                {abaAtiva === 'Contas a Receber' && <AbaFluxo tipo="receber" empresas={empresas} />}
                {abaAtiva === 'Contas a Pagar'   && <AbaFluxo tipo="pagar"   empresas={empresas} />}
              </>
            )}
          </div>
        </div>

      </div>
    </Draggable>
  );
}

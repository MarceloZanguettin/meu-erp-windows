import { useState, useEffect } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import './FluxoTrabalhoWindow.css';

import AbaFluxo from './abas/AbaFluxo';

const ABAS = ['Contas a Receber', 'Contas a Pagar'];

export default function FluxoTrabalhoWindow({ id, onClose, onMinimize }) {
  const [abaAtiva,  setAbaAtiva]  = useState('Contas a Receber');
  const [empresas,  setEmpresas]  = useState([]);

  useEffect(() => {
    fetch('http://localhost:8050/financeiro/empresas')
      .then(r => r.json())
      .then(setEmpresas)
      .catch(() => {});
  }, []);

  return (
    <JanelaBase
      id={id}
      titulo="Fluxo de Trabalho"
      onClose={onClose}
      onMinimize={onMinimize}
      largura={1100}
      altura={600}
      minLargura={700}
      minAltura={400}
    >
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
    </JanelaBase>
  );
}

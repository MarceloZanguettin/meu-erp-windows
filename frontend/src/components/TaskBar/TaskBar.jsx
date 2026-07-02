import React from 'react';
import { JANELAS_CONFIG } from '../../config/janelasConfig.js';
import './TaskBar.css';

/**
 * Dock flutuante — exibe apenas as janelas minimizadas como botões pill.
 * Não há barra fixa; os botões aparecem no canto inferior esquerdo.
 */
export default function Taskbar({ janelas, alternarMinimizar }) {
  const minimizadas = janelas.filter(j => j.minimizada);
  if (minimizadas.length === 0) return null;

  return (
    <div className="taskbar-dock">
      {minimizadas.map(janela => {
        const titulo = JANELAS_CONFIG[janela.tipo]?.titulo ?? janela.tipo;
        return (
          <button
            key={janela.id}
            className="taskbar-pill"
            onClick={() => alternarMinimizar(janela.id)}
            title="Restaurar janela"
          >
            <span className="taskbar-pill-icon">▢</span>
            {titulo}
          </button>
        );
      })}
    </div>
  );
}

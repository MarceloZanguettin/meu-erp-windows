import React from 'react';
import './TaskBar.css';

export default function Taskbar({ janelas, alternarMinimizar }) {
  // Se não houver nenhuma janela, a barra inferior nem é exibida
  if (janelas.length === 0) return null;

  return (
    <div className="taskbar">
      {janelas.map(janela => (
        <button 
          key={janela.id}
          className={`taskbar-item ${janela.minimizada ? 'minimized' : ''}`}
          onClick={() => alternarMinimizar(janela.id)}
          title={janela.minimizada ? "Restaurar janela" : "Minimizar janela"}
        >
          {janela.titulo} ({janela.id.toString().slice(-4)})
        </button>
      ))}
    </div>
  );
}
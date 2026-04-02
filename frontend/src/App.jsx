import React, { useState } from 'react';
import './App.css';
import './styles/global.css';

import LoginScreen from './Components/LoginScreen/LoginScreen.jsx';
import Header      from './Components/Header/Header.jsx';
import Taskbar     from './Components/Taskbar/Taskbar.jsx';

import { useJanelas }      from './hooks/useJanelas.js';
import { JANELAS_CONFIG }  from './config/janelasConfig.js';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const { janelas, abrirJanela, fecharJanela, alternarMinimizar } = useJanelas();

  if (!usuario) {
    return <LoginScreen onLoginSuccess={setUsuario} />;
  }

  return (
    <div className="app-wrapper">

      <Header
        usuario={usuario}
        setUsuario={setUsuario}
        abrirJanela={abrirJanela}
      />

      <main className="main-content">
        <div className="welcome-box">
          <h1>Bem-vindo ao Sistema!</h1>
          <p>Utilize o menu "Cadastro" para abrir janelas de trabalho.</p>
        </div>
      </main>

      {janelas.map(janela => {
        if (janela.minimizada) return null;
        const config = JANELAS_CONFIG[janela.tipo];
        if (!config) return null;
        const { Component } = config;
        return (
          <Component
            key={janela.id}
            id={janela.id}
            onClose={() => fecharJanela(janela.id)}
            onMinimize={() => alternarMinimizar(janela.id)}
          />
        );
      })}

      <Taskbar janelas={janelas} alternarMinimizar={alternarMinimizar} />

    </div>
  );
}

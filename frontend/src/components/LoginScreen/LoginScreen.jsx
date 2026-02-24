import React, { useState } from 'react';
import Input from '../atoms/Input/Input'; // Importação do átomo
import Button from '../atoms/Button/Button'; // Importação do átomo
import './LoginScreen.css';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="login-container">
      <form onSubmit={(e) => { e.preventDefault(); onLogin(username, password); }}>
        <Input 
          label="Usuário" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <Input 
          label="Senha" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <Button type="submit" variant="success">Entrar</Button>
      </form>
    </div>
  );
};

export default LoginScreen;
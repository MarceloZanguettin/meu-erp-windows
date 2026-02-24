import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = "button", variant = "primary", className = "" }) => (
  <button 
    type={type} 
    onClick={onClick} 
    className={`atom-button btn-${variant} ${className}`}
  >
    {children}
  </button>
);

export default Button;
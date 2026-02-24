import React from 'react';
import './Input.css';

const Input = ({ label, type = "text", value, onChange, placeholder, className = "" }) => (
  <div className={`input-group ${className}`}>
    {label && <label className="input-label">{label}</label>}
    <input 
      type={type} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      className="atom-input"
    />
  </div>
);

export default Input;
import React from 'react';
import { GRUPOS_CAMPOS_SAIDA_EXCLUIDA } from './camposSaidaExcluida.js';

function renderInput(campo, valor, onChange) {
  const commonProps = {
    value: valor ?? '',
    onChange: (e) => onChange(campo.nome, e.target.value),
  };

  if (campo.tipo === 'textarea') {
    return <textarea rows={2} {...commonProps} />;
  }
  if (campo.tipo === 'data') {
    return <input type="datetime-local" {...commonProps} />;
  }
  if (campo.tipo === 'int') {
    return <input type="number" step="1" {...commonProps} />;
  }
  if (campo.tipo === 'float') {
    return <input type="number" step="0.01" {...commonProps} />;
  }
  return <input type="text" maxLength={campo.maxLength} {...commonProps} />;
}

/**
 * Renderiza todos os campos de GENUS.DELSAIDA agrupados em fieldsets,
 * a partir da config declarativa em camposSaidaExcluida.js. Usado tanto pela
 * janela de edição (SaidaExcluidaWindow) quanto pela janela de criação
 * (NovaSaidaExcluidaWindow) — mesmo padrão de CamposSaida.jsx (Saida/SAIDA).
 */
export default function CamposSaidaExcluida({ form, setForm }) {
  const setField = (campo, valor) => setForm({ ...form, [campo]: valor });

  return (
    <>
      {GRUPOS_CAMPOS_SAIDA_EXCLUIDA.map(grupo => (
        <fieldset key={grupo.titulo} style={{ border: '1px solid #ccc', padding: '10px', marginTop: '12px', borderRadius: '4px' }}>
          <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
            {grupo.titulo}
          </legend>
          <div className="form-row" style={{ flexWrap: 'wrap' }}>
            {grupo.campos.map(campo => (
              <div className="form-group" key={campo.nome} style={{ minWidth: '160px' }}>
                <label>{campo.label}</label>
                {renderInput(campo, form[campo.nome], setField)}
              </div>
            ))}
          </div>
        </fieldset>
      ))}
    </>
  );
}

import React from 'react';
import { GENUS_TRANSPORTADORA_SECOES } from './genusTransportadoraFields.js';

/**
 * Seção "GENUS" do TransportadoraWindow / NovaTransportadoraWindow — exibe/edita
 * todos os campos migrados da tabela TRANSPORTADOR do sistema legado GENUS
 * (GENUS_ZANGUETTIN.FDB) que ainda não têm um campo equivalente no
 * formulário principal do ERP.
 */
export default function AbaGenusTransportadora({ form, setField }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {GENUS_TRANSPORTADORA_SECOES.map(secao => (
        <fieldset
          key={secao.titulo}
          style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px', margin: 0 }}
        >
          <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
            {secao.titulo}
          </legend>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {secao.campos.map(({ key, label, type, maxLength }) => (
              <div className="form-group" key={key} style={{ minWidth: '160px', flex: '1 1 160px' }}>
                <label>{label}</label>
                <input
                  type={type === 'date' ? 'date' : type === 'text' ? 'text' : 'number'}
                  step={type === 'float' ? '0.01' : undefined}
                  maxLength={maxLength}
                  value={form[key] ?? ''}
                  onChange={e => setField(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

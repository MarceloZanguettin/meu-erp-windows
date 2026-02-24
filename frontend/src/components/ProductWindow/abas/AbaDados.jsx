import React from 'react';
import Input from '../../atoms/Input/Input';

const AbaDados = ({ produto, setProduto }) => {
  const handleChange = (field, value) => {
    setProduto({ ...produto, [field]: value });
  };

  return (
    <div className="aba-dados-container">
      {/* Exemplo de uso atomizado */}
      <div className="row">
        <Input 
          label="Código" 
          value={produto.id || ''} 
          onChange={(e) => handleChange('id', e.target.value)} 
          className="col-2"
        />
        <Input 
          label="Descrição" 
          value={produto.descricao || ''} 
          onChange={(e) => handleChange('descricao', e.target.value)} 
          className="col-10"
        />
      </div>
      {/* Repetir para outros campos como NCM, GTIN, etc */}
    </div>
  );
};

export default AbaDados;
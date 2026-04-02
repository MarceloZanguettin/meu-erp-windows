import React from 'react';

export default function AbaDados({ form, setField }) {
  return (
    <>
      <div className="form-row">
        <div className="form-group">
          <label>Cód. Interno:</label>
          <input type="text" value={form.codigoInterno} onChange={e => setField('codigoInterno', e.target.value)} placeholder="Pesquisa do produto" />
        </div>
        <div className="form-group">
          <label>Cód. Fornecedor:</label>
          <input type="text" value={form.codigoFornecedor} onChange={e => setField('codigoFornecedor', e.target.value)} placeholder="Identificação do fornecedor" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Grupo:</label>
          <input type="text" value={form.grupo} onChange={e => setField('grupo', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Subgrupo:</label>
          <input type="text" value={form.subgrupo} onChange={e => setField('subgrupo', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Categoria:</label>
          <select value={form.categoria} onChange={e => setField('categoria', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <option value="">Selecione...</option>
            <option value="Produto Acabado">Produto Acabado</option>
            <option value="Componente">Componente</option>
            <option value="Matéria-Prima">Matéria-Prima</option>
            <option value="Insumo">Insumo</option>
            <option value="Consumo">Consumo</option>
            <option value="Embalagem">Embalagem</option>
            <option value="Diverso">Diverso</option>
            <option value="Ativo imobilizado">Ativo imobilizado</option>
            <option value="EPI">EPI</option>
          </select>
        </div>
      </div>

      <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
        <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>Dados Fiscais</legend>
        <div className="form-row">
          <div className="form-group">
            <label>NCM:</label>
            <input type="text" value={form.ncm} onChange={e => setField('ncm', e.target.value)} />
          </div>
          <div className="form-group">
            <label>CSOSN:</label>
            <input type="text" value={form.csosn} onChange={e => setField('csosn', e.target.value)} />
          </div>
          <div className="form-group">
            <label>CST:</label>
            <input type="text" value={form.cst} onChange={e => setField('cst', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>CFOP Dentro do Estado:</label>
            <input type="text" value={form.cfopDentro} onChange={e => setField('cfopDentro', e.target.value)} />
          </div>
          <div className="form-group">
            <label>CFOP Fora do Estado:</label>
            <input type="text" value={form.cfopFora} onChange={e => setField('cfopFora', e.target.value)} />
          </div>
        </div>
      </fieldset>

      <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
        <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>Pesos e Medidas</legend>
        <div className="form-row">
          <div className="form-group">
            <label>Und. Compra:</label>
            <input type="text" value={form.unidadeCompra} onChange={e => setField('unidadeCompra', e.target.value)} placeholder="Ex: CX, PC" />
          </div>
          <div className="form-group">
            <label>Und. Venda:</label>
            <input type="text" value={form.unidadeVenda} onChange={e => setField('unidadeVenda', e.target.value)} placeholder="Ex: UN, KG" />
          </div>
          <div className="form-group">
            <label>Peso Bruto:</label>
            <input type="number" step="0.001" value={form.pesoBruto} onChange={e => setField('pesoBruto', e.target.value)} placeholder="0.000" />
          </div>
          <div className="form-group">
            <label>Peso Líquido:</label>
            <input type="number" step="0.001" value={form.pesoLiquido} onChange={e => setField('pesoLiquido', e.target.value)} placeholder="0.000" />
          </div>
        </div>
      </fieldset>

      <div className="form-row">
        <div className="form-group">
          <label>Preço de Venda Base (R$) *</label>
          <input type="number" step="0.000001" value={form.preco} onChange={e => setField('preco', e.target.value)} required placeholder="0.000000" />
        </div>
        <div className="form-group">
          <label>Estoque Inicial *</label>
          <input type="number" value={form.estoque} onChange={e => setField('estoque', e.target.value)} required placeholder="0" />
        </div>
      </div>
    </>
  );
}

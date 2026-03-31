import React from 'react';

export default function AbaDados({ estados }) {
  const { 
    codigoInterno, setCodigoInterno,
    codigoFornecedor, setCodigoFornecedor,
    grupo, setGrupo,
    subgrupo, setSubgrupo,
    categoria, setCategoria,
    ncm, setNcm,
    csosn, setCsosn,
    cst, setCst,
    unidadeCompra, setUnidadeCompra,
    unidadeVenda, setUnidadeVenda,
    cfopDentro, setCfopDentro,
    cfopFora, setCfopFora,
    pesoBruto, setPesoBruto,
    pesoLiquido, setPesoLiquido,
    preco, setPreco, 
    estoque, setEstoque
  } = estados;

  return (
    <>
      
      <div className="form-row">
        <div className="form-group">
          <label>Cód. Interno:</label>
          <input type="text" value={codigoInterno} onChange={e => setCodigoInterno(e.target.value)} placeholder="Pesquisa do produto" />
        </div>
        <div className="form-group">
          <label>Cód. Fornecedor:</label>
          <input type="text" value={codigoFornecedor} onChange={e => setCodigoFornecedor(e.target.value)} placeholder="Identificação do fornecedor" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Grupo:</label>
          <input type="text" value={grupo} onChange={e => setGrupo(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Subgrupo:</label>
          <input type="text" value={subgrupo} onChange={e => setSubgrupo(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Categoria:</label>
          <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
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
            <input type="text" value={ncm} onChange={e => setNcm(e.target.value)} />
          </div>
          <div className="form-group">
            <label>CSOSN:</label>
            <input type="text" value={csosn} onChange={e => setCsosn(e.target.value)} />
          </div>
          <div className="form-group">
            <label>CST:</label>
            <input type="text" value={cst} onChange={e => setCst(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>CFOP Dentro do Estado:</label>
            <input type="text" value={cfopDentro} onChange={e => setCfopDentro(e.target.value)} />
          </div>
          <div className="form-group">
            <label>CFOP Fora do Estado:</label>
            <input type="text" value={cfopFora} onChange={e => setCfopFora(e.target.value)} />
          </div>
        </div>
      </fieldset>

      <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
        <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>Pesos e Medidas</legend>
        <div className="form-row">
          <div className="form-group">
            <label>Und. Compra:</label>
            <input type="text" value={unidadeCompra} onChange={e => setUnidadeCompra(e.target.value)} placeholder="Ex: CX, PC" />
          </div>
          <div className="form-group">
            <label>Und. Venda:</label>
            <input type="text" value={unidadeVenda} onChange={e => setUnidadeVenda(e.target.value)} placeholder="Ex: UN, KG" />
          </div>
          <div className="form-group">
            <label>Peso Bruto:</label>
            <input type="number" step="0.001" value={pesoBruto} onChange={e => setPesoBruto(e.target.value)} placeholder="0.000" />
          </div>
          <div className="form-group">
            <label>Peso Líquido:</label>
            <input type="number" step="0.001" value={pesoLiquido} onChange={e => setPesoLiquido(e.target.value)} placeholder="0.000" />
          </div>
        </div>
      </fieldset>

      {/* Mantendo os campos básicos de preço e estoque que já existiam na tela de dados */}
      <div className="form-row">
        <div className="form-group">
          <label>Preço de Venda Base (R$) *</label>
          <input type="number" step="0.000001" value={preco} onChange={e => setPreco(e.target.value)} required placeholder="0.000000" />
        </div>
        <div className="form-group">
          <label>Estoque Inicial *</label>
          <input type="number" value={estoque} onChange={e => setEstoque(e.target.value)} required placeholder="0" />
        </div>
      </div>
    </>
  );
}
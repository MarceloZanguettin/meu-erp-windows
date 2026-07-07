import React, { useEffect, useState } from 'react';
import { fetchRepresentantes } from './services/comissaoService.js';

/**
 * Campos do formulário de Comissão (GENUS.COMISSAO) — reutilizado tanto pelo
 * modal de edição em ComissaoWindow quanto pela janela de criação
 * NovoComissaoWindow, para os dois ficarem sempre em sincronia.
 */
export default function CamposComissao({ form, setForm }) {
  const [representantes, setRepresentantes] = useState([]);

  useEffect(() => {
    fetchRepresentantes().then(setRepresentantes);
  }, []);

  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="cm-secao">Vínculo</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Representante</label>
          <select value={form.representante_id} onChange={set('representante_id')}>
            <option value="">Nenhum</option>
            {representantes.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={form.codigo} onChange={set('codigo')} />
        </div>
      </div>

      <div className="cm-secao">Origem (códigos GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Empresa</label>
          <input type="number" value={form.cod_empresa} onChange={set('cod_empresa')} />
        </div>
        <div className="form-group">
          <label>Cód. Representante</label>
          <input type="number" value={form.cod_representante} onChange={set('cod_representante')} />
        </div>
        <div className="form-group">
          <label>Cód. Saída</label>
          <input type="number" value={form.cod_saida} onChange={set('cod_saida')} />
        </div>
        <div className="form-group">
          <label>Nota Fiscal</label>
          <input type="number" value={form.nota_fiscal} onChange={set('nota_fiscal')} />
        </div>
        <div className="form-group">
          <label>Cód. Prospecção</label>
          <input type="number" value={form.cod_prospeccao} onChange={set('cod_prospeccao')} />
        </div>
        <div className="form-group">
          <label>Cód. Pedido</label>
          <input type="number" value={form.cod_pedido} onChange={set('cod_pedido')} />
        </div>
        <div className="form-group">
          <label>Cód. Receber</label>
          <input type="number" value={form.cod_receber} onChange={set('cod_receber')} />
        </div>
        <div className="form-group">
          <label>Cód. Depósito</label>
          <input type="number" value={form.cod_deposito} onChange={set('cod_deposito')} />
        </div>
        <div className="form-group">
          <label>Cód. Pagar</label>
          <input type="number" value={form.cod_pagar} onChange={set('cod_pagar')} />
        </div>
      </div>

      <div className="cm-secao">Datas</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Emissão</label>
          <input type="date" value={form.emissao} onChange={set('emissao')} />
        </div>
        <div className="form-group">
          <label>Vencimento</label>
          <input type="date" value={form.vencimento} onChange={set('vencimento')} />
        </div>
        <div className="form-group">
          <label>Data Processamento</label>
          <input type="date" value={form.dt_processamento} onChange={set('dt_processamento')} />
        </div>
      </div>

      <div className="cm-secao">Valores</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Valor Comissão</label>
          <input type="number" step="0.01" value={form.valor_comissao} onChange={set('valor_comissao')} />
        </div>
        <div className="form-group">
          <label>Percentual Comissão</label>
          <input type="number" step="0.01" value={form.percentual_comissao} onChange={set('percentual_comissao')} />
        </div>
        <div className="form-group">
          <label>Total</label>
          <input type="number" step="0.01" value={form.total} onChange={set('total')} />
        </div>
        <div className="form-group">
          <label>Dedução</label>
          <input type="number" step="0.01" value={form.deducao} onChange={set('deducao')} />
        </div>
      </div>

      <div className="cm-secao">Classificação</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Tipo Comissão</label>
          <input maxLength={1} value={form.tipo_comissao} onChange={set('tipo_comissao')} />
        </div>
        <div className="form-group">
          <label>Tipo Func.</label>
          <input maxLength={1} value={form.tipo_func} onChange={set('tipo_func')} />
        </div>
      </div>
    </>
  );
}

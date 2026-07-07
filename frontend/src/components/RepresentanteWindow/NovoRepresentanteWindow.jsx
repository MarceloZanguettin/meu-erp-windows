import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import AbaGenusRepresentante from './AbaGenusRepresentante.jsx';
import { GENUS_REPRESENTANTE_FORM_VAZIO, normalizarRepresentante } from './genusRepresentanteFields.js';
import './RepresentanteWindow.css';

const API = 'http://localhost:8050';
const FORM_VAZIO = {
  nome: '', cpf_cnpj: '', email: '', telefone: '',
  celular: '', comissao_percentual: '', meta_mensal: '', ativo: true,
  // Campos migrados de GENUS.REPRESENTANTE — ver AbaGenusRepresentante / genusRepresentanteFields.js
  ...GENUS_REPRESENTANTE_FORM_VAZIO,
};

export default function NovoRepresentanteWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const setField = (campo, valor) => setForm({ ...form, [campo]: valor });

  const salvar = async () => {
    const r = await fetch(`${API}/cadastros/representantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarRepresentante(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Representante" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={780} altura={760} minLargura={560} minAltura={460}
      salvar={salvar}
    >
      <div className="form-grid-2">
        <div className="form-group form-group-full">
          <label>Nome *</label>
          <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
        </div>
        <div className="form-group">
          <label>CPF / CNPJ</label>
          <input value={form.cpf_cnpj} onChange={e => setForm({ ...form, cpf_cnpj: e.target.value })} />
        </div>
        <div className="form-group">
          <label>E-mail</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Celular</label>
          <input value={form.celular} onChange={e => setForm({ ...form, celular: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Comissão (%)</label>
          <input type="number" step="0.01" min="0" max="100" value={form.comissao_percentual} onChange={e => setForm({ ...form, comissao_percentual: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Meta Mensal (R$)</label>
          <input type="number" step="0.01" min="0" value={form.meta_mensal} onChange={e => setForm({ ...form, meta_mensal: e.target.value })} />
        </div>
        <div className="form-group form-group-checkbox">
          <label>
            <input type="checkbox" checked={!!form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })} />
            Ativo
          </label>
        </div>
      </div>

      <div className="repr-secao">GENUS (tabela REPRESENTANTE — legado)</div>
      <AbaGenusRepresentante form={form} setField={setField} />
    </CadastroFormWindow>
  );
}

import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import AbaGenusTransportadora from './AbaGenusTransportadora.jsx';
import { GENUS_TRANSPORTADORA_FORM_VAZIO, normalizarTransportadora } from './genusTransportadoraFields.js';
import './TransportadoraWindow.css';

const API = 'http://localhost:8050';
const FORM_VAZIO = {
  nome: '', cnpj: '', email: '', telefone: '',
  cep: '', logradouro: '', numero: '', bairro: '', cidade: '', uf: '',
  observacao: '', ativo: true,
  // Campos migrados de GENUS.TRANSPORTADOR — ver AbaGenusTransportadora / genusTransportadoraFields.js
  ...GENUS_TRANSPORTADORA_FORM_VAZIO,
};

export default function NovaTransportadoraWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const setField = (campo, valor) => setForm({ ...form, [campo]: valor });

  const salvar = async () => {
    const r = await fetch(`${API}/cadastros/transportadoras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarTransportadora(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Transportadora" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={780} altura={640} minLargura={560} minAltura={460}
      salvar={salvar}
    >
      <div className="form-grid-2">
        <div className="form-group form-group-full">
          <label>Nome *</label>
          <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
        </div>
        <div className="form-group">
          <label>CNPJ</label>
          <input value={form.cnpj} onChange={e => setForm({ ...form, cnpj: e.target.value })} />
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
          <label>CEP</label>
          <input value={form.cep} onChange={e => setForm({ ...form, cep: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Logradouro</label>
          <input value={form.logradouro} onChange={e => setForm({ ...form, logradouro: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Número</label>
          <input value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Bairro</label>
          <input value={form.bairro} onChange={e => setForm({ ...form, bairro: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Cidade</label>
          <input value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} />
        </div>
        <div className="form-group">
          <label>UF</label>
          <input maxLength={2} value={form.uf} onChange={e => setForm({ ...form, uf: e.target.value.toUpperCase() })} />
        </div>
        <div className="form-group form-group-full">
          <label>Observação</label>
          <textarea rows={2} value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
        </div>
        <div className="form-group form-group-checkbox">
          <label>
            <input type="checkbox" checked={!!form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })} />
            Ativo
          </label>
        </div>
      </div>

      <div className="transp-secao">GENUS (tabela TRANSPORTADOR — legado)</div>
      <AbaGenusTransportadora form={form} setField={setField} />
    </CadastroFormWindow>
  );
}

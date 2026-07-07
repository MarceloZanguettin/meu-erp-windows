import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import AbaGenusCliente from './AbaGenusCliente.jsx';
import { GENUS_CLIENTE_FORM_VAZIO, normalizarClienteCompleto } from './genusClienteFields.js';
import './ClienteWindow.css';

const API = 'http://localhost:8050';
const FORM_VAZIO = {
  tipo_pessoa: 'PF',
  nome: '',
  nome_fantasia: '',
  documento: '',
  rg_ie: '',
  data_nascimento: '',
  email: '',
  telefone: '',
  celular: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  limite_credito: '',
  observacao: '',
  ativo: true,
  // Campos migrados de GENUS.CLIENTE — ver AbaGenusCliente / genusClienteFields.js
  ...GENUS_CLIENTE_FORM_VAZIO,
};

export default function NovoClienteWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const setField = (campo, valor) => setForm({ ...form, [campo]: valor });

  const salvar = async () => {
    const r = await fetch(`${API}/cadastros/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarClienteCompleto(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Cliente" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={760} altura={660} minLargura={560} minAltura={440}
      salvar={salvar}
    >
      <div className="form-grid-2">
        <div className="form-group">
          <label>Tipo Pessoa *</label>
          <select value={form.tipo_pessoa} onChange={e => setForm({ ...form, tipo_pessoa: e.target.value })}>
            <option value="PF">Pessoa Física</option>
            <option value="PJ">Pessoa Jurídica</option>
          </select>
        </div>
        <div className="form-group">
          <label>Nome *</label>
          <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Nome Fantasia</label>
          <input value={form.nome_fantasia} onChange={e => setForm({ ...form, nome_fantasia: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{form.tipo_pessoa === 'PJ' ? 'CNPJ' : 'CPF'}</label>
          <input value={form.documento} onChange={e => setForm({ ...form, documento: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{form.tipo_pessoa === 'PJ' ? 'Inscrição Estadual' : 'RG'}</label>
          <input value={form.rg_ie} onChange={e => setForm({ ...form, rg_ie: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Data de Nascimento</label>
          <input type="date" value={form.data_nascimento} onChange={e => setForm({ ...form, data_nascimento: e.target.value })} />
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
      </div>

      <div className="form-secao">Endereço</div>
      <div className="form-grid-2">
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
          <label>Complemento</label>
          <input value={form.complemento} onChange={e => setForm({ ...form, complemento: e.target.value })} />
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
      </div>

      <div className="form-secao">Comercial</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Limite de Crédito (R$)</label>
          <input type="number" step="0.01" value={form.limite_credito} onChange={e => setForm({ ...form, limite_credito: e.target.value })} />
        </div>
        <div className="form-group form-group-full">
          <label>Observação</label>
          <textarea rows={3} value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
        </div>
        <div className="form-group form-group-checkbox">
          <label>
            <input type="checkbox" checked={!!form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })} />
            Ativo
          </label>
        </div>
      </div>

      <div className="form-secao">GENUS (tabela CLIENTE — legado)</div>
      <AbaGenusCliente form={form} setField={setField} />
    </CadastroFormWindow>
  );
}

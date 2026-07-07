import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import AbaGenusFornecedor from './AbaGenusFornecedor.jsx';
import { GENUS_FORNECEDOR_FORM_VAZIO, normalizarFornecedor } from './genusFornecedorFields.js';
import './FornecedorWindow.css';

const API = 'http://localhost:8050';
const FORM_VAZIO = {
  nome: '',
  cnpj: '',
  ie: '',
  email: '',
  telefone: '',
  celular: '',
  website: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  prazo_entrega_dias: '',
  observacao: '',
  ativo: true,
  // Campos migrados de GENUS.FORNECEDOR — ver AbaGenusFornecedor / genusFornecedorFields.js
  ...GENUS_FORNECEDOR_FORM_VAZIO,
};

export default function NovoFornecedorWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const setField = (campo, valor) => setForm({ ...form, [campo]: valor });

  const salvar = async () => {
    const r = await fetch(`${API}/cadastros/fornecedores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarFornecedor(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Fornecedor" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={720} altura={620} minLargura={520} minAltura={420}
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
          <label>Inscrição Estadual</label>
          <input value={form.ie} onChange={e => setForm({ ...form, ie: e.target.value })} />
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
          <label>Website</label>
          <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
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
          <label>Prazo de Entrega (dias)</label>
          <input type="number" min="0" value={form.prazo_entrega_dias} onChange={e => setForm({ ...form, prazo_entrega_dias: e.target.value })} />
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

      <div className="form-secao">GENUS (tabela FORNECEDOR — legado)</div>
      <AbaGenusFornecedor form={form} setField={setField} />
    </CadastroFormWindow>
  );
}

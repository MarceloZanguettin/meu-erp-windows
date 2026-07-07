import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import AbaGenusFuncionario from './AbaGenusFuncionario.jsx';
import { GENUS_FUNCIONARIO_FORM_VAZIO, normalizarFuncionario } from './genusFuncionarioFields.js';
import './FuncionarioWindow.css';

const API = 'http://localhost:8050';
const FORM_VAZIO = {
  nome: '', cpf: '', rg: '', data_nascimento: '', data_admissao: '',
  cargo: '', departamento: '', salario: '', email: '', telefone: '',
  cep: '', logradouro: '', numero: '', bairro: '', cidade: '', uf: '',
  ativo: true,
  // Campos migrados de GENUS.FUNCIONARIO — ver AbaGenusFuncionario / genusFuncionarioFields.js
  ...GENUS_FUNCIONARIO_FORM_VAZIO,
};

export default function NovoFuncionarioWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const setField = (campo, valor) => setForm({ ...form, [campo]: valor });

  const salvar = async () => {
    const r = await fetch(`${API}/cadastros/funcionarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarFuncionario(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Funcionário" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={820} altura={640} minLargura={560} minAltura={460}
      salvar={salvar}
    >
      <div className="func-secao">Dados Pessoais</div>
      <div className="form-grid-2">
        <div className="form-group form-group-full">
          <label>Nome *</label>
          <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
        </div>
        <div className="form-group">
          <label>CPF</label>
          <input value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} />
        </div>
        <div className="form-group">
          <label>RG</label>
          <input value={form.rg} onChange={e => setForm({ ...form, rg: e.target.value })} />
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
      </div>

      <div className="func-secao">Dados Profissionais</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cargo</label>
          <input value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Departamento</label>
          <input value={form.departamento} onChange={e => setForm({ ...form, departamento: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Salário (R$)</label>
          <input type="number" step="0.01" min="0" value={form.salario} onChange={e => setForm({ ...form, salario: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Data de Admissão</label>
          <input type="date" value={form.data_admissao} onChange={e => setForm({ ...form, data_admissao: e.target.value })} />
        </div>
      </div>

      <div className="func-secao">Endereço</div>
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

      <div className="form-group form-group-checkbox" style={{ marginTop: 8 }}>
        <label>
          <input type="checkbox" checked={!!form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })} />
          Ativo
        </label>
      </div>

      <div className="func-secao">GENUS (tabela FUNCIONARIO — legado)</div>
      <AbaGenusFuncionario form={form} setField={setField} />
    </CadastroFormWindow>
  );
}

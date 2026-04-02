import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import './FuncionarioWindow.css';

const FORM_VAZIO = {
  nome: '',
  cpf: '',
  rg: '',
  data_nascimento: '',
  data_admissao: '',
  cargo: '',
  departamento: '',
  salario: '',
  email: '',
  telefone: '',
  cep: '',
  logradouro: '',
  numero: '',
  bairro: '',
  cidade: '',
  uf: '',
  ativo: true,
};

const fmtMoeda = (v) => v !== '' && v !== null && v !== undefined
  ? Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  : '-';

export default function FuncionarioWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirAdicionar, abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/cadastros/funcionarios', FORM_VAZIO);

  const itensFiltrados = itens.filter(i =>
    !busca || i.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    i.cpf?.includes(busca) || i.cargo?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => {
    if (campo === 'salario') return fmtMoeda(item.salario);
    return item[campo] ?? '-';
  };

  return (
    <JanelaBase id={id} titulo="Funcionários" onClose={onClose} onMinimize={onMinimize} largura={1000} altura={620}>
      <div className="func-body">
        <BarraFerramentas busca={busca} setBusca={setBusca} onAdicionar={() => abrirJanela('novoFuncionario', { onSalvar: recarregar })} placeholder="Buscar por nome, CPF ou cargo..." />
        {loading ? (
          <div className="func-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['ID', 'Nome', 'CPF', 'Cargo', 'Departamento', 'Salário']}
            campos={['id', 'nome', 'cpf', 'cargo', 'departamento', 'salario']}
            itens={itensFiltrados}
            onEditar={abrirEditar}
            onExcluir={excluir}
            renderCelula={renderCelula}
          />
        )}
      </div>

      {modal && (
        <Portal>
          <div className="modal-overlay">
          <div className="modal-content func-modal">
            <div className="modal-header">
              <strong>{editandoId ? 'Editar Funcionário' : 'Novo Funcionário'}</strong>
            </div>
            <div className="modal-body func-modal-body">
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
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={fecharModal}>Cancelar</button>
              <button className="btn-save" onClick={salvar}>Salvar</button>
            </div>
          </div>
          </div>
        </Portal>
      )}
    </JanelaBase>
  );
}

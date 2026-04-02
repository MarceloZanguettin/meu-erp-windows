import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import './ClienteWindow.css';

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
};

const ABAS = ['Lista', 'Dados', 'Endereço', 'Comercial'];

export default function ClienteWindow({ id, onClose, onMinimize }) {
  const [abaAtiva, setAbaAtiva] = useState('Lista');
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirAdicionar, abrirEditar, salvar, excluir, fecharModal,
  } = useCrud('/cadastros/clientes', FORM_VAZIO);

  const handleNovo = () => {
    abrirAdicionar();
    setAbaAtiva('Dados');
  };

  const handleEditar = (item) => {
    abrirEditar(item);
    setAbaAtiva('Dados');
  };

  const handleSalvar = async () => {
    await salvar();
    setAbaAtiva('Lista');
  };

  const handleCancelar = () => {
    fecharModal();
    setAbaAtiva('Lista');
  };

  const renderCelula = (item, campo) => {
    if (campo === 'ativo') return item.ativo ? 'Sim' : 'Não';
    return item[campo] ?? '-';
  };

  const itensFiltrados = itens.filter(i =>
    !busca || i.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    i.documento?.includes(busca) || i.email?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <JanelaBase id={id} titulo="Clientes" onClose={onClose} onMinimize={onMinimize} largura={1000} altura={650}>
      <div className="tabs-header">
        {ABAS.map(aba => (
          <button
            key={aba}
            type="button"
            className={`tab-btn ${abaAtiva === aba ? 'active' : ''}`}
            onClick={() => setAbaAtiva(aba)}
          >
            {aba}
          </button>
        ))}
      </div>

      <div className="tab-content cliente-tab-content">
        {abaAtiva === 'Lista' && (
          <div className="cliente-lista">
            <BarraFerramentas
              busca={busca}
              setBusca={setBusca}
              onAdicionar={handleNovo}
              placeholder="Buscar por nome, documento ou e-mail..."
            />
            {loading ? (
              <div className="cliente-loading">Carregando...</div>
            ) : (
              <TabelaCrud
                colunas={['ID', 'Nome', 'Tipo', 'Documento', 'E-mail', 'Telefone', 'Ativo']}
                campos={['id', 'nome', 'tipo_pessoa', 'documento', 'email', 'telefone', 'ativo']}
                itens={itensFiltrados}
                onEditar={handleEditar}
                onExcluir={excluir}
                renderCelula={renderCelula}
              />
            )}
          </div>
        )}

        {(abaAtiva === 'Dados' && modal) && (
          <div className="cliente-form">
            <div className="form-titulo">{editandoId ? 'Editando Cliente' : 'Novo Cliente'}</div>
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
            <div className="form-acoes">
              <button className="btn-cancel" onClick={handleCancelar}>Cancelar</button>
              <button className="btn-save" onClick={handleSalvar}>Salvar</button>
            </div>
          </div>
        )}

        {(abaAtiva === 'Endereço' && modal) && (
          <div className="cliente-form">
            <div className="form-titulo">Endereço</div>
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
            <div className="form-acoes">
              <button className="btn-cancel" onClick={handleCancelar}>Cancelar</button>
              <button className="btn-save" onClick={handleSalvar}>Salvar</button>
            </div>
          </div>
        )}

        {(abaAtiva === 'Comercial' && modal) && (
          <div className="cliente-form">
            <div className="form-titulo">Dados Comerciais</div>
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
            <div className="form-acoes">
              <button className="btn-cancel" onClick={handleCancelar}>Cancelar</button>
              <button className="btn-save" onClick={handleSalvar}>Salvar</button>
            </div>
          </div>
        )}

        {!modal && abaAtiva !== 'Lista' && (
          <div className="cliente-sem-selecao">
            <p>Clique em "+ Novo" ou edite um cliente para preencher os dados.</p>
          </div>
        )}
      </div>
    </JanelaBase>
  );
}

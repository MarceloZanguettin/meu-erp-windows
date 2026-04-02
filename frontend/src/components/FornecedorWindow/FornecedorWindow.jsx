import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import './FornecedorWindow.css';

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
};

const ABAS = ['Lista', 'Dados', 'Endereço', 'Comercial'];

export default function FornecedorWindow({ id, onClose, onMinimize }) {
  const [abaAtiva, setAbaAtiva] = useState('Lista');
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirAdicionar, abrirEditar, salvar, excluir, fecharModal,
  } = useCrud('/cadastros/fornecedores', FORM_VAZIO);

  const handleNovo = () => { abrirAdicionar(); setAbaAtiva('Dados'); };
  const handleEditar = (item) => { abrirEditar(item); setAbaAtiva('Dados'); };
  const handleSalvar = async () => { await salvar(); setAbaAtiva('Lista'); };
  const handleCancelar = () => { fecharModal(); setAbaAtiva('Lista'); };

  const renderCelula = (item, campo) => {
    if (campo === 'ativo') return item.ativo ? 'Sim' : 'Não';
    if (campo === 'cidade_uf') return item.cidade && item.uf ? `${item.cidade}/${item.uf}` : (item.cidade || item.uf || '-');
    return item[campo] ?? '-';
  };

  const itensFiltrados = itens.filter(i =>
    !busca || i.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    i.cnpj?.includes(busca) || i.email?.toLowerCase().includes(busca.toLowerCase())
  );

  const itensMapped = itensFiltrados.map(i => ({ ...i, cidade_uf: `${i.cidade || ''}${i.uf ? '/' + i.uf : ''}` }));

  return (
    <JanelaBase id={id} titulo="Fornecedores" onClose={onClose} onMinimize={onMinimize} largura={1000} altura={650}>
      <div className="tabs-header">
        {ABAS.map(aba => (
          <button key={aba} type="button" className={`tab-btn ${abaAtiva === aba ? 'active' : ''}`} onClick={() => setAbaAtiva(aba)}>
            {aba}
          </button>
        ))}
      </div>

      <div className="tab-content fornecedor-tab-content">
        {abaAtiva === 'Lista' && (
          <div className="fornecedor-lista">
            <BarraFerramentas busca={busca} setBusca={setBusca} onAdicionar={handleNovo} placeholder="Buscar por nome, CNPJ ou e-mail..." />
            {loading ? <div className="fornecedor-loading">Carregando...</div> : (
              <TabelaCrud
                colunas={['ID', 'Nome', 'CNPJ', 'E-mail', 'Telefone', 'Cidade/UF', 'Ativo']}
                campos={['id', 'nome', 'cnpj', 'email', 'telefone', 'cidade_uf', 'ativo']}
                itens={itensMapped}
                onEditar={handleEditar}
                onExcluir={excluir}
                renderCelula={renderCelula}
              />
            )}
          </div>
        )}

        {abaAtiva === 'Dados' && modal && (
          <div className="fornecedor-form">
            <div className="form-titulo">{editandoId ? 'Editando Fornecedor' : 'Novo Fornecedor'}</div>
            <div className="form-grid-2">
              <div className="form-group">
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
            <div className="form-acoes">
              <button className="btn-cancel" onClick={handleCancelar}>Cancelar</button>
              <button className="btn-save" onClick={handleSalvar}>Salvar</button>
            </div>
          </div>
        )}

        {abaAtiva === 'Endereço' && modal && (
          <div className="fornecedor-form">
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

        {abaAtiva === 'Comercial' && modal && (
          <div className="fornecedor-form">
            <div className="form-titulo">Dados Comerciais</div>
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
            <div className="form-acoes">
              <button className="btn-cancel" onClick={handleCancelar}>Cancelar</button>
              <button className="btn-save" onClick={handleSalvar}>Salvar</button>
            </div>
          </div>
        )}

        {!modal && abaAtiva !== 'Lista' && (
          <div className="fornecedor-sem-selecao">
            <p>Clique em "+ Novo" ou edite um fornecedor para preencher os dados.</p>
          </div>
        )}
      </div>
    </JanelaBase>
  );
}

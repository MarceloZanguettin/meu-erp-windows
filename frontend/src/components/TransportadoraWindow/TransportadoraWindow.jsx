import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import AbaGenusTransportadora from './AbaGenusTransportadora.jsx';
import { GENUS_TRANSPORTADORA_FORM_VAZIO, normalizarTransportadora } from './genusTransportadoraFields.js';
import './TransportadoraWindow.css';

const FORM_VAZIO = {
  nome: '',
  cnpj: '',
  email: '',
  telefone: '',
  cep: '',
  logradouro: '',
  numero: '',
  bairro: '',
  cidade: '',
  uf: '',
  observacao: '',
  ativo: true,
  // Campos migrados de GENUS.TRANSPORTADOR — ver AbaGenusTransportadora / genusTransportadoraFields.js
  ...GENUS_TRANSPORTADORA_FORM_VAZIO,
};

export default function TransportadoraWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirAdicionar, abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/cadastros/transportadoras', FORM_VAZIO, normalizarTransportadora);

  const setField = (campo, valor) => setForm({ ...form, [campo]: valor });

  const itensFiltrados = itens.filter(i =>
    !busca || i.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    i.cnpj?.includes(busca)
  );

  return (
    <JanelaBase id={id} titulo="Transportadoras" onClose={onClose} onMinimize={onMinimize} largura={950} altura={600}>
      <div className="transp-body">
        <BarraFerramentas busca={busca} setBusca={setBusca} onAdicionar={() => abrirJanela('novaTransportadora', { onSalvar: recarregar })} placeholder="Buscar por nome ou CNPJ..." />
        {loading ? (
          <div className="transp-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['ID', 'Nome', 'CNPJ', 'E-mail', 'Telefone', 'Cidade']}
            campos={['id', 'nome', 'cnpj', 'email', 'telefone', 'cidade']}
            itens={itensFiltrados}
            onEditar={abrirEditar}
            onExcluir={excluir}
          />
        )}
      </div>

      {modal && (
        <Portal>
          <div className="modal-overlay">
            <div className="modal-content transp-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Transportadora' : 'Nova Transportadora'}</strong>
              </div>
              <div className="modal-body transp-modal-body">
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

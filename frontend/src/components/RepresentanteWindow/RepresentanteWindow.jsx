import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import AbaGenusRepresentante from './AbaGenusRepresentante.jsx';
import { GENUS_REPRESENTANTE_FORM_VAZIO, normalizarRepresentante } from './genusRepresentanteFields.js';
import './RepresentanteWindow.css';

const FORM_VAZIO = {
  nome: '',
  cpf_cnpj: '',
  email: '',
  telefone: '',
  celular: '',
  comissao_percentual: '',
  meta_mensal: '',
  ativo: true,
  // Campos migrados de GENUS.REPRESENTANTE — ver AbaGenusRepresentante / genusRepresentanteFields.js
  ...GENUS_REPRESENTANTE_FORM_VAZIO,
};

const fmtMoeda = (v) => v !== '' && v !== null && v !== undefined
  ? Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  : '-';

export default function RepresentanteWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/cadastros/representantes', FORM_VAZIO, normalizarRepresentante);

  const setField = (campo, valor) => setForm({ ...form, [campo]: valor });

  const itensFiltrados = itens.filter(i =>
    !busca || i.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    i.cpf_cnpj?.includes(busca)
  );

  const renderCelula = (item, campo) => {
    if (campo === 'comissao_percentual') return item.comissao_percentual != null ? `${item.comissao_percentual}%` : '-';
    if (campo === 'meta_mensal') return fmtMoeda(item.meta_mensal);
    return item[campo] ?? '-';
  };

  return (
    <JanelaBase id={id} titulo="Representantes" onClose={onClose} onMinimize={onMinimize} largura={920} altura={580}>
      <div className="repr-body">
        <BarraFerramentas busca={busca} setBusca={setBusca} onAdicionar={() => abrirJanela('novoRepresentante', { onSalvar: recarregar })} placeholder="Buscar por nome ou CPF/CNPJ..." />
        {loading ? (
          <div className="repr-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['ID', 'Nome', 'CPF/CNPJ', 'E-mail', 'Comissão %', 'Meta Mensal']}
            campos={['id', 'nome', 'cpf_cnpj', 'email', 'comissao_percentual', 'meta_mensal']}
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
          <div className="modal-content repr-modal">
            <div className="modal-header">
              <strong>{editandoId ? 'Editar Representante' : 'Novo Representante'}</strong>
            </div>
            <div className="modal-body repr-modal-body">
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

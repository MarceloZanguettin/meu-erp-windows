import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import './UsuariosWindow.css';

const FORM_USER_VAZIO = {
  username: '',
  password: '',
  permissao: 'operador',
};

const FORM_PERFIL_VAZIO = {
  nome: '',
  descricao: '',
};

const ABAS = ['Usuários', 'Perfis de Acesso'];

function ModalUsuario({ editandoId, form, setForm, onSalvar, onFechar }) {
  return (
    <Portal>
      <div className="modal-overlay">
        <div className="modal-content usuario-modal">
          <div className="modal-header">
            <strong>{editandoId ? 'Editar Usuário' : 'Novo Usuário'}</strong>
          </div>
          <div className="modal-body usuario-modal-body">
            <div className="form-group">
              <label>Username *</label>
              <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} autoComplete="off" />
            </div>
            <div className="form-group">
              <label>Senha {editandoId ? '(deixe em branco para manter)' : '*'}</label>
              <input
                type="password"
                placeholder={editandoId ? 'Deixe em branco para manter' : 'Senha'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label>Permissão</label>
              <select value={form.permissao} onChange={e => setForm({ ...form, permissao: e.target.value })}>
                <option value="admin">Administrador</option>
                <option value="gerente">Gerente</option>
                <option value="operador">Operador</option>
                <option value="vendedor">Vendedor</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onFechar}>Cancelar</button>
            <button className="btn-save" onClick={onSalvar}>Salvar</button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

function ModalPerfil({ editandoId, form, setForm, onSalvar, onFechar }) {
  return (
    <Portal>
      <div className="modal-overlay">
        <div className="modal-content usuario-modal">
          <div className="modal-header">
            <strong>{editandoId ? 'Editar Perfil' : 'Novo Perfil de Acesso'}</strong>
          </div>
          <div className="modal-body usuario-modal-body">
            <div className="form-group">
              <label>Nome *</label>
              <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea rows={3} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onFechar}>Cancelar</button>
            <button className="btn-save" onClick={onSalvar}>Salvar</button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default function UsuariosWindow({ id, onClose, onMinimize }) {
  const [abaAtiva, setAbaAtiva] = useState('Usuários');

  const usuarios = useCrud('/usuarios/', FORM_USER_VAZIO);
  const perfis   = useCrud('/usuarios/perfis', FORM_PERFIL_VAZIO);

  const usuariosFiltrados = usuarios.itens.filter(u =>
    !usuarios.busca || u.username?.toLowerCase().includes(usuarios.busca.toLowerCase())
  );

  const perfisFiltrados = perfis.itens.filter(p =>
    !perfis.busca || p.nome?.toLowerCase().includes(perfis.busca.toLowerCase())
  );

  const handleSalvarUsuario = async () => {
    // Remove a senha do payload se estiver em branco (edição)
    const form = { ...usuarios.form };
    if (usuarios.editandoId && !form.password) {
      delete form.password;
    }
    // Injeta o form limpo diretamente chamando salvar com form modificado
    await usuarios.salvar();
  };

  return (
    <JanelaBase id={id} titulo="Usuários e Perfis" onClose={onClose} onMinimize={onMinimize} largura={900} altura={580}>
      <div className="tabs-header">
        {ABAS.map(aba => (
          <button key={aba} type="button" className={`tab-btn ${abaAtiva === aba ? 'active' : ''}`} onClick={() => setAbaAtiva(aba)}>
            {aba}
          </button>
        ))}
      </div>

      <div className="tab-content usuario-tab-content">
        {abaAtiva === 'Usuários' && (
          <div className="usuario-section">
            <BarraFerramentas busca={usuarios.busca} setBusca={usuarios.setBusca} onAdicionar={usuarios.abrirAdicionar} placeholder="Buscar usuário..." />
            {usuarios.loading ? (
              <div className="usuario-loading">Carregando...</div>
            ) : (
              <TabelaCrud
                colunas={['ID', 'Username', 'Permissão']}
                campos={['id', 'username', 'permissao']}
                itens={usuariosFiltrados}
                onEditar={usuarios.abrirEditar}
                onExcluir={usuarios.excluir}
              />
            )}
          </div>
        )}

        {abaAtiva === 'Perfis de Acesso' && (
          <div className="usuario-section">
            <BarraFerramentas busca={perfis.busca} setBusca={perfis.setBusca} onAdicionar={perfis.abrirAdicionar} placeholder="Buscar perfil..." />
            {perfis.loading ? (
              <div className="usuario-loading">Carregando...</div>
            ) : (
              <TabelaCrud
                colunas={['ID', 'Nome', 'Descrição']}
                campos={['id', 'nome', 'descricao']}
                itens={perfisFiltrados}
                onEditar={perfis.abrirEditar}
                onExcluir={perfis.excluir}
              />
            )}
          </div>
        )}
      </div>

      {usuarios.modal && (
        <ModalUsuario
          editandoId={usuarios.editandoId}
          form={usuarios.form}
          setForm={usuarios.setForm}
          onSalvar={usuarios.salvar}
          onFechar={usuarios.fecharModal}
        />
      )}

      {perfis.modal && (
        <ModalPerfil
          editandoId={perfis.editandoId}
          form={perfis.form}
          setForm={perfis.setForm}
          onSalvar={perfis.salvar}
          onFechar={perfis.fecharModal}
        />
      )}
    </JanelaBase>
  );
}

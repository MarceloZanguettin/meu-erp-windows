import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposCadastroPessoa from './CamposCadastroPessoa.jsx';
import TabelaContatosCadastro from './components/TabelaContatosCadastro.jsx';
import TabelaAgregadosCadastro from './components/TabelaAgregadosCadastro.jsx';
import { FORM_VAZIO } from './constants.js';
import './CadastroPessoaWindow.css';

export default function CadastroPessoaWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/cadastro-pessoas', FORM_VAZIO);

  const itensFiltrados = itens.filter(i =>
    !busca || i.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    i.fantasia?.toLowerCase().includes(busca.toLowerCase()) ||
    i.cpf_cnpj?.includes(busca)
  );

  const renderCelula = (item, campo) => {
    if (campo === 'situacao') return item.situacao === 'I' ? 'Inativo' : 'Ativo';
    if (campo === 'pessoa') return item.pessoa === 'F' ? 'Física' : 'Jurídica';
    return item[campo] ?? '-';
  };

  return (
    <JanelaBase id={id} titulo="Cadastro (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1000} altura={620}>
      <div className="cadpes-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novoCadastroPessoa', { onSalvar: recarregar })}
          placeholder="Buscar por nome, fantasia ou CPF/CNPJ..."
        />
        {loading ? (
          <div className="cadpes-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['ID', 'Código', 'Nome', 'Fantasia', 'CPF/CNPJ', 'Tipo', 'Situação', 'E-mail']}
            campos={['id', 'codigo', 'nome', 'fantasia', 'cpf_cnpj', 'pessoa', 'situacao', 'email']}
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
            <div className="modal-content cadpes-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Cadastro' : 'Novo Cadastro'}</strong>
              </div>
              <div className="modal-body cadpes-modal-body">
                <CamposCadastroPessoa form={form} setForm={setForm} />
                <TabelaContatosCadastro cadastroPessoaId={editandoId} />
                <TabelaAgregadosCadastro cadastroPessoaId={editandoId} />
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

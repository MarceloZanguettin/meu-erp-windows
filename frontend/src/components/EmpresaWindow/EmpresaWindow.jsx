import React from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import Portal from '../shared/Portal.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import CamposEmpresa from './CamposEmpresa.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarEmpresa } from './services/empresaService.js';
import './EmpresaWindow.css';

/**
 * Janela de listagem/edição de Empresa (GENUS.EMPRESA).
 *
 * Reconhece todos os campos migrados da tabela GENUS EMPRESA — ver
 * docstring do model Empresa em backend/models/tabelas.py. Diferente das
 * demais entidades GENUS já migradas (Cliente/Fornecedor/Representante/
 * Funcionario/Transportadora), EMPRESA não tem CODCADASTRO — não exige
 * JOIN com CADASTRO para ficar completa.
 */
export default function EmpresaWindow({ id, onClose, onMinimize, abrirJanela }) {
  const {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirEditar, salvar, excluir, fecharModal, recarregar,
  } = useCrud('/financeiro/empresas', FORM_VAZIO, normalizarEmpresa);

  const itensFiltrados = itens.filter(i =>
    !busca ||
    i.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    i.razao?.toLowerCase().includes(busca.toLowerCase()) ||
    i.cnpj?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderCelula = (item, campo) => item[campo] ?? '-';

  return (
    <JanelaBase id={id} titulo="Empresas (GENUS)" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={640}>
      <div className="ee-body">
        <BarraFerramentas
          busca={busca}
          setBusca={setBusca}
          onAdicionar={() => abrirJanela('novaEmpresa', { onSalvar: recarregar })}
          placeholder="Buscar por nome, razão social ou CNPJ..."
        />
        {loading ? (
          <div className="ee-loading">Carregando...</div>
        ) : (
          <TabelaCrud
            colunas={['Nome', 'Razão Social', 'Fantasia', 'CNPJ', 'Cidade (GENUS)']}
            campos={['nome', 'razao', 'fantasia', 'cnpj', 'cod_cidade']}
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
            <div className="modal-content ee-modal">
              <div className="modal-header">
                <strong>{editandoId ? 'Editar Empresa' : 'Nova Empresa'}</strong>
              </div>
              <div className="modal-body ee-modal-body">
                <CamposEmpresa form={form} setForm={setForm} />
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

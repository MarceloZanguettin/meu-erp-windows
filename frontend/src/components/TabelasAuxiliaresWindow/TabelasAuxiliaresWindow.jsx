import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import ModalSimples from './ModalSimples.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import './TabelasAuxiliaresWindow.css';

// Configuração de cada aba
const ABAS_CONFIG = [
  {
    key: 'unidades',
    label: 'Unidades de Medida',
    endpoint: '/cadastros/unidades-medida',
    formVazio: { sigla: '', descricao: '' },
    colunas: ['Sigla', 'Descrição'],
    campos: ['sigla', 'descricao'],
    campasModal: [
      { label: 'Sigla *', key: 'sigla' },
      { label: 'Descrição *', key: 'descricao' },
    ],
  },
  {
    key: 'grupos',
    label: 'Grupos/Categorias',
    endpoint: '/cadastros/grupos-produto',
    formVazio: { nome: '', tipo: 'grupo' },
    colunas: ['Nome', 'Tipo'],
    campos: ['nome', 'tipo'],
    campasModal: [
      { label: 'Nome *', key: 'nome' },
      { label: 'Tipo', key: 'tipo', type: 'select', options: [
        { value: 'grupo', label: 'Grupo' },
        { value: 'subgrupo', label: 'Subgrupo' },
        { value: 'categoria', label: 'Categoria' },
      ]},
    ],
  },
  {
    key: 'formasPagamento',
    label: 'Formas de Pagamento',
    endpoint: '/cadastros/formas-pagamento',
    formVazio: { nome: '', parcelas: '1', dias_primeiro_vencimento: '30', intervalo_dias: '30', acrescimo_percentual: '0' },
    colunas: ['Nome', 'Parcelas', 'Primeiro Venc.', 'Intervalo (dias)', 'Acréscimo %'],
    campos: ['nome', 'parcelas', 'dias_primeiro_vencimento', 'intervalo_dias', 'acrescimo_percentual'],
    campasModal: [
      { label: 'Nome *', key: 'nome' },
      { label: 'Parcelas', key: 'parcelas', type: 'number' },
      { label: 'Dias 1º Vencimento', key: 'dias_primeiro_vencimento', type: 'number' },
      { label: 'Intervalo entre parcelas (dias)', key: 'intervalo_dias', type: 'number' },
      { label: 'Acréscimo (%)', key: 'acrescimo_percentual', type: 'number', step: '0.01' },
    ],
  },
  {
    key: 'planoContas',
    label: 'Plano de Contas',
    endpoint: '/cadastros/plano-contas',
    formVazio: { codigo: '', descricao: '', tipo: 'receita' },
    colunas: ['Código', 'Descrição', 'Tipo'],
    campos: ['codigo', 'descricao', 'tipo'],
    campasModal: [
      { label: 'Código *', key: 'codigo' },
      { label: 'Descrição *', key: 'descricao' },
      { label: 'Tipo', key: 'tipo', type: 'select', options: [
        { value: 'receita', label: 'Receita' },
        { value: 'despesa', label: 'Despesa' },
        { value: 'ativo', label: 'Ativo' },
        { value: 'passivo', label: 'Passivo' },
      ]},
    ],
  },
  {
    key: 'centrosCusto',
    label: 'Centros de Custo',
    endpoint: '/cadastros/centros-custo',
    formVazio: { codigo: '', nome: '', ativo: true },
    colunas: ['Código', 'Nome', 'Ativo'],
    campos: ['codigo', 'nome', 'ativo'],
    campasModal: [
      { label: 'Código *', key: 'codigo' },
      { label: 'Nome *', key: 'nome' },
      { label: 'Ativo', key: 'ativo', type: 'checkbox' },
    ],
    renderCelula: (item, campo) => {
      if (campo === 'ativo') return item.ativo ? 'Sim' : 'Não';
      return item[campo] ?? '-';
    },
  },
  {
    key: 'depositos',
    label: 'Depósitos',
    endpoint: '/cadastros/depositos',
    formVazio: { nome: '', descricao: '', ativo: true },
    colunas: ['Nome', 'Descrição', 'Ativo'],
    campos: ['nome', 'descricao', 'ativo'],
    campasModal: [
      { label: 'Nome *', key: 'nome' },
      { label: 'Descrição', key: 'descricao' },
      { label: 'Ativo', key: 'ativo', type: 'checkbox' },
    ],
    renderCelula: (item, campo) => {
      if (campo === 'ativo') return item.ativo ? 'Sim' : 'Não';
      return item[campo] ?? '-';
    },
  },
];

function AbaAuxiliar({ config, abrirJanela }) {
  const { colunas, campos, campasModal, renderCelula } = config;
  const { itens, loading, modal, editandoId, form, setForm, busca, setBusca, abrirAdicionar, abrirEditar, salvar, excluir, fecharModal, recarregar } =
    useCrud(config.endpoint, config.formVazio);

  const itensFiltrados = itens.filter(i =>
    !busca || Object.values(i).some(v => String(v).toLowerCase().includes(busca.toLowerCase()))
  );

  const handleAdicionar = () => abrirJanela('novaEntradaAuxiliar', { config, onSalvar: recarregar });

  return (
    <div className="aba-auxiliar">
      <BarraFerramentas busca={busca} setBusca={setBusca} onAdicionar={handleAdicionar} />
      {loading ? (
        <div className="aux-loading">Carregando...</div>
      ) : (
        <TabelaCrud
          colunas={colunas}
          campos={campos}
          itens={itensFiltrados}
          onEditar={abrirEditar}
          onExcluir={excluir}
          renderCelula={renderCelula}
        />
      )}
      {modal && (
        <ModalSimples
          titulo={config.label}
          campos={campasModal}
          form={form}
          setForm={setForm}
          onSalvar={salvar}
          onFechar={fecharModal}
          editando={!!editandoId}
        />
      )}
    </div>
  );
}

export default function TabelasAuxiliaresWindow({ id, onClose, onMinimize, abrirJanela }) {
  const [abaAtiva, setAbaAtiva] = useState(ABAS_CONFIG[0].key);
  const configAtiva = ABAS_CONFIG.find(a => a.key === abaAtiva);

  return (
    <JanelaBase id={id} titulo="Tabelas Auxiliares" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={640}>
      <div className="tabs-header aux-tabs-header">
        {ABAS_CONFIG.map(a => (
          <button
            key={a.key}
            type="button"
            className={`tab-btn ${abaAtiva === a.key ? 'active' : ''}`}
            onClick={() => setAbaAtiva(a.key)}
          >
            {a.label}
          </button>
        ))}
      </div>
      <div className="tab-content aux-tab-content">
        <AbaAuxiliar key={abaAtiva} config={configAtiva} abrirJanela={abrirJanela} />
      </div>
    </JanelaBase>
  );
}

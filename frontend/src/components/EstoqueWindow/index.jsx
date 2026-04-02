import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import ModalMovimento from './components/ModalMovimento.jsx';
import { useEstoqueData } from './hooks/useEstoqueData.js';
import './EstoqueWindow.css';

const ABAS = ['Posição de Estoque', 'Movimentos'];

const fmtData  = (v) => v ? new Date(v).toLocaleDateString('pt-BR') : '-';
const fmtMoeda = (v) => v != null ? Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-';
const fmtQtd   = (v) => v != null ? Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 3 }) : '-';

const BADGE_TIPO = { entrada: 'badge-aprovado', saida: 'badge-cancelado', ajuste: 'badge-pendente' };

export default function EstoqueWindow({ id, onClose, onMinimize }) {
  const [abaAtiva, setAbaAtiva] = useState('Posição de Estoque');
  const {
    posicao, movimentos, produtos, depositos,
    loadingPosicao, loadingMov,
    buscaPosicao, setBuscaP,
    filtrosMov, setFiltrosMov,
    modalMov, setModalMov,
    formMov, setFormMov,
    abrirModalMov, salvarMovimento,
  } = useEstoqueData();

  const posicaoFiltrada = posicao.filter(p =>
    !buscaPosicao || p.produto?.toLowerCase().includes(buscaPosicao.toLowerCase())
  );

  return (
    <JanelaBase id={id} titulo="Estoque" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={650}>
      <div className="tabs-header">
        {ABAS.map(aba => (
          <button key={aba} type="button" className={`tab-btn ${abaAtiva === aba ? 'active' : ''}`} onClick={() => setAbaAtiva(aba)}>
            {aba}
          </button>
        ))}
      </div>

      <div className="tab-content estoque-tab-content">
        {abaAtiva === 'Posição de Estoque' && (
          <div className="estoque-section">
            <div className="estoque-toolbar">
              <input
                className="campo-busca"
                placeholder="Buscar produto..."
                value={buscaPosicao}
                onChange={e => setBuscaP(e.target.value)}
              />
            </div>
            {loadingPosicao ? (
              <div className="estoque-loading">Carregando...</div>
            ) : (
              <div className="tabela-crud-container">
                <table className="tabela-crud">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Depósito</th>
                      <th>Qtd Atual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posicaoFiltrada.length === 0 && (
                      <tr><td colSpan={3} className="tabela-vazia">Nenhum item no estoque.</td></tr>
                    )}
                    {posicaoFiltrada.map((p, i) => (
                      <tr key={i}>
                        <td>{p.produto ?? '-'}</td>
                        <td>{p.deposito ?? '-'}</td>
                        <td>{fmtQtd(p.quantidade_atual)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'Movimentos' && (
          <div className="estoque-section">
            <div className="estoque-toolbar">
              <div className="estoque-filtros">
                <label>De:</label>
                <input type="date" value={filtrosMov.data_inicio} onChange={e => setFiltrosMov({ ...filtrosMov, data_inicio: e.target.value })} />
                <label>Até:</label>
                <input type="date" value={filtrosMov.data_fim} onChange={e => setFiltrosMov({ ...filtrosMov, data_fim: e.target.value })} />
                <label>Tipo:</label>
                <select value={filtrosMov.tipo} onChange={e => setFiltrosMov({ ...filtrosMov, tipo: e.target.value })}>
                  <option value="">Todos</option>
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                  <option value="ajuste">Ajuste</option>
                </select>
              </div>
              <button className="btn-adicionar" onClick={abrirModalMov}>+ Lançar Movimento</button>
            </div>

            {loadingMov ? (
              <div className="estoque-loading">Carregando...</div>
            ) : (
              <div className="tabela-crud-container">
                <table className="tabela-crud">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Produto</th>
                      <th>Tipo</th>
                      <th>Qtd</th>
                      <th>Custo Un.</th>
                      <th>Documento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimentos.length === 0 && (
                      <tr><td colSpan={6} className="tabela-vazia">Nenhum movimento encontrado.</td></tr>
                    )}
                    {movimentos.map((m, i) => (
                      <tr key={i}>
                        <td>{fmtData(m.data_movimento || m.created_at)}</td>
                        <td>{m.produto_nome || m.produto || '-'}</td>
                        <td>
                          <span className={`badge-status ${BADGE_TIPO[m.tipo] || ''}`}>
                            {m.tipo}
                          </span>
                        </td>
                        <td>{fmtQtd(m.quantidade)}</td>
                        <td>{fmtMoeda(m.custo_unitario)}</td>
                        <td>{m.documento_ref || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {modalMov && (
        <ModalMovimento
          form={formMov}
          setForm={setFormMov}
          produtos={produtos}
          depositos={depositos}
          onSalvar={salvarMovimento}
          onFechar={() => setModalMov(false)}
        />
      )}
    </JanelaBase>
  );
}

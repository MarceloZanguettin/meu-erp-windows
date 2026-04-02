import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import ModalOrcamento from './components/ModalOrcamento.jsx';
import ModalPedidoVenda from './components/ModalPedidoVenda.jsx';
import { useVendasData } from './hooks/useVendasData.js';
import './VendasWindow.css';

const ABAS = ['Orçamentos', 'Pedidos de Venda'];

const fmtData  = (v) => v ? new Date(v).toLocaleDateString('pt-BR') : '-';
const fmtMoeda = (v) => v != null ? Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-';

const BADGE_STATUS = {
  pendente:   'badge-pendente',
  aprovado:   'badge-aprovado',
  convertido: 'badge-faturado',
  faturado:   'badge-faturado',
  cancelado:  'badge-cancelado',
};

export default function VendasWindow({ id, onClose, onMinimize, abrirJanela }) {
  const [abaAtiva, setAbaAtiva] = useState('Orçamentos');
  const data = useVendasData();

  return (
    <JanelaBase id={id} titulo="Vendas" onClose={onClose} onMinimize={onMinimize} largura={1100} altura={660}>
      <div className="tabs-header">
        {ABAS.map(aba => (
          <button key={aba} type="button" className={`tab-btn ${abaAtiva === aba ? 'active' : ''}`} onClick={() => setAbaAtiva(aba)}>
            {aba}
          </button>
        ))}
      </div>

      <div className="tab-content vendas-tab-content">
        {abaAtiva === 'Orçamentos' && (
          <div className="vendas-section">
            <div className="vendas-toolbar">
              <span className="vendas-count">{data.orcamentos.length} orçamento(s)</span>
              <button className="btn-adicionar" onClick={() => abrirJanela('novoOrcamento', { onSalvar: data.carregarOrcamentos })}>+ Novo Orçamento</button>
            </div>
            {data.loadingOrc ? (
              <div className="vendas-loading">Carregando...</div>
            ) : (
              <div className="tabela-crud-container">
                <table className="tabela-crud">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Cliente</th>
                      <th>Data</th>
                      <th>Validade</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th style={{ width: 150 }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orcamentos.length === 0 && (
                      <tr><td colSpan={7} className="tabela-vazia">Nenhum orçamento cadastrado.</td></tr>
                    )}
                    {data.orcamentos.map(o => {
                      const total = o.total ?? o.itens?.reduce((s, i) => s + (i.quantidade || 0) * (i.preco_unitario || 0), 0);
                      return (
                        <tr key={o.id}>
                          <td>#{o.numero || o.id}</td>
                          <td>{o.nome_cliente || '-'}</td>
                          <td>{fmtData(o.data_orcamento || o.created_at)}</td>
                          <td>{fmtData(o.data_validade)}</td>
                          <td>{fmtMoeda(total)}</td>
                          <td>
                            <span className={`badge-status ${BADGE_STATUS[o.status] || 'badge-pendente'}`}>
                              {o.status || 'pendente'}
                            </span>
                          </td>
                          <td className="tabela-acoes">
                            {(!o.status || o.status === 'pendente') && (
                              <button className="btn-acao-ok" title="Aprovar" onClick={() => data.aprovarOrcHandler(o.id)}>✓</button>
                            )}
                            {(o.status === 'aprovado') && (
                              <button className="btn-acao-converter" title="Converter em Pedido" onClick={() => data.converterOrcHandler(o.id)}>⇒</button>
                            )}
                            <button className="btn-acao-edit" title="Editar" onClick={() => data.abrirEditarOrc(o)}>✎</button>
                            <button className="btn-acao-del"  title="Excluir" onClick={() => data.excluirOrcHandler(o.id)}>✕</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'Pedidos de Venda' && (
          <div className="vendas-section">
            <div className="vendas-toolbar">
              <span className="vendas-count">{data.pedidos.length} pedido(s)</span>
              <button className="btn-adicionar" onClick={() => abrirJanela('novoPedidoVenda', { onSalvar: data.carregarPedidos })}>+ Novo Pedido</button>
            </div>
            {data.loadingPed ? (
              <div className="vendas-loading">Carregando...</div>
            ) : (
              <div className="tabela-crud-container">
                <table className="tabela-crud">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Cliente</th>
                      <th>Data</th>
                      <th>Entrega</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th style={{ width: 120 }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pedidos.length === 0 && (
                      <tr><td colSpan={7} className="tabela-vazia">Nenhum pedido de venda cadastrado.</td></tr>
                    )}
                    {data.pedidos.map(p => {
                      const total = p.total ?? p.itens?.reduce((s, i) => s + (i.quantidade || 0) * (i.preco_unitario || 0), 0);
                      return (
                        <tr key={p.id}>
                          <td>#{p.numero || p.id}</td>
                          <td>{p.nome_cliente || '-'}</td>
                          <td>{fmtData(p.data_pedido || p.created_at)}</td>
                          <td>{fmtData(p.data_entrega_prevista)}</td>
                          <td>{fmtMoeda(total)}</td>
                          <td>
                            <span className={`badge-status ${BADGE_STATUS[p.status] || 'badge-pendente'}`}>
                              {p.status || 'pendente'}
                            </span>
                          </td>
                          <td className="tabela-acoes">
                            {(!p.status || p.status !== 'faturado') && (
                              <button className="btn-acao-ok" title="Faturar" onClick={() => data.faturarPedHandler(p.id)}>✓</button>
                            )}
                            <button className="btn-acao-edit" title="Editar" onClick={() => data.abrirEditarPed(p)}>✎</button>
                            <button className="btn-acao-del"  title="Excluir" onClick={() => data.excluirPedHandler(p.id)}>✕</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {data.modalOrc && (
        <ModalOrcamento
          editandoId={data.editandoOrcId}
          form={data.formOrc}
          setForm={data.setFormOrc}
          itens={data.itensOrc}
          setItens={data.setItensOrc}
          formasPag={data.formasPag}
          onSalvar={data.salvarOrcHandler}
          onFechar={() => data.setModalOrc(false)}
          ITEM_VAZIO={data.ITEM_VAZIO}
        />
      )}

      {data.modalPed && (
        <ModalPedidoVenda
          editandoId={data.editandoPedId}
          form={data.formPed}
          setForm={data.setFormPed}
          itens={data.itensPed}
          setItens={data.setItensPed}
          formasPag={data.formasPag}
          representantes={data.representantes}
          onSalvar={data.salvarPedHandler}
          onFechar={() => data.setModalPed(false)}
          ITEM_VAZIO={data.ITEM_VAZIO}
        />
      )}
    </JanelaBase>
  );
}

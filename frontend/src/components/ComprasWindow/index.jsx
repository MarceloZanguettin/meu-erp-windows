import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import ModalSolicitacao from './components/ModalSolicitacao.jsx';
import ModalPedidoCompra from './components/ModalPedidoCompra.jsx';
import { useComprasData } from './hooks/useComprasData.js';
import './ComprasWindow.css';

const ABAS = ['Solicitações', 'Pedidos de Compra'];

const fmtData  = (v) => v ? new Date(v).toLocaleDateString('pt-BR') : '-';
const fmtMoeda = (v) => v != null ? Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-';

const BADGE_STATUS = {
  pendente:  'badge-pendente',
  aprovada:  'badge-aprovado',
  aprovado:  'badge-aprovado',
  cancelado: 'badge-cancelado',
  cancelada: 'badge-cancelado',
  recebido:  'badge-recebido',
};

export default function ComprasWindow({ id, onClose, onMinimize, abrirJanela }) {
  const [abaAtiva, setAbaAtiva] = useState('Solicitações');
  const data = useComprasData();

  return (
    <JanelaBase id={id} titulo="Compras" onClose={onClose} onMinimize={onMinimize} largura={1100} altura={660}>
      <div className="tabs-header">
        {ABAS.map(aba => (
          <button key={aba} type="button" className={`tab-btn ${abaAtiva === aba ? 'active' : ''}`} onClick={() => setAbaAtiva(aba)}>
            {aba}
          </button>
        ))}
      </div>

      <div className="tab-content compras-tab-content">
        {abaAtiva === 'Solicitações' && (
          <div className="compras-section">
            <div className="compras-toolbar">
              <span className="compras-count">{data.solicitacoes.length} solicitação(ões)</span>
              <button className="btn-adicionar" onClick={() => abrirJanela('novaSolicitacaoCompra', { onSalvar: data.carregarSolicitacoes })}>+ Nova Solicitação</button>
            </div>
            {data.loadingSolic ? (
              <div className="compras-loading">Carregando...</div>
            ) : (
              <div className="tabela-crud-container">
                <table className="tabela-crud">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Data</th>
                      <th>Solicitante</th>
                      <th>Itens</th>
                      <th>Status</th>
                      <th style={{ width: 120 }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.solicitacoes.length === 0 && (
                      <tr><td colSpan={6} className="tabela-vazia">Nenhuma solicitação cadastrada.</td></tr>
                    )}
                    {data.solicitacoes.map(s => (
                      <tr key={s.id}>
                        <td>#{s.numero || s.id}</td>
                        <td>{fmtData(s.data_solicitacao || s.created_at)}</td>
                        <td>{s.solicitante || '-'}</td>
                        <td>{s.itens?.length ?? 0} item(s)</td>
                        <td>
                          <span className={`badge-status ${BADGE_STATUS[s.status] || 'badge-pendente'}`}>
                            {s.status || 'pendente'}
                          </span>
                        </td>
                        <td className="tabela-acoes">
                          {(!s.status || s.status === 'pendente') && (
                            <button className="btn-acao-ok" title="Aprovar" onClick={() => data.aprovarSolicHandler(s.id)}>✓</button>
                          )}
                          <button className="btn-acao-edit" title="Editar" onClick={() => data.abrirEditarSolic(s)}>✎</button>
                          <button className="btn-acao-del"  title="Excluir" onClick={() => data.excluirSolicHandler(s.id)}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'Pedidos de Compra' && (
          <div className="compras-section">
            <div className="compras-toolbar">
              <span className="compras-count">{data.pedidos.length} pedido(s)</span>
              <button className="btn-adicionar" onClick={() => abrirJanela('novoPedidoCompra', { onSalvar: data.carregarPedidos })}>+ Novo Pedido</button>
            </div>
            {data.loadingPedidos ? (
              <div className="compras-loading">Carregando...</div>
            ) : (
              <div className="tabela-crud-container">
                <table className="tabela-crud">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Fornecedor</th>
                      <th>Data</th>
                      <th>Entrega Prevista</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th style={{ width: 130 }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pedidos.length === 0 && (
                      <tr><td colSpan={7} className="tabela-vazia">Nenhum pedido de compra cadastrado.</td></tr>
                    )}
                    {data.pedidos.map(p => {
                      const total = p.itens?.reduce((s, i) => s + (i.quantidade || 0) * (i.preco_unitario || 0), 0) ?? p.total;
                      const fornNome = data.fornecedores.find(f => f.id === p.fornecedor_id)?.nome || p.fornecedor_nome || '-';
                      return (
                        <tr key={p.id}>
                          <td>#{p.numero || p.id}</td>
                          <td>{fornNome}</td>
                          <td>{fmtData(p.data_pedido || p.created_at)}</td>
                          <td>{fmtData(p.data_entrega_prevista)}</td>
                          <td>{fmtMoeda(total)}</td>
                          <td>
                            <span className={`badge-status ${BADGE_STATUS[p.status] || 'badge-pendente'}`}>
                              {p.status || 'pendente'}
                            </span>
                          </td>
                          <td className="tabela-acoes">
                            {(!p.status || p.status === 'aprovado' || p.status === 'pendente') && (
                              <button className="btn-acao-ok" title="Marcar como Recebido" onClick={() => data.receberPedidoHandler(p.id)}>✓</button>
                            )}
                            <button className="btn-acao-edit" title="Editar" onClick={() => data.abrirEditarPedido(p)}>✎</button>
                            <button className="btn-acao-del"  title="Excluir" onClick={() => data.excluirPedidoHandler(p.id)}>✕</button>
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

      {data.modalSolic && (
        <ModalSolicitacao
          editandoId={data.editandoSolicId}
          form={data.formSolic}
          setForm={data.setFormSolic}
          itens={data.itensSolic}
          setItens={data.setItensSolic}
          onSalvar={data.salvarSolicHandler}
          onFechar={() => data.setModalSolic(false)}
          ITEM_VAZIO={data.ITEM_VAZIO}
        />
      )}

      {data.modalPedido && (
        <ModalPedidoCompra
          editandoId={data.editandoPedidoId}
          form={data.formPedido}
          setForm={data.setFormPedido}
          itens={data.itensPedido}
          setItens={data.setItensPedido}
          fornecedores={data.fornecedores}
          formasPag={data.formasPag}
          onSalvar={data.salvarPedidoHandler}
          onFechar={() => data.setModalPedido(false)}
          ITEM_PEDIDO_VAZIO={data.ITEM_PEDIDO_VAZIO}
        />
      )}
    </JanelaBase>
  );
}

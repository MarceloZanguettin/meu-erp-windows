import React from 'react';
import { useFluxoConta } from '../hooks/useFluxoConta';
import ModalContaFluxo  from '../components/ModalContaFluxo';

const fmtData  = (iso) => iso ? new Date(iso).toLocaleDateString('pt-BR') : '-';
const fmtValor = (v)   => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const CONFIG = {
  pagar: {
    tituloClass:  'fluxo-empresa-titulo pagar',
    rowPago:      'fluxo-row-pago',
    rowPendente:  'fluxo-row-pend-pagar',
    badgePago:    'badge-pago',
    badgePendente:'badge-pend-pagar',
    labelPago:    'Pago',
  },
  receber: {
    tituloClass:  'fluxo-empresa-titulo',
    rowPago:      'fluxo-row-ok',
    rowPendente:  '',
    badgePago:    'badge-ok',
    badgePendente:'badge-pend',
    labelPago:    'Recebido',
  },
};

/**
 * Aba genérica para Contas a Pagar e Contas a Receber.
 * @param {'pagar'|'receber'} tipo
 * @param {object[]} empresas
 */
export default function AbaFluxo({ tipo, empresas }) {
  const cfg = CONFIG[tipo];
  const {
    contas, modal, editando, form, setForm,
    abrirAdicionar, abrirEditar, salvar, baixar, excluir, fecharModal,
  } = useFluxoConta(tipo, empresas);

  const contasDaEmpresa = (id) => contas.filter(c => c.empresa_id === id);
  const totalPendente   = (id) =>
    contasDaEmpresa(id).filter(c => c.status === 'pendente').reduce((s, c) => s + c.valor, 0);

  return (
    <div className="fluxo-aba">
      <div className="fluxo-aba-toolbar">
        <button className="fluxo-btn-add" onClick={abrirAdicionar}>+ Adicionar</button>
      </div>

      <div className="fluxo-tabelas-lado">
        {empresas.map(emp => (
          <div key={emp.id} className="fluxo-empresa-col">
            <div className={cfg.tituloClass}>{emp.nome}</div>
            <table className="fluxo-table">
              <thead>
                <tr>
                  <th>Descrição</th><th>Valor</th><th>Vencimento</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {contasDaEmpresa(emp.id).length === 0 && (
                  <tr><td colSpan={5} className="fluxo-vazio">Nenhum lançamento</td></tr>
                )}
                {contasDaEmpresa(emp.id).map(c => {
                  const pago = c.status !== 'pendente';
                  return (
                    <tr key={c.id} className={pago ? cfg.rowPago : cfg.rowPendente}>
                      <td>{c.descricao}</td>
                      <td>{fmtValor(c.valor)}</td>
                      <td>{fmtData(c.data_vencimento)}</td>
                      <td>
                        <span className={`fluxo-badge ${pago ? cfg.badgePago : cfg.badgePendente}`}>
                          {pago ? cfg.labelPago : 'Pendente'}
                        </span>
                      </td>
                      <td className="fluxo-acoes">
                        {!pago && (
                          <button className="fluxo-btn-acao ok" title={`Marcar como ${cfg.labelPago.toLowerCase()}`} onClick={() => baixar(c.id)}>✓</button>
                        )}
                        <button className="fluxo-btn-acao edit" title="Editar"  onClick={() => abrirEditar(c)}>✎</button>
                        <button className="fluxo-btn-acao del"  title="Excluir" onClick={() => excluir(c.id)}>✕</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="fluxo-total">
              Pendente: <strong>{fmtValor(totalPendente(emp.id))}</strong>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <ModalContaFluxo
          tipo={tipo}
          editando={editando}
          form={form}
          setForm={setForm}
          empresas={empresas}
          onSalvar={salvar}
          onFechar={fecharModal}
        />
      )}
    </div>
  );
}

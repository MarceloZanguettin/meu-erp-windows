import React from 'react';
import { fmt } from '../utils/formatters';

/**
 * Cabeçalho fixo de uma empresa, exibido acima da tabela.
 * Mostra totais de pendente/recebido/pago e botões para adicionar lançamentos.
 *
 * @param {{
 *   empresa:       object,
 *   contasPagar:   object[],
 *   contasReceber: object[],
 *   onAdicionar:   (tipo: 'pagar'|'receber', empresaId: number) => void
 * }} props
 */
export default function PainelEmpresaHeader({ empresa, contasPagar, contasReceber, onAdicionar }) {
  const pagar   = contasPagar.filter(c => c.empresa_id === empresa.id);
  const receber = contasReceber.filter(c => c.empresa_id === empresa.id);

  const totRecPend = receber.filter(c => c.status === 'pendente').reduce((s, c) => s + c.valor, 0);
  const totRecRec  = receber.filter(c => c.status === 'recebido').reduce((s, c) => s + c.valor, 0);
  const totPagPend = pagar.filter(c => c.status === 'pendente').reduce((s, c) => s + c.valor, 0);
  const totPagPago = pagar.filter(c => c.status === 'pago').reduce((s, c) => s + c.valor, 0);

  return (
    <div className="fagrup-empresa-bloco">
      <div className="fagrup-painel-header">
        <span className="fagrup-painel-titulo fagrup-empresa-nome">{empresa.nome}</span>
        <div className="fagrup-painel-btns">
          <button
            className="fagrup-btn-add btn-receber"
            onClick={() => onAdicionar('receber', empresa.id)}
          >
            + Receber
          </button>
          <button
            className="fagrup-btn-add btn-pagar"
            onClick={() => onAdicionar('pagar', empresa.id)}
          >
            + Pagar
          </button>
        </div>
      </div>

      <div className="fagrup-totais">
        <span className="fagrup-total-item receber-pend">
          A receber: <strong>{fmt(totRecPend)}</strong>
        </span>
        <span className="fagrup-total-sep">|</span>
        <span className="fagrup-total-item recebido">
          Recebido: <strong>{fmt(totRecRec)}</strong>
        </span>
        <span className="fagrup-total-sep">|</span>
        <span className="fagrup-total-item pagar-pend">
          A pagar: <strong>{fmt(totPagPend)}</strong>
        </span>
        <span className="fagrup-total-sep">|</span>
        <span className="fagrup-total-item pago">
          Pago: <strong>{fmt(totPagPago)}</strong>
        </span>
      </div>
    </div>
  );
}

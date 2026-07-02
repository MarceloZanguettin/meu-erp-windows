import React from 'react';
import { isAtrasado } from '../utils/lancamentoUtils';

/**
 * Exibe o badge de status de um lançamento:
 * - "Atrasado"    (vermelho)  pendente + vencimento no passado
 * - "Postergado"  (laranja)   pendente + vencimento futuro + flag postergado
 * - "pago" / "recebido"       (verde)  quando quitado
 * - "pendente"                (amarelo) dentro do prazo
 *
 * @param {{ conta: object }} props
 */
export default function BadgeStatus({ conta }) {
  if (isAtrasado(conta)) {
    return <span className="fagrup-badge badge-atrasado">Atrasado</span>;
  }

  if (conta.postergado && conta.status === 'pendente') {
    return <span className="fagrup-badge badge-postergado">Postergado</span>;
  }

  const statusOk = conta._tipo === 'R' ? 'recebido' : 'pago';
  const classeOk = conta.status === statusOk ? 'badge-ok' : 'badge-pend';

  return (
    <span className={`fagrup-badge ${classeOk}`}>
      {conta.status}
    </span>
  );
}

import React from 'react';
import { isAtrasado } from '../utils/lancamentoUtils';

/**
 * Exibe o badge de status de um lançamento:
 * - "Atrasado" (vermelho)  quando está pendente e com vencimento no passado
 * - "pago" / "recebido"   quando quitado (verde)
 * - "pendente"             quando ainda dentro do prazo (amarelo)
 *
 * @param {{ conta: object }} props
 */
export default function BadgeStatus({ conta }) {
  if (isAtrasado(conta)) {
    return <span className="fagrup-badge badge-atrasado">Atrasado</span>;
  }

  const statusOk = conta._tipo === 'R' ? 'recebido' : 'pago';
  const classeOk = conta.status === statusOk ? 'badge-ok' : 'badge-pend';

  return (
    <span className={`fagrup-badge ${classeOk}`}>
      {conta.status}
    </span>
  );
}

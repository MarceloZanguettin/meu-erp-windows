import { CAMPOS_INTEIROS } from '../constants.js';

/**
 * Normaliza o form antes de enviar ao backend:
 * - remove campos vazios ('' / undefined), deixando o backend usar o default
 *   (None) do schema Pydantic — evita erro de validação em campos
 *   Optional[int] com string vazia;
 * - converte campos numéricos (Integer no model) de string para Number.
 *
 * Usado tanto pelo hook useCrud (lista/edição em MovimentoFixoWindow) quanto
 * pela janela de criação NovoMovimentoFixoWindow.
 */
export function normalizarMovimentoFixo(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_INTEIROS) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

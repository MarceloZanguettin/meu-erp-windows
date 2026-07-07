import { CAMPOS_INTEIROS, CAMPOS_FLOAT } from '../constants.js';

/**
 * Normaliza o form antes de enviar ao backend:
 * - remove campos vazios ('' / undefined), deixando o backend usar o default
 *   (None) do schema Pydantic — evita erro de validação em campos
 *   Optional[int]/Optional[float] com string vazia;
 * - converte campos inteiros/decimais de string para Number.
 *
 * Usado tanto pelo hook useCrud (lista/edição em ContaGenusWindow) quanto
 * pela janela de criação NovoContaGenusWindow.
 */
export function normalizarContaGenus(form) {
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
  for (const campo of CAMPOS_FLOAT) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

import { CAMPOS_INTEIROS, CAMPOS_FLOAT } from '../constants.js';

/**
 * Normaliza o form antes de enviar ao backend:
 * - remove campos vazios ('' / undefined), deixando o backend usar o default
 *   (None) do schema Pydantic — evita erro de validação em campos
 *   Optional[int]/Optional[float] com string vazia;
 * - converte campos numéricos (Integer/Float no model) de string para Number.
 *
 * Usado tanto pelo hook useCrud (lista/edição em CentroCustoWindow) quanto
 * pela janela de criação NovoCentroCustoWindow.
 */
export function normalizarCentroCusto(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of [...CAMPOS_INTEIROS, ...CAMPOS_FLOAT]) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

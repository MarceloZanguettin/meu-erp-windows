// Estado vazio do formulário de Movimento Fixo (GENUS.MOVTOFIXO) — usado tanto
// pela janela de listagem/edição (MovimentoFixoWindow) quanto pela janela de
// criação (NovoMovimentoFixoWindow), para os dois ficarem sempre em
// sincronia com o schema do backend.
//
// No GENUS, MOVTOFIXO controla a geração/baixa de um título fixo/recorrente
// (mensalidade, despesa fixa etc.) para uma competência MES/ANO específica —
// ver docstring do model MovimentoFixo em backend/models/tabelas.py.
export const FORM_VAZIO = {
  codigo: '',
  mes: '',
  ano: '',
  cod_fixo_pagar: '',
  cod_fixo_receber: '',
};

// Campos numéricos (Integer no model) — usados pelo service para converter os
// valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = ['codigo', 'cod_fixo_pagar', 'cod_fixo_receber'];

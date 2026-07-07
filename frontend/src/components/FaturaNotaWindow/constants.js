// Estado vazio do formulário de Vínculo Fatura-Nota Fiscal (GENUS.FATURANOTA) —
// usado tanto pela janela de listagem/edição (FaturaNotaWindow) quanto pela
// janela de criação (NovoFaturaNotaWindow), para os dois ficarem sempre em
// sincronia com o schema do backend.
//
// No GENUS, FATURANOTA é a tabela de vínculo (N:N) entre FATURA (o
// agrupamento de título(s) a receber num boleto/fatura só — ainda não
// modelada neste ERP) e SAIDA (nota fiscal de saída, já reconhecida neste
// ERP) — ver docstring do model FaturaNota em backend/models/tabelas.py.
export const FORM_VAZIO = {
  saida_id: '',
  cod_empresa: '',
  cod_fatura: '',
  cod_saida: '',
};

// Campos numéricos (Integer no model) — usados pelo service para converter os
// valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = ['saida_id', 'cod_empresa', 'cod_fatura', 'cod_saida'];

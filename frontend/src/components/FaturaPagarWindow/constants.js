// Estado vazio do formulário de FaturaPagar (GENUS.FATURAPAGAR) — usado
// tanto pela janela de listagem/edição (FaturaPagarWindow) quanto pela
// janela de criação (NovoFaturaPagarWindow), para os dois ficarem sempre em
// sincronia com o schema do backend.
//
// No GENUS, FATURAPAGAR é o análogo, no lado de contas a pagar, de
// FATURA (já reconhecida neste ERP como `Fatura`): o cabeçalho do
// agrupamento de título(s)/nota(s) fiscal(is) de compra (entrada)
// faturados para um fornecedor num único boleto/pagamento — CODCONDPAGTO é
// a condição de pagamento acordada, CODCADASTRO é o fornecedor/credor,
// CODCARTEIRA é a carteira usada, DOC é o número do documento/boleto e
// DATABASE é a data-base usada para calcular vencimento/desconto do boleto
// agrupado. É a tabela referenciada por FATURANOTAPAGAR.CODFATURAPAGAR (ver
// model FaturaNotaPagar e a janela "Vínculo Fatura-Nota Pagar (GENUS)") para
// saber quais títulos/notas de entrada compõem cada fatura a pagar.
export const FORM_VAZIO = {
  cod_empresa: '',
  codigo: '',
  doc: '',
  emissao: '',
  cod_cond_pagto: '',
  cod_cadastro: '',
  cod_carteira: '',
  data_base: '',
  obs: '',
};

// Campos numéricos inteiros (Integer no model) — usados pelo service para
// converter os valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = ['cod_empresa', 'codigo', 'doc', 'cod_cadastro', 'cod_carteira'];

// Estado vazio do formulário de Fatura (GENUS.FATURA) — usado tanto pela
// janela de listagem/edição (FaturaWindow) quanto pela janela de criação
// (NovoFaturaWindow), para os dois ficarem sempre em sincronia com o schema
// do backend.
//
// No GENUS, FATURA é o cabeçalho do agrupamento de título(s)/nota(s)
// fiscal(is) de saída faturados para um cliente, no lado de contas a
// receber — CODCONDPAGTO é a condição de pagamento acordada, CODCADASTRO é
// o sacado/cliente e CODCARTEIRA é a carteira de cobrança usada. É a tabela
// referenciada por FATURANOTA.CODFATURA (ver model FaturaNota e a janela
// "Vínculo Fatura-Nota Fiscal (GENUS)") para saber quais notas fiscais de
// saída compõem cada fatura.
export const FORM_VAZIO = {
  cod_empresa: '',
  codigo: '',
  emissao: '',
  cod_cond_pagto: '',
  cod_cadastro: '',
  cod_carteira: '',
};

// Campos numéricos inteiros (Integer no model) — usados pelo service para
// converter os valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = ['cod_empresa', 'codigo', 'cod_cadastro', 'cod_carteira'];

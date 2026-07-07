// Estado vazio do formulário de Carteira de Cobrança (GENUS.CARTEIRA) — usado
// tanto pela janela de listagem/edição (CarteiraWindow) quanto pela janela de
// criação (NovoCarteiraWindow), para os dois ficarem sempre em sincronia com o
// schema do backend.
//
// GENUS.CARTEIRA é a tabela mestre de carteiras de cobrança bancária (lista
// fixa de carteiras, sem coluna CODEMPRESA — compartilhada por todas as
// empresas), referenciada como CODCARTEIRA (código bruto) por diversas outras
// tabelas GENUS já reconhecidas neste ERP (ContaReceber, ContaPagar,
// FaturaPagar, BcoSicred etc.). Ver docstring do model Carteira em
// backend/models/tabelas.py para o detalhe completo.
export const FORM_VAZIO = {
  codigo: '',
  descricao: '',
  descontada: '',
  float_pagto: '',
};

// Campos numéricos inteiros (Integer no model) — usados pelo service para
// converter os valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = ['codigo', 'float_pagto'];

// Campos numéricos decimais (Float no model) — CARTEIRA não tem nenhum campo
// monetário/decimal (FLOATPAGTO é INTEGER puro, confirmado ao vivo contra a
// metadata Firebird — ver docstring do model Carteira).
export const CAMPOS_FLOAT = [];

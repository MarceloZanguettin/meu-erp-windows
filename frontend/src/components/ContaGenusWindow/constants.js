// Estado vazio do formulário de Conta (GENUS.CONTAS) — usado tanto pela
// janela de listagem/edição (ContaGenusWindow) quanto pela janela de
// criação (NovoContaGenusWindow), para os dois ficarem sempre em sincronia
// com o schema do backend.
//
// No GENUS, CONTAS é o cadastro mestre de conta bancária/caixa (não
// confundir com `ContaBancaria`, o cadastro de conta bancária próprio
// deste ERP) — código do banco, agência, número da conta, titular e
// situação. É referenciado como CODCONTAS (código bruto) por várias outras
// tabelas GENUS já reconhecidas neste ERP (ver docstring do model
// ContaGenus em backend/models/tabelas.py).
export const FORM_VAZIO = {
  codigo: '',
  cod_empresa: '',
  descricao: '',
  banco: '',
  agencia: '',
  conta: '',
  cidade: '',
  titular: '',
  permissao: '',
  situacao: '',
};

// Campos numéricos inteiros (Integer no model) — usados pelo service para
// converter os valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = ['codigo', 'cod_empresa'];

// CONTAS não tem campos decimais (Float) no GENUS.
export const CAMPOS_FLOAT = [];

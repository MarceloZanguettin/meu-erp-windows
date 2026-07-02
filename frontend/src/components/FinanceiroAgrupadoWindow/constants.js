// Dias para trás cobertos na carga inicial (cobre ~6 anos de histórico)
export const INIT_DAYS_PAST   = 2200;
// Dias para frente cobertos na carga inicial
export const INIT_DAYS_FUTURE = 30;

// Dias buscados a cada expansão pelo scroll infinito
export const LOAD_DAYS = 60;

// Mantido por compatibilidade — não usado diretamente pelo scroll
export const INIT_DAYS = 60;

// Distância do topo/fim do scroll que dispara o carregamento
export const SCROLL_THRESHOLD_PX = 300;

// Formulário vazio para criação/edição de lançamentos
export const FORM_VAZIO = {
  empresa_id:        '',
  conta_bancaria_id: '',
  descricao:         '',
  valor:             '',
  data_vencimento:   '',
  observacao:        '',
};

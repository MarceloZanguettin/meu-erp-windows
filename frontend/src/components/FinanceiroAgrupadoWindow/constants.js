// Dias exibidos ao redor do dia atual na abertura da janela
export const INIT_DAYS = 3;

// Dias buscados a cada expansão pelo scroll infinito
export const LOAD_DAYS = 7;

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

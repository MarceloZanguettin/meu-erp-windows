import { useState, useCallback } from 'react';

const FORM_INICIAL = {
  // Identificação
  codigo:            '',
  nome:              '',
  descricao:         '',
  // Dados
  codigoInterno:     '',
  codigoFornecedor:  '',
  grupo:             '',
  subgrupo:          '',
  categoria:         '',
  // Fiscal
  ncm:               '',
  csosn:             '',
  cst:               '',
  cfopDentro:        '',
  cfopFora:          '',
  // Pesos
  unidadeCompra:     '',
  unidadeVenda:      '',
  pesoBruto:         '',
  pesoLiquido:       '',
  // Preço / Estoque
  estoque:           '',
  preco:             '',
  custo:             '',
  margemLucro:       '',
  precoMinimo:       '',
  precoAtacado:      '',
};

/**
 * Hook Controller — centraliza o estado do formulário de produto.
 *
 * Substitui os 15+ useState espalhados no ProductWindow por um único objeto,
 * expondo um setter genérico `setField(campo, valor)`.
 */
export function useProdutoForm() {
  const [form, setFormState] = useState(FORM_INICIAL);

  const setField = useCallback((campo, valor) => {
    setFormState(prev => ({ ...prev, [campo]: valor }));
  }, []);

  const resetForm = useCallback(() => setFormState(FORM_INICIAL), []);

  return { form, setField, resetForm };
}

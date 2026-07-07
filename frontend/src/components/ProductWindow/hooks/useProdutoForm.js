import { useState, useCallback } from 'react';

const FORM_INICIAL = {
  // Identificação
  codigo:            '',
  nome:              '',
  codigo_interno:    '',
  codigo_fornecedor: '',
  cod_grupo:         '',
  cod_subgrupo:      '',
  categoria:         '',
  situacao:          'A',
  // Fiscal
  ncm:               '',
  csosn:             '',
  cst:               '',
  cfop_dentro_estado: '',
  cfop_fora_estado:   '',
  // Pesos
  unidade_compra:    '',
  unidade_venda:     '',
  peso_bruto:        '',
  peso_liquido:      '',
  // Preço / Estoque
  estoque:           '',
  preco:             '',
  custo:             '',
  margem_lucro:      '',
  preco_minimo:      '',
  preco_atacado:     '',
};

/**
 * Hook Controller — centraliza o estado do formulário de produto.
 *
 * Substitui os 15+ useState espalhados no ProductWindow por um único objeto,
 * expondo um setter genérico `setField(campo, valor)`.
 */
export function useProdutoForm() {
  const [form, setFormState] = useState(FORM_INICIAL);
  const [produtoId, setProdutoId] = useState(null);

  const setField = useCallback((campo, valor) => {
    setFormState(prev => ({ ...prev, [campo]: valor }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState(FORM_INICIAL);
    setProdutoId(null);
  }, []);

  // Carrega um produto já cadastrado (vindo da busca) no formulário, para edição.
  const carregarProduto = useCallback((produto) => {
    const carregado = { ...FORM_INICIAL };
    for (const campo of Object.keys(FORM_INICIAL)) {
      const valor = produto[campo];
      carregado[campo] = valor === null || valor === undefined ? '' : valor;
    }
    setFormState(carregado);
    setProdutoId(produto.id);
  }, []);

  return { form, setField, resetForm, produtoId, carregarProduto };
}

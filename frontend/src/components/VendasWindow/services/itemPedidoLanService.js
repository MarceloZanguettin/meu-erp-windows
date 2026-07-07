const API = 'http://localhost:8050';

// Campos GENUS.PEDIDOLAN do tipo inteiro/decimal — precisam virar Number antes de enviar
const NUMERICOS = [
  'pedido_id', 'produto_id', 'cod_empresa', 'cod_pedido',
  'qtde', 'qtde_embal', 'qtde_controle', 'qtde_fisico', 'qtde_faturado', 'fat_parcial_qtde_fisico',
  'diferenca', 'unitario', 'total', 'custo_atual', 'desconto', 'per_desconto', 'frete', 'outras',
  'comissao_item', 'fechado',
  'icms', 'icms_base', 'icms_valor', 'icms_outras', 'icms_isento', 'reducao_icms', 'iva',
  'icmsst', 'reducao_icmsst', 'icms_base_subst', 'icms_valor_subst', 'icms_fcp',
  'ipi', 'ipi_valor', 'ipi_base_calculo',
  'pis_valor', 'pis_base', 'pis_aliquota', 'quantidade_pis', 'aliq_pis_reais',
  'cofins_valor', 'cofins_base', 'cofins_aliquota', 'quantidade_cofins', 'aliq_cofins_reais',
  'cod_romaneio', 'cod_tipo_estampa', 'cod_decreto',
];

function normalizar(dados) {
  const out = { ...dados };
  for (const campo of NUMERICOS) {
    if (out[campo] === '' || out[campo] === undefined || out[campo] === null) {
      delete out[campo];
    } else {
      out[campo] = Number(out[campo]);
    }
  }
  for (const campo of Object.keys(out)) {
    if (out[campo] === '') delete out[campo];
  }
  return out;
}

async function tratarErro(r) {
  const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
  throw new Error(err.detail || 'Erro ao salvar item de pedido de venda (GENUS)');
}

export async function listarItensPedidoLan(pedidoId) {
  const r = await fetch(`${API}/itens-pedido-lan?pedido_id=${encodeURIComponent(pedidoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarItemPedidoLan(dados) {
  const r = await fetch(`${API}/itens-pedido-lan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarItemPedidoLan(id, dados) {
  const r = await fetch(`${API}/itens-pedido-lan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarItemPedidoLan(id) {
  const r = await fetch(`${API}/itens-pedido-lan/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

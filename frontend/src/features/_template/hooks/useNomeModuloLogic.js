/**
 * Hook de lógica — use[NomeModulo]Logic.js
 *
 * Regras:
 *  - TODA lógica de estado e efeitos fica aqui (nunca no componente)
 *  - useQuery para leitura de dados (com cache automático)
 *  - useMutation para criação/edição/exclusão
 *  - useQueryClient para invalidar cache após mutações
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchItens, criarItem, editarItem, excluirItem } from '../services/nomeModuloService';

// Chave de cache do TanStack Query — use array para permitir filtragem/invalidação granular
const QUERY_KEY = ['nomeModulo'];

export function useNomeModuloLogic() {
  const queryClient = useQueryClient();

  // ── Leitura (GET) ────────────────────────────────────────────────────────
  const { data: itens = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn:  fetchItens,
  });

  // ── Criação (POST) ────────────────────────────────────────────────────────
  const { mutateAsync: criar, isPending: criando } = useMutation({
    mutationFn: criarItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  // ── Edição (PUT) ──────────────────────────────────────────────────────────
  const { mutateAsync: editar } = useMutation({
    mutationFn: ({ id, dados }) => editarItem(id, dados),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  // ── Exclusão (DELETE) ─────────────────────────────────────────────────────
  const { mutateAsync: excluir } = useMutation({
    mutationFn: excluirItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return { itens, isLoading, criar, criando, editar, excluir };
}

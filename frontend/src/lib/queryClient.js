/**
 * TanStack Query — QueryClient global
 *
 * USO em main.jsx:
 *   import { QueryClientProvider } from '@tanstack/react-query';
 *   import { queryClient } from '@/lib/queryClient';
 *   <QueryClientProvider client={queryClient}><App /></QueryClientProvider>
 *
 * USO em hooks:
 *   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 *   const { data, isLoading } = useQuery({ queryKey: ['clientes'], queryFn: fetchClientes });
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:    1000 * 60 * 5,  // cache válido por 5 min
      gcTime:       1000 * 60 * 10, // garbage collect após 10 min
      retry:        1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (err) => console.error('[QueryClient]', err),
    },
  },
});

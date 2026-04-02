/**
 * Schema de validação — Zod
 * Usado com React Hook Form via zodResolver.
 *
 * USO no componente de formulário:
 *   import { zodResolver } from '@hookform/resolvers/zod';
 *   import { nomeModuloSchema } from '../schemas/nomeModuloSchema';
 *   const form = useForm({ resolver: zodResolver(nomeModuloSchema) });
 */
import { z } from 'zod';

export const nomeModuloSchema = z.object({
  nome: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),

  descricao: z
    .string()
    .max(500, 'Descrição muito longa')
    .optional(),

  ativo: z.boolean().default(true),

  // Exemplo de campo numérico
  valor: z
    .number({ invalid_type_error: 'Informe um valor numérico' })
    .positive('Valor deve ser positivo')
    .optional(),
});

// Tipo TypeScript inferido (use em projetos TS)
// export type NomeModuloForm = z.infer<typeof nomeModuloSchema>;

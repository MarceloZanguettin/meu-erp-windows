/**
 * TEMPLATE DE FEATURE — copie esta pasta inteira ao criar uma nova janela/módulo.
 * Renomeie _template → NomeDoModulo e substitua "Template" por "NomeDoModulo".
 *
 * Estrutura obrigatória para novas features:
 *
 *   features/NomeModulo/
 *   ├── index.js                        ← barrel export (este arquivo)
 *   ├── NomeModuloWindow.jsx            ← orquestrador (só layout, sem lógica)
 *   ├── hooks/
 *   │   └── useNomeModuloLogic.js       ← TODA lógica de estado, query, mutation
 *   ├── services/
 *   │   └── nomeModuloService.js        ← chamadas fetch/axios puras
 *   ├── components/
 *   │   ├── atoms/                      ← componentes sem estado
 *   │   │   └── CampoTexto.jsx
 *   │   ├── molecules/                  ← composição de átomos
 *   │   │   └── FormNomeModulo.jsx      ← React Hook Form aqui
 *   │   └── NovoNomeModuloWindow.jsx    ← janela de novo registro (JanelaBase)
 *   └── schemas/
 *       └── nomeModuloSchema.js         ← validação Zod
 */

// Exportação nomeada do componente principal
export { default as NomeModuloWindow } from './NomeModuloWindow.jsx';

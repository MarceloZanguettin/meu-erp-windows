/**
 * Store global de UI — Zustand
 *
 * Centraliza estado de interface que precisa ser compartilhado
 * entre janelas independentes (ex: notificações, tema, usuário logado).
 *
 * USO:
 *   import { useUiStore } from '@/store/uiStore';
 *   const { notificacoes, addNotificacao } = useUiStore();
 */
import { create } from 'zustand';

export const useUiStore = create((set) => ({
  // Notificações toast
  notificacoes: [],
  addNotificacao: (msg, tipo = 'success') =>
    set((s) => ({
      notificacoes: [...s.notificacoes, { id: Date.now(), msg, tipo }],
    })),
  removeNotificacao: (id) =>
    set((s) => ({ notificacoes: s.notificacoes.filter((n) => n.id !== id) })),

  // Usuário autenticado (complementa o useState local do App.jsx para acesso global)
  usuario: null,
  setUsuario: (u) => set({ usuario: u }),
}));

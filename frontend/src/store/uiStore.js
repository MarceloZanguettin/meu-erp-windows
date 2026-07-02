/**
 * Store global de UI — Zustand + persist
 *
 * Centraliza estado de interface compartilhado entre janelas:
 *  - notificações toast
 *  - usuário autenticado
 *  - tema visual do sistema (persiste no localStorage)
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Tema padrão (Clássico ERP) ────────────────────────────────────────────────
export const TEMA_PADRAO = {
  id: 'classicoErp',
  primary:      '#2c3e50',
  primaryDark:  '#1a252f',
  primaryText:  '#ffffff',
  accent:       '#2563eb',
  accentDark:   '#1d4ed8',
  bg:           '#f9f9f9',
  surface:      '#ffffff',
  border:       '#cbd5e1',
  borderLight:  '#e2e8f0',
  text:         '#213547',
  textMuted:    '#64748b',
  fontFamily:   'system-ui, -apple-system, sans-serif',
  fontSize:     '13px',
  hojeBg:       '#fefce8',
  hojeBorder:   '#ca8a04',
  hojeHover:    '#fef9c3',
};

// ── Aplica variáveis CSS no :root ─────────────────────────────────────────────
export function aplicarTema(tema) {
  const r = document.documentElement.style;
  r.setProperty('--erp-primary',       tema.primary);
  r.setProperty('--erp-primary-dark',  tema.primaryDark);
  r.setProperty('--erp-primary-text',  tema.primaryText);
  r.setProperty('--erp-accent',        tema.accent);
  r.setProperty('--erp-accent-dark',   tema.accentDark);
  r.setProperty('--erp-bg',            tema.bg);
  r.setProperty('--erp-surface',       tema.surface);
  r.setProperty('--erp-border',        tema.border);
  r.setProperty('--erp-border-light',  tema.borderLight);
  r.setProperty('--erp-text',          tema.text);
  r.setProperty('--erp-text-muted',    tema.textMuted);
  r.setProperty('--erp-font-family',   tema.fontFamily  || 'system-ui, -apple-system, sans-serif');
  r.setProperty('--erp-font-size',     tema.fontSize    || '13px');
  r.setProperty('--erp-hoje-bg',       tema.hojeBg      || '#fefce8');
  r.setProperty('--erp-hoje-border',   tema.hojeBorder  || '#ca8a04');
  r.setProperty('--erp-hoje-hover',    tema.hojeHover   || '#fef9c3');
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useUiStore = create(
  persist(
    (set) => ({
      // Notificações toast
      notificacoes: [],
      addNotificacao: (msg, tipo = 'success') =>
        set((s) => ({
          notificacoes: [...s.notificacoes, { id: Date.now(), msg, tipo }],
        })),
      removeNotificacao: (id) =>
        set((s) => ({ notificacoes: s.notificacoes.filter((n) => n.id !== id) })),

      // Usuário autenticado
      usuario: null,
      setUsuario: (u) => set({ usuario: u }),

      // Tema visual
      tema: TEMA_PADRAO,
      setTema: (novoTema) => {
        aplicarTema(novoTema);
        set({ tema: novoTema });
      },
    }),
    {
      name: 'erp-ui-store',
      partialize: (s) => ({ tema: s.tema }), // persiste apenas o tema
    }
  )
);

import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:8050';

export function useCrud(endpoint, formVazio, normalizar = (f) => f) {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ ...formVazio });
  const [busca, setBusca] = useState('');

  const carregar = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ ...params, ...(busca ? { busca } : {}) }).toString();
      const url = qs ? `${API}${endpoint}?${qs}` : `${API}${endpoint}`;
      const r = await fetch(url);
      if (!r.ok) throw new Error('Erro ao carregar');
      setItens(await r.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [endpoint, busca]);

  useEffect(() => { carregar(); }, [carregar]);

  const abrirAdicionar = useCallback(() => {
    setEditandoId(null);
    setForm({ ...formVazio });
    setModal(true);
  }, [formVazio]);

  const abrirEditar = useCallback((item) => {
    setEditandoId(item.id);
    const formFormatado = Object.fromEntries(
      Object.entries(item).map(([k, v]) => {
        if (typeof v === 'string' && v.match(/^\d{4}-\d{2}-\d{2}T/)) {
          return [k, v.slice(0, 10)];
        }
        return [k, v ?? ''];
      })
    );
    setForm(formFormatado);
    setModal(true);
  }, []);

  const salvar = useCallback(async () => {
    const url = editandoId ? `${API}${endpoint}/${editandoId}` : `${API}${endpoint}`;
    const method = editandoId ? 'PUT' : 'POST';
    try {
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizar(form)),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
        throw new Error(err.detail || 'Erro ao salvar');
      }
      setModal(false);
      carregar();
    } catch (e) {
      alert('Erro: ' + e.message);
    }
  }, [endpoint, editandoId, form, carregar, normalizar]);

  const excluir = useCallback(async (id) => {
    if (!window.confirm('Excluir este registro?')) return;
    try {
      await fetch(`${API}${endpoint}/${id}`, { method: 'DELETE' });
      carregar();
    } catch (e) {
      alert('Erro ao excluir: ' + e.message);
    }
  }, [endpoint, carregar]);

  return {
    itens, loading, modal, editandoId, form, setForm,
    busca, setBusca,
    abrirAdicionar, abrirEditar, salvar, excluir,
    fecharModal: () => setModal(false),
    recarregar: carregar,
  };
}

import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import { useUiStore } from '../../store/uiStore.js';
import './ConfiguracaoAparenciaWindow.css';

// ── 6 Temas pré-definidos ─────────────────────────────────────────────────────
const TEMAS_PRESET = [
  {
    id: 'classicoErp',
    nome: 'Clássico ERP',
    descricao: 'Azul escuro institucional',
    primary: '#2c3e50', primaryDark: '#1a252f', primaryText: '#ffffff',
    accent: '#2563eb',  accentDark: '#1d4ed8',
    bg: '#f9f9f9', surface: '#ffffff', border: '#cbd5e1', borderLight: '#e2e8f0',
    text: '#213547', textMuted: '#64748b',
    hojeBg: '#fefce8', hojeBorder: '#ca8a04', hojeHover: '#fef9c3',
  },
  {
    id: 'azulCorporativo',
    nome: 'Azul Corporativo',
    descricao: 'Moderno e confiável',
    primary: '#1e40af', primaryDark: '#1e3a8a', primaryText: '#ffffff',
    accent: '#3b82f6',  accentDark: '#2563eb',
    bg: '#f0f4ff', surface: '#ffffff', border: '#bfdbfe', borderLight: '#dbeafe',
    text: '#1e3a5f', textMuted: '#4b6a9b',
    hojeBg: '#fefce8', hojeBorder: '#ca8a04', hojeHover: '#fef9c3',
  },
  {
    id: 'verdeEmpresarial',
    nome: 'Verde Empresarial',
    descricao: 'Sustentável e equilibrado',
    primary: '#166534', primaryDark: '#14532d', primaryText: '#ffffff',
    accent: '#16a34a',  accentDark: '#15803d',
    bg: '#f0fdf4', surface: '#ffffff', border: '#bbf7d0', borderLight: '#dcfce7',
    text: '#052e16', textMuted: '#4b7a5e',
    hojeBg: '#fefce8', hojeBorder: '#ca8a04', hojeHover: '#fef9c3',
  },
  {
    id: 'roxoModerno',
    nome: 'Roxo Moderno',
    descricao: 'Criativo e sofisticado',
    primary: '#4c1d95', primaryDark: '#3b0764', primaryText: '#ffffff',
    accent: '#7c3aed',  accentDark: '#6d28d9',
    bg: '#faf5ff', surface: '#ffffff', border: '#ddd6fe', borderLight: '#ede9fe',
    text: '#1e1333', textMuted: '#6b5f87',
    hojeBg: '#fefce8', hojeBorder: '#ca8a04', hojeHover: '#fef9c3',
  },
  {
    id: 'vermelhoExecutivo',
    nome: 'Vermelho Executivo',
    descricao: 'Ousado e marcante',
    primary: '#991b1b', primaryDark: '#7f1d1d', primaryText: '#ffffff',
    accent: '#dc2626',  accentDark: '#b91c1c',
    bg: '#fff5f5', surface: '#ffffff', border: '#fecaca', borderLight: '#fee2e2',
    text: '#3b0a0a', textMuted: '#7a4444',
    hojeBg: '#fefce8', hojeBorder: '#ca8a04', hojeHover: '#fef9c3',
  },
  {
    id: 'grafitePremium',
    nome: 'Grafite Premium',
    descricao: 'Elegante e minimalista',
    primary: '#1f2937', primaryDark: '#111827', primaryText: '#ffffff',
    accent: '#374151',  accentDark: '#1f2937',
    bg: '#f3f4f6', surface: '#ffffff', border: '#d1d5db', borderLight: '#e5e7eb',
    text: '#111827', textMuted: '#6b7280',
    hojeBg: '#fefce8', hojeBorder: '#ca8a04', hojeHover: '#fef9c3',
  },
  // ── Futurísticos ──────────────────────────────────────────────────────────
  {
    id: 'nebula',
    nome: 'Nebula',
    descricao: 'Espaço sideral com azul elétrico',
    primary: '#1c2841', primaryDark: '#111827', primaryText: '#e0f2fe',
    accent: '#00b4d8',  accentDark: '#0284a8',
    bg: '#0d1117', surface: '#161b22', border: '#30363d', borderLight: '#21262d',
    text: '#e6edf3', textMuted: '#8b949e',
    hojeBg: '#0d2030', hojeBorder: '#00b4d8', hojeHover: '#0d2840',
  },
  {
    id: 'cyber',
    nome: 'Cyber',
    descricao: 'Ultra escuro com neon roxo',
    primary: '#1a0030', primaryDark: '#0d0020', primaryText: '#e8d5ff',
    accent: '#bd00ff',  accentDark: '#9900cc',
    bg: '#0a0014', surface: '#12001f', border: '#2d0050', borderLight: '#1f0038',
    text: '#e8d5ff', textMuted: '#a87cc8',
    hojeBg: '#1a0033', hojeBorder: '#bd00ff', hojeHover: '#200040',
  },
  {
    id: 'aurora',
    nome: 'Aurora',
    descricao: 'Teal escuro com verde neon',
    primary: '#001e1e', primaryDark: '#001010', primaryText: '#a8ffda',
    accent: '#00ff88',  accentDark: '#00cc70',
    bg: '#000f0f', surface: '#001a1a', border: '#003333', borderLight: '#002222',
    text: '#ceffec', textMuted: '#5dc98f',
    hojeBg: '#001a10', hojeBorder: '#00ff88', hojeHover: '#002018',
  },
  // ── Clássicos ─────────────────────────────────────────────────────────────
  {
    id: 'pergaminho',
    nome: 'Pergaminho',
    descricao: 'Creme quente com ocre e ouro',
    primary: '#5c4a1e', primaryDark: '#4a3a14', primaryText: '#fdf6e3',
    accent: '#c9941a',  accentDark: '#a67a12',
    bg: '#fdf6e3', surface: '#fefaf0', border: '#d4c5a0', borderLight: '#e8dfc4',
    text: '#3b2e0c', textMuted: '#7a6540',
    hojeBg: '#fef9e7', hojeBorder: '#c9941a', hojeHover: '#fdf3d0',
  },
  {
    id: 'westminster',
    nome: 'Westminster',
    descricao: 'Azul real britânico com dourado',
    primary: '#1a2744', primaryDark: '#111c33', primaryText: '#ffffff',
    accent: '#c9a227',  accentDark: '#a8841f',
    bg: '#eef1f6', surface: '#ffffff', border: '#bfc6d6', borderLight: '#dde2ec',
    text: '#1a2744', textMuted: '#5a6a85',
    hojeBg: '#fefce8', hojeBorder: '#c9a227', hojeHover: '#fef9d0',
  },
];

const FONTES_OPCOES = [
  // ── Sans-serif do sistema ──
  { group: 'Sistema',       label: 'System UI (padrão)',    value: 'system-ui, -apple-system, sans-serif' },
  { group: 'Sistema',       label: 'Segoe UI',              value: "'Segoe UI', system-ui, sans-serif" },
  { group: 'Sistema',       label: 'Arial',                 value: 'Arial, Helvetica, sans-serif' },
  { group: 'Sistema',       label: 'Verdana',               value: 'Verdana, Geneva, sans-serif' },
  { group: 'Sistema',       label: 'Tahoma',                value: 'Tahoma, Geneva, sans-serif' },
  { group: 'Sistema',       label: 'Trebuchet MS',          value: "'Trebuchet MS', Helvetica, sans-serif" },
  { group: 'Sistema',       label: 'Calibri',               value: "Calibri, 'Gill Sans', sans-serif" },
  { group: 'Sistema',       label: 'Gill Sans',             value: "'Gill Sans', 'Gill Sans MT', sans-serif" },
  { group: 'Sistema',       label: 'Optima',                value: "Optima, Candara, sans-serif" },
  { group: 'Sistema',       label: 'Candara',               value: "Candara, Optima, sans-serif" },
  // ── Web fonts populares (se instaladas) ──
  { group: 'Web Fonts',     label: 'Inter',                 value: "'Inter', system-ui, sans-serif" },
  { group: 'Web Fonts',     label: 'Roboto',                value: "'Roboto', Arial, sans-serif" },
  { group: 'Web Fonts',     label: 'Open Sans',             value: "'Open Sans', Arial, sans-serif" },
  { group: 'Web Fonts',     label: 'Lato',                  value: "'Lato', Arial, sans-serif" },
  { group: 'Web Fonts',     label: 'Poppins',               value: "'Poppins', system-ui, sans-serif" },
  { group: 'Web Fonts',     label: 'Nunito',                value: "'Nunito', system-ui, sans-serif" },
  { group: 'Web Fonts',     label: 'Montserrat',            value: "'Montserrat', system-ui, sans-serif" },
  { group: 'Web Fonts',     label: 'Raleway',               value: "'Raleway', system-ui, sans-serif" },
  { group: 'Web Fonts',     label: 'Ubuntu',                value: "'Ubuntu', system-ui, sans-serif" },
  { group: 'Web Fonts',     label: 'Source Sans Pro',       value: "'Source Sans Pro', Arial, sans-serif" },
  // ── Serifa ──
  { group: 'Serifa',        label: 'Georgia',               value: "Georgia, 'Times New Roman', serif" },
  { group: 'Serifa',        label: 'Times New Roman',       value: "'Times New Roman', Times, serif" },
  { group: 'Serifa',        label: 'Palatino',              value: "'Palatino Linotype', Palatino, serif" },
  { group: 'Serifa',        label: 'Garamond',              value: "Garamond, 'Times New Roman', serif" },
  { group: 'Serifa',        label: 'Cambria',               value: "Cambria, Georgia, serif" },
  { group: 'Serifa',        label: 'Book Antiqua',          value: "'Book Antiqua', Palatino, serif" },
  // ── Monoespaçada ──
  { group: 'Monoespaçada',  label: 'Consolas',              value: "Consolas, 'Courier New', monospace" },
  { group: 'Monoespaçada',  label: 'Courier New',           value: "'Courier New', Courier, monospace" },
  { group: 'Monoespaçada',  label: 'Lucida Console',        value: "'Lucida Console', Monaco, monospace" },
  { group: 'Monoespaçada',  label: 'Fira Code',             value: "'Fira Code', Consolas, monospace" },
];

const TAMANHOS_FONTE = [
  { label: '10px — Mínimo',      value: '10px' },
  { label: '11px — Muito pequeno', value: '11px' },
  { label: '12px — Pequeno',     value: '12px' },
  { label: '13px — Normal',      value: '13px' },
  { label: '14px — Médio',       value: '14px' },
  { label: '15px — Confortável', value: '15px' },
  { label: '16px — Grande',      value: '16px' },
  { label: '17px',               value: '17px' },
  { label: '18px — Muito grande', value: '18px' },
  { label: '20px — Extra grande', value: '20px' },
  { label: '22px — Máximo',      value: '22px' },
];

const CAMPOS_COR = [
  { key: 'primary',     label: 'Cor primária',          descricao: 'Header, botões principais' },
  { key: 'primaryDark', label: 'Cor primária (hover)',   descricao: 'Estado hover dos botões' },
  { key: 'accent',      label: 'Cor de destaque',        descricao: 'Foco de campos, links' },
  { key: 'bg',          label: 'Fundo da aplicação',     descricao: 'Cor de fundo geral' },
  { key: 'surface',     label: 'Superfície (cards)',     descricao: 'Fundo de janelas e modais' },
  { key: 'border',      label: 'Borda padrão',           descricao: 'Bordas de campos e tabelas' },
  { key: 'text',        label: 'Texto principal',        descricao: 'Cor do texto padrão' },
  { key: 'textMuted',   label: 'Texto secundário',       descricao: 'Labels, placeholders' },
];

// ── Preview em miniatura ──────────────────────────────────────────────────────
function PreviewTema({ t }) {
  return (
    <div className="aparencia-preview" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
      {/* Mini header */}
      <div className="ap-prev-header" style={{ background: t.primary, color: t.primaryText }}>
        <span className="ap-prev-logo">Meu ERP</span>
        <div className="ap-prev-nav">
          <span>Cadastro</span>
          <span>Vendas</span>
          <span>Config</span>
        </div>
        <div className="ap-prev-user" style={{ background: 'rgba(255,255,255,0.15)', color: t.primaryText }}>
          admin
        </div>
      </div>

      {/* Mini conteúdo */}
      <div className="ap-prev-body" style={{ background: t.bg }}>
        {/* Mini card / janela */}
        <div className="ap-prev-card" style={{ background: t.surface, borderColor: t.border }}>
          <div className="ap-prev-card-header" style={{ background: t.primary, color: t.primaryText }}>
            Cadastro de Cliente
          </div>
          <div className="ap-prev-card-body">
            <div className="ap-prev-field">
              <div className="ap-prev-label" style={{ color: t.textMuted }}>Nome</div>
              <div className="ap-prev-input" style={{ borderColor: t.border, background: t.surface, color: t.text }}>
                Empresa ABC
              </div>
            </div>
            <div className="ap-prev-field">
              <div className="ap-prev-label" style={{ color: t.textMuted }}>E-mail</div>
              <div className="ap-prev-input ap-prev-input--focus" style={{ borderColor: t.accent, background: t.surface, color: t.text }}>
                contato@abc.com
              </div>
            </div>
          </div>
          <div className="ap-prev-actions">
            <button className="ap-prev-btn ap-prev-btn--cancel" style={{ background: t.borderLight, color: t.text }}>
              Cancelar
            </button>
            <button className="ap-prev-btn ap-prev-btn--save" style={{ background: t.primary, color: t.primaryText }}>
              Salvar
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="ap-prev-badges">
          <span className="ap-prev-badge" style={{ background: '#d1fae5', color: '#065f46' }}>Aprovado</span>
          <span className="ap-prev-badge" style={{ background: '#fef3c7', color: '#b45309' }}>Pendente</span>
          <span className="ap-prev-badge" style={{ background: t.borderLight, color: t.textMuted }}>Inativo</span>
        </div>

        {/* Mini tabela */}
        <div className="ap-prev-table" style={{ borderColor: t.border }}>
          <div className="ap-prev-table-head" style={{ background: t.bg, color: t.textMuted, borderColor: t.border }}>
            <span>Produto</span><span>Qtd</span><span>Status</span>
          </div>
          <div className="ap-prev-table-row" style={{ color: t.text, borderColor: t.borderLight }}>
            <span>Produto A</span><span>10</span><span style={{ color: '#16a34a' }}>● Ativo</span>
          </div>
          <div className="ap-prev-table-row" style={{ color: t.text, borderColor: t.borderLight }}>
            <span>Produto B</span><span>3</span><span style={{ color: '#b45309' }}>● Pendente</span>
          </div>
        </div>
      </div>

      {/* Mini taskbar */}
      <div className="ap-prev-taskbar" style={{ background: t.primary, borderTop: `1px solid ${t.primaryDark}` }}>
        <span style={{ color: t.primaryText, opacity: 0.9 }}>Clientes</span>
        <span style={{ color: t.primaryText, opacity: 0.9 }}>Financeiro</span>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function ConfiguracaoAparenciaWindow({ id, onClose, onMinimize }) {
  const { tema, setTema } = useUiStore();

  const [temaEditando, setTemaEditando] = useState({ ...tema });
  const [salvo, setSalvo] = useState(false);

  const aplicarPreset = (preset) => {
    setTemaEditando({ ...preset });
  };

  const handleCor = (key, valor) => {
    setTemaEditando(t => ({ ...t, [key]: valor }));
  };

  const handleFonte = (valor) => {
    setTemaEditando(t => ({ ...t, fontFamily: valor }));
  };

  const handleTamanho = (valor) => {
    setTemaEditando(t => ({ ...t, fontSize: valor }));
  };

  const handleAplicar = () => {
    setTema(temaEditando);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  const handleRedefinir = () => {
    const padrao = TEMAS_PRESET[0];
    setTemaEditando({ ...padrao });
    setTema(padrao);
  };

  const temaAtualId = TEMAS_PRESET.find(
    t => t.primary === temaEditando.primary && t.bg === temaEditando.bg
  )?.id;

  return (
    <JanelaBase
      id={id}
      titulo="Aparência do Sistema"
      onClose={onClose}
      onMinimize={onMinimize}
      largura={980}
      altura={640}
      minLargura={820}
      minAltura={520}
      maximizavel
    >
      <div className="aparencia-wrapper">

        {/* ── Seção: Temas Pré-definidos ── */}
        <section className="aparencia-section">
          <h3 className="aparencia-section-title">Temas Pré-definidos</h3>
          <div className="aparencia-presets">
            {TEMAS_PRESET.map(preset => (
              <button
                key={preset.id}
                className={`aparencia-preset-card ${temaAtualId === preset.id ? 'aparencia-preset-card--ativo' : ''}`}
                onClick={() => aplicarPreset(preset)}
                title={preset.descricao}
              >
                <div className="aparencia-preset-paleta">
                  <span style={{ background: preset.primary }} />
                  <span style={{ background: preset.accent }} />
                  <span style={{ background: preset.bg, border: `1px solid ${preset.border}` }} />
                </div>
                <span className="aparencia-preset-nome">{preset.nome}</span>
                <span className="aparencia-preset-desc">{preset.descricao}</span>
                {temaAtualId === preset.id && (
                  <span className="aparencia-preset-ativo-badge">Ativo</span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ── Seção: Tipografia ── */}
        <section className="aparencia-section">
          <h3 className="aparencia-section-title">Tipografia</h3>
          <div className="aparencia-tipografia">
            <div className="aparencia-tip-grupo">
              <label className="aparencia-tip-label">Fonte do sistema</label>
              <select
                className="aparencia-tip-select"
                value={temaEditando.fontFamily || FONTES_OPCOES[0].value}
                onChange={e => handleFonte(e.target.value)}
              >
                {Object.entries(
                  FONTES_OPCOES.reduce((acc, f) => {
                    (acc[f.group] = acc[f.group] || []).push(f);
                    return acc;
                  }, {})
                ).map(([grupo, fontes]) => (
                  <optgroup key={grupo} label={grupo}>
                    {fontes.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <span className="aparencia-tip-preview" style={{ fontFamily: temaEditando.fontFamily, fontSize: temaEditando.fontSize }}>
                Aa — O sistema ERP exibe textos assim
              </span>
            </div>
            <div className="aparencia-tip-grupo">
              <label className="aparencia-tip-label">Tamanho da fonte</label>
              <div className="aparencia-tip-tamanhos">
                {TAMANHOS_FONTE.map(t => (
                  <button
                    key={t.value}
                    className={`aparencia-tip-btn ${(temaEditando.fontSize || '13px') === t.value ? 'aparencia-tip-btn--ativo' : ''}`}
                    onClick={() => handleTamanho(t.value)}
                    style={{ fontSize: t.value }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Corpo: Personalizar + Preview ── */}
        <div className="aparencia-corpo">

          {/* Personalização de cores */}
          <section className="aparencia-section aparencia-section--cores">
            <h3 className="aparencia-section-title">Personalizar Cores</h3>
            <div className="aparencia-cores-grid">
              {CAMPOS_COR.map(({ key, label, descricao }) => (
                <div key={key} className="aparencia-cor-item">
                  <label className="aparencia-cor-label">
                    <input
                      type="color"
                      value={temaEditando[key] || '#000000'}
                      onChange={e => handleCor(key, e.target.value)}
                      className="aparencia-color-picker"
                    />
                    <span className="aparencia-cor-nome">{label}</span>
                  </label>
                  <span className="aparencia-cor-desc">{descricao}</span>
                  <span className="aparencia-cor-hex">{temaEditando[key]}</span>
                </div>
              ))}
            </div>

            <div className="aparencia-acoes">
              <button className="aparencia-btn-redefinir" onClick={handleRedefinir}>
                Redefinir Padrão
              </button>
              <button className="aparencia-btn-aplicar" onClick={handleAplicar}>
                {salvo ? '✓ Aplicado!' : 'Aplicar Tema'}
              </button>
            </div>
          </section>

          {/* Preview ao vivo */}
          <section className="aparencia-section aparencia-section--preview">
            <h3 className="aparencia-section-title">Pré-visualização</h3>
            <PreviewTema t={temaEditando} />
            <p className="aparencia-preview-hint">
              A pré-visualização reflete as cores selecionadas. Clique em "Aplicar Tema" para ativar.
            </p>
          </section>

        </div>
      </div>
    </JanelaBase>
  );
}

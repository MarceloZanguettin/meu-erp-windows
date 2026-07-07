import React from 'react';

/**
 * Campos do formulário de Movimento de Crédito (GENUS.MOVTO) — reutilizado
 * tanto pelo modal de edição em MovtoWindow quanto pela janela de criação
 * NovoMovtoWindow, para os dois ficarem sempre em sincronia.
 *
 * Ver docstring do model Movto em backend/models/tabelas.py para o detalhe
 * completo de cada campo (inclui onde CODCADASTRO/CODCADASTROCREDITO,
 * CODFUNCIONARIO e CODSAIDA são referências brutas a outras tabelas GENUS
 * já reconhecidas neste ERP — CadastroPessoa, Funcionario e Saida — que só
 * podem ser resolvidas de fato pelo agente de migração de dados).
 */
export default function CamposMovto({ form, setForm }) {
  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="mv-secao">Identificação (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={form.codigo} onChange={set('codigo')} />
        </div>
        <div className="form-group">
          <label>Cód. Empresa</label>
          <input type="number" value={form.cod_empresa} onChange={set('cod_empresa')} />
        </div>
        <div className="form-group">
          <label>Emissão</label>
          <input type="date" value={form.emissao} onChange={set('emissao')} />
        </div>
        <div className="form-group">
          <label>Tipo (GENUS)</label>
          <input maxLength={1} value={form.tipo} onChange={set('tipo')} />
        </div>
      </div>

      <div className="mv-secao">Cadastro / Vínculos</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Cadastro (titular do movimento)</label>
          <input type="number" value={form.cod_cadastro} onChange={set('cod_cadastro')} />
        </div>
        <div className="form-group">
          <label>Cód. Cadastro Crédito</label>
          <input type="number" value={form.cod_cadastro_credito} onChange={set('cod_cadastro_credito')} />
        </div>
        <div className="form-group">
          <label>Cód. Funcionário</label>
          <input type="number" value={form.cod_funcionario} onChange={set('cod_funcionario')} />
        </div>
        <div className="form-group">
          <label>Cód. Saída</label>
          <input type="number" value={form.cod_saida} onChange={set('cod_saida')} />
        </div>
      </div>

      <div className="mv-secao">Crédito</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Crédito (valor)</label>
          <input type="number" step="0.01" value={form.credito} onChange={set('credito')} />
        </div>
        <div className="form-group">
          <label>Data Crédito</label>
          <input type="date" value={form.dt_credito} onChange={set('dt_credito')} />
        </div>
        <div className="form-group form-group-full">
          <label>Observação (GENUS: OBS)</label>
          <textarea rows={3} value={form.obs} onChange={set('obs')} />
        </div>
      </div>

      <div className="mv-secao">Auditoria (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Alteração</label>
          <input type="number" value={form.cod_alteracao} onChange={set('cod_alteracao')} />
        </div>
        <div className="form-group">
          <label>Hora Alteração</label>
          <input maxLength={8} value={form.hora_alteracao_genus} onChange={set('hora_alteracao_genus')} />
        </div>
        <div className="form-group">
          <label>Data Alteração</label>
          <input type="date" value={form.data_alteracao_genus} onChange={set('data_alteracao_genus')} />
        </div>
      </div>
    </>
  );
}

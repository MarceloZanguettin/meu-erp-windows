import React from 'react';

/**
 * Campos do formulário de Conta (GENUS.CONTAS) — reutilizado tanto pelo
 * modal de edição em ContaGenusWindow quanto pela janela de criação
 * NovoContaGenusWindow, para os dois ficarem sempre em sincronia.
 *
 * No GENUS, CONTAS é o cadastro mestre de conta bancária/caixa — distinto
 * de `ContaBancaria` (cadastro próprio deste ERP). Ver docstring do model
 * ContaGenus em backend/models/tabelas.py para o detalhe completo (inclui
 * onde CODCONTAS é referenciado como código bruto em outras tabelas GENUS
 * já reconhecidas neste ERP).
 */
export default function CamposContaGenus({ form, setForm }) {
  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="cg-secao">Identificação (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={form.codigo} onChange={set('codigo')} />
        </div>
        <div className="form-group">
          <label>Cód. Empresa</label>
          <input type="number" value={form.cod_empresa} onChange={set('cod_empresa')} />
        </div>
        <div className="form-group form-group-full">
          <label>Descrição</label>
          <input maxLength={35} value={form.descricao} onChange={set('descricao')} />
        </div>
      </div>

      <div className="cg-secao">Dados Bancários</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Banco</label>
          <input maxLength={3} value={form.banco} onChange={set('banco')} />
        </div>
        <div className="form-group">
          <label>Agência</label>
          <input maxLength={4} value={form.agencia} onChange={set('agencia')} />
        </div>
        <div className="form-group">
          <label>Conta</label>
          <input maxLength={15} value={form.conta} onChange={set('conta')} />
        </div>
        <div className="form-group">
          <label>Cidade</label>
          <input maxLength={30} value={form.cidade} onChange={set('cidade')} />
        </div>
      </div>

      <div className="cg-secao">Titular / Controle</div>
      <div className="form-grid-2">
        <div className="form-group form-group-full">
          <label>Titular</label>
          <input maxLength={30} value={form.titular} onChange={set('titular')} />
        </div>
        <div className="form-group">
          <label>Permissão (GENUS)</label>
          <input maxLength={1} value={form.permissao} onChange={set('permissao')} />
        </div>
        <div className="form-group">
          <label>Situação (GENUS)</label>
          <input maxLength={1} value={form.situacao} onChange={set('situacao')} />
        </div>
      </div>
    </>
  );
}

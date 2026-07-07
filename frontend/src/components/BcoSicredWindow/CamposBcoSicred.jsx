import React from 'react';

/**
 * Campos do formulário de Banco Sicred — Retorno/Remessa (GENUS.BCOSICRED)
 * — reutilizado tanto pelo modal de edição em BcoSicredWindow quanto pela
 * janela de criação NovoBcoSicredWindow, para os dois ficarem sempre em
 * sincronia.
 *
 * Ver docstring do model BcoSicred em backend/models/tabelas.py para o
 * detalhe completo de cada campo (inclui onde CODEMPRESA/CODCARTEIRA/
 * CODCEDENTE são referências brutas a outras tabelas GENUS — Empresa,
 * CARTEIRA (ainda não modelada) e, provavelmente, CADASTRO — que só podem
 * ser resolvidas de fato pelo agente de migração de dados).
 */
export default function CamposBcoSicred({ form, setForm }) {
  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="bs-secao">Identificação (GENUS)</div>
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
          <label>Cód. Cedente</label>
          <input type="number" value={form.cod_cedente} onChange={set('cod_cedente')} />
        </div>
        <div className="form-group">
          <label>Cód. Carteira (interno)</label>
          <input type="number" value={form.cod_carteira} onChange={set('cod_carteira')} />
        </div>
      </div>

      <div className="bs-secao">Dados Bancários / Boleto</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Agência</label>
          <input maxLength={6} value={form.agencia} onChange={set('agencia')} />
        </div>
        <div className="form-group">
          <label>Conta</label>
          <input maxLength={10} value={form.conta} onChange={set('conta')} />
        </div>
        <div className="form-group">
          <label>Carteira (código do layout)</label>
          <input maxLength={10} value={form.carteira} onChange={set('carteira')} />
        </div>
        <div className="form-group">
          <label>Carteira Banco (código numérico)</label>
          <input type="number" value={form.carteira_banco} onChange={set('carteira_banco')} />
        </div>
        <div className="form-group">
          <label>Convênio</label>
          <input maxLength={10} value={form.convenio} onChange={set('convenio')} />
        </div>
        <div className="form-group">
          <label>CNAB</label>
          <input maxLength={3} value={form.cnab} onChange={set('cnab')} />
        </div>
        <div className="form-group">
          <label>Posto</label>
          <input maxLength={2} value={form.posto} onChange={set('posto')} />
        </div>
      </div>

      <div className="bs-secao">Instruções / Cobrança</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Instrução 1</label>
          <input maxLength={2} value={form.instrucao1} onChange={set('instrucao1')} />
        </div>
        <div className="form-group">
          <label>Instrução 2</label>
          <input maxLength={2} value={form.instrucao2} onChange={set('instrucao2')} />
        </div>
        <div className="form-group">
          <label>Espécie</label>
          <input maxLength={2} value={form.especie} onChange={set('especie')} />
        </div>
        <div className="form-group">
          <label>Aceite</label>
          <input maxLength={1} value={form.aceite} onChange={set('aceite')} />
        </div>
        <div className="form-group">
          <label>Postar</label>
          <input maxLength={1} value={form.postar} onChange={set('postar')} />
        </div>
        <div className="form-group">
          <label>Dias Protesto</label>
          <input type="number" value={form.dias_protesto} onChange={set('dias_protesto')} />
        </div>
      </div>

      <div className="bs-secao">Juros / Multa</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Juros Mora</label>
          <input type="number" step="0.01" value={form.juros_mora} onChange={set('juros_mora')} />
        </div>
        <div className="form-group">
          <label>Tipo Juros</label>
          <input maxLength={1} value={form.tipo_juros} onChange={set('tipo_juros')} />
        </div>
        <div className="form-group">
          <label>Multa</label>
          <input type="number" step="0.01" value={form.multa} onChange={set('multa')} />
        </div>
      </div>

      <div className="bs-secao">Remessa / Sequência / Arquivo</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Sequência</label>
          <input type="number" value={form.sequencia} onChange={set('sequencia')} />
        </div>
        <div className="form-group">
          <label>Seq. Remessa</label>
          <input type="number" value={form.seq_remessa} onChange={set('seq_remessa')} />
        </div>
        <div className="form-group">
          <label>Número</label>
          <input type="number" value={form.numero} onChange={set('numero')} />
        </div>
        <div className="form-group">
          <label>Emitir Boleto</label>
          <input maxLength={15} value={form.emitir_boleto} onChange={set('emitir_boleto')} />
        </div>
        <div className="form-group form-group-full">
          <label>Caminho</label>
          <input maxLength={120} value={form.caminho} onChange={set('caminho')} />
        </div>
        <div className="form-group form-group-full">
          <label>Observação (GENUS: OBSERVACAO)</label>
          <textarea rows={3} maxLength={160} value={form.observacao} onChange={set('observacao')} />
        </div>
      </div>
    </>
  );
}

import React from 'react';

/**
 * Campos do formulário de Cadastro (GENUS.CADASTRO) — reutilizado tanto pelo
 * modal de edição em CadastroPessoaWindow quanto pela janela de criação
 * NovoCadastroPessoaWindow, para os dois ficarem sempre em sincronia.
 */
export default function CamposCadastroPessoa({ form, setForm }) {
  const set = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [campo]: valor });
  };

  return (
    <>
      <div className="cadpes-secao">Identificação</div>
      <div className="form-grid-2">
        <div className="form-group form-group-full">
          <label>Nome *</label>
          <input value={form.nome} onChange={set('nome')} />
        </div>
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={form.codigo} onChange={set('codigo')} />
        </div>
        <div className="form-group">
          <label>Fantasia</label>
          <input value={form.fantasia} onChange={set('fantasia')} />
        </div>
        <div className="form-group">
          <label>CPF / CNPJ</label>
          <input value={form.cpf_cnpj} onChange={set('cpf_cnpj')} />
        </div>
        <div className="form-group">
          <label>Tipo de Pessoa</label>
          <select value={form.pessoa} onChange={set('pessoa')}>
            <option value="F">Física</option>
            <option value="J">Jurídica</option>
          </select>
        </div>
        <div className="form-group">
          <label>Situação</label>
          <select value={form.situacao} onChange={set('situacao')}>
            <option value="A">Ativo</option>
            <option value="I">Inativo</option>
          </select>
        </div>
        <div className="form-group">
          <label>Data de Cadastro</label>
          <input type="date" value={form.data_cadastro} onChange={set('data_cadastro')} />
        </div>
      </div>

      <div className="cadpes-secao">Endereço</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>CEP</label>
          <input value={form.cep} onChange={set('cep')} />
        </div>
        <div className="form-group form-group-full">
          <label>Endereço</label>
          <input value={form.endereco} onChange={set('endereco')} />
        </div>
        <div className="form-group">
          <label>Número</label>
          <input value={form.numero} onChange={set('numero')} />
        </div>
        <div className="form-group">
          <label>Bairro</label>
          <input value={form.bairro} onChange={set('bairro')} />
        </div>
        <div className="form-group">
          <label>Código da Cidade (GENUS)</label>
          <input type="number" value={form.cod_cidade} onChange={set('cod_cidade')} />
        </div>
        <div className="form-group form-group-full">
          <label>Complemento</label>
          <input value={form.complemento} onChange={set('complemento')} />
        </div>
      </div>

      <div className="cadpes-secao">Contato</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>E-mail</label>
          <input type="email" value={form.email} onChange={set('email')} />
        </div>
        <div className="form-group">
          <label>E-mail Financeiro</label>
          <input type="email" value={form.email_financeiro} onChange={set('email_financeiro')} />
        </div>
        <div className="form-group">
          <label>Site</label>
          <input value={form.site} onChange={set('site')} />
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input value={form.fone} onChange={set('fone')} />
        </div>
        <div className="form-group">
          <label>Telefone 2</label>
          <input value={form.fone2} onChange={set('fone2')} />
        </div>
        <div className="form-group">
          <label>Celular</label>
          <input value={form.celular} onChange={set('celular')} />
        </div>
        <div className="form-group form-group-checkbox">
          <label>
            <input type="checkbox" checked={!!form.mobile} onChange={e => setForm({ ...form, mobile: e.target.checked ? 'S' : '' })} />
            Celular é Mobile (WhatsApp)
          </label>
        </div>
        <div className="form-group form-group-full">
          <label>Referência Comercial</label>
          <input value={form.referencia_comercial} onChange={set('referencia_comercial')} />
        </div>
        <div className="form-group form-group-full">
          <label>Observação</label>
          <textarea rows={2} value={form.observacao} onChange={set('observacao')} />
        </div>
      </div>

      <div className="cadpes-secao">Dados Pessoais (Pessoa Física)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Data de Nascimento</label>
          <input type="date" value={form.data_nascimento} onChange={set('data_nascimento')} />
        </div>
        <div className="form-group">
          <label>Local de Nascimento</label>
          <input value={form.local_nascimento} onChange={set('local_nascimento')} />
        </div>
        <div className="form-group">
          <label>País de Nacionalidade (GENUS)</label>
          <input type="number" value={form.pais_nacionalidade} onChange={set('pais_nacionalidade')} />
        </div>
        <div className="form-group">
          <label>Nome do Pai</label>
          <input value={form.nome_pai} onChange={set('nome_pai')} />
        </div>
        <div className="form-group">
          <label>Nome da Mãe</label>
          <input value={form.nome_mae} onChange={set('nome_mae')} />
        </div>
        <div className="form-group">
          <label>RG / Inscrição Estadual</label>
          <input value={form.rg_insc} onChange={set('rg_insc')} />
        </div>
        <div className="form-group">
          <label>Órgão / UF do RG</label>
          <input value={form.orgao_uf_rg} onChange={set('orgao_uf_rg')} />
        </div>
        <div className="form-group">
          <label>Data de Emissão do RG</label>
          <input type="date" value={form.data_emissao_rg} onChange={set('data_emissao_rg')} />
        </div>
        <div className="form-group">
          <label>Passaporte</label>
          <input value={form.passaporte} onChange={set('passaporte')} />
        </div>
        <div className="form-group">
          <label>Escolaridade</label>
          <input value={form.escolaridade} onChange={set('escolaridade')} />
        </div>
        <div className="form-group">
          <label>Cor</label>
          <input maxLength={1} value={form.cor} onChange={set('cor')} />
        </div>
        <div className="form-group">
          <label>Deficiência</label>
          <input maxLength={1} value={form.deficiencia} onChange={set('deficiencia')} />
        </div>
        <div className="form-group">
          <label>Estado Civil</label>
          <input maxLength={1} value={form.estado_civil} onChange={set('estado_civil')} />
        </div>
        <div className="form-group">
          <label>Sexo</label>
          <select value={form.sexo} onChange={set('sexo')}>
            <option value="">-</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>
        <div className="form-group form-group-checkbox">
          <label>
            <input type="checkbox" checked={form.reter_ir === 'S'} onChange={e => setForm({ ...form, reter_ir: e.target.checked ? 'S' : 'N' })} />
            Reter IR
          </label>
        </div>
      </div>

      <div className="cadpes-secao">Fiscal</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Inscrição SUFRAMA</label>
          <input value={form.insc_suframa} onChange={set('insc_suframa')} />
        </div>
        <div className="form-group form-group-checkbox">
          <label>
            <input type="checkbox" checked={form.zona_franca === 'S'} onChange={e => setForm({ ...form, zona_franca: e.target.checked ? 'S' : 'N' })} />
            Zona Franca
          </label>
        </div>
        <div className="form-group">
          <label>Apuração</label>
          <input maxLength={1} value={form.apuracao} onChange={set('apuracao')} />
        </div>
      </div>

      <div className="cadpes-secao">Transferência entre Empresas (GENUS multi-empresa)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Código Empresa Transferência</label>
          <input type="number" value={form.cod_empresa_transferencia} onChange={set('cod_empresa_transferencia')} />
        </div>
        <div className="form-group">
          <label>Código Empresa Transf. 1</label>
          <input type="number" value={form.cod_empresa_transf1} onChange={set('cod_empresa_transf1')} />
        </div>
        <div className="form-group">
          <label>Código Empresa Transf. 2</label>
          <input type="number" value={form.cod_empresa_transf2} onChange={set('cod_empresa_transf2')} />
        </div>
        <div className="form-group">
          <label>Código Antigo Transfere</label>
          <input type="number" value={form.cod_antigo_transfere} onChange={set('cod_antigo_transfere')} />
        </div>
        <div className="form-group">
          <label>Código Antigo Transfere 1</label>
          <input type="number" value={form.cod_antigo_transfere1} onChange={set('cod_antigo_transfere1')} />
        </div>
        <div className="form-group">
          <label>Código Antigo Transfere 2</label>
          <input type="number" value={form.cod_antigo_transfere2} onChange={set('cod_antigo_transfere2')} />
        </div>
      </div>

      <div className="cadpes-secao">Auditoria de Origem (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Código de Alteração</label>
          <input type="number" value={form.cod_alteracao} onChange={set('cod_alteracao')} />
        </div>
        <div className="form-group">
          <label>Hora da Alteração</label>
          <input value={form.hora_alteracao_genus} onChange={set('hora_alteracao_genus')} placeholder="HH:MM:SS" />
        </div>
        <div className="form-group">
          <label>Data da Alteração</label>
          <input type="date" value={form.data_alteracao_genus} onChange={set('data_alteracao_genus')} />
        </div>
      </div>
    </>
  );
}

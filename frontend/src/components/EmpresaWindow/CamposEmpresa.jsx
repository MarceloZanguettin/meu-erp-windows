import React from 'react';

/**
 * Campos do formulário de Empresa (GENUS.EMPRESA) — reutilizado tanto pelo
 * modal de edição em EmpresaWindow quanto pela janela de criação
 * NovoEmpresaWindow, para os dois ficarem sempre em sincronia.
 */
export default function CamposEmpresa({ form, setForm }) {
  const set = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [campo]: valor });
  };

  return (
    <>
      <div className="ee-secao">Identidade (ERP)</div>
      <div className="form-grid-2">
        <div className="form-group form-group-full">
          <label>Nome *</label>
          <input value={form.nome} onChange={set('nome')} required />
        </div>
      </div>

      <div className="ee-secao">Identificação (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={form.codigo} onChange={set('codigo')} />
        </div>
        <div className="form-group">
          <label>Razão Social</label>
          <input value={form.razao} onChange={set('razao')} />
        </div>
        <div className="form-group">
          <label>Fantasia</label>
          <input value={form.fantasia} onChange={set('fantasia')} />
        </div>
        <div className="form-group">
          <label>CNPJ</label>
          <input value={form.cnpj} onChange={set('cnpj')} />
        </div>
        <div className="form-group">
          <label>Inscrição Estadual</label>
          <input value={form.insc} onChange={set('insc')} />
        </div>
        <div className="form-group">
          <label>Inscrição Municipal</label>
          <input value={form.insc_municipal} onChange={set('insc_municipal')} />
        </div>
        <div className="form-group">
          <label>CNAE</label>
          <input value={form.cnae} onChange={set('cnae')} />
        </div>
        <div className="form-group">
          <label>Simples Nacional</label>
          <input maxLength={1} value={form.simples} onChange={set('simples')} placeholder="S/N" />
        </div>
        <div className="form-group">
          <label>% Simples</label>
          <input type="number" step="0.01" value={form.simples_percento} onChange={set('simples_percento')} />
        </div>
        <div className="form-group">
          <label>Tipo de Comércio</label>
          <input maxLength={1} value={form.tipo_comercio} onChange={set('tipo_comercio')} />
        </div>
        <div className="form-group">
          <label>Série (NF)</label>
          <input value={form.serie} onChange={set('serie')} />
        </div>
        <div className="form-group">
          <label>Crédito ICMS</label>
          <input type="number" step="0.01" value={form.credito_icms} onChange={set('credito_icms')} />
        </div>
      </div>

      <div className="ee-secao">Endereço</div>
      <div className="form-grid-2">
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
          <label>CEP</label>
          <input value={form.cep} onChange={set('cep')} />
        </div>
        <div className="form-group">
          <label>Cód. Cidade (GENUS)</label>
          <input type="number" value={form.cod_cidade} onChange={set('cod_cidade')} />
        </div>
      </div>

      <div className="ee-secao">Contato</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Telefone</label>
          <input value={form.fone} onChange={set('fone')} />
        </div>
        <div className="form-group">
          <label>Fax</label>
          <input value={form.fax} onChange={set('fax')} />
        </div>
        <div className="form-group">
          <label>E-mail</label>
          <input type="email" value={form.email} onChange={set('email')} />
        </div>
        <div className="form-group">
          <label>Website</label>
          <input value={form.www} onChange={set('www')} />
        </div>
      </div>

      <div className="ee-secao">Tributação / Percentuais</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>PIS (%)</label>
          <input type="number" step="0.0001" value={form.pis} onChange={set('pis')} />
        </div>
        <div className="form-group">
          <label>COFINS (%)</label>
          <input type="number" step="0.0001" value={form.cofins} onChange={set('cofins')} />
        </div>
        <div className="form-group">
          <label>IR (%)</label>
          <input type="number" step="0.0001" value={form.ir} onChange={set('ir')} />
        </div>
        <div className="form-group">
          <label>Contribuição Social (%)</label>
          <input type="number" step="0.0001" value={form.contrib_social} onChange={set('contrib_social')} />
        </div>
        <div className="form-group">
          <label>ISS (%)</label>
          <input type="number" step="0.0001" value={form.iss} onChange={set('iss')} />
        </div>
        <div className="form-group">
          <label>INSS (%)</label>
          <input type="number" step="0.0001" value={form.inss} onChange={set('inss')} />
        </div>
        <div className="form-group">
          <label>Fundo de Garantia (%)</label>
          <input type="number" step="0.0001" value={form.fundo_garantia} onChange={set('fundo_garantia')} />
        </div>
        <div className="form-group">
          <label>Propaganda (%)</label>
          <input type="number" step="0.01" value={form.propaganda} onChange={set('propaganda')} />
        </div>
        <div className="form-group">
          <label>Comissão (%)</label>
          <input type="number" step="0.01" value={form.comissao} onChange={set('comissao')} />
        </div>
        <div className="form-group">
          <label>Fretes (%)</label>
          <input type="number" step="0.01" value={form.fretes} onChange={set('fretes')} />
        </div>
        <div className="form-group">
          <label>Outros (%)</label>
          <input type="number" step="0.01" value={form.outros} onChange={set('outros')} />
        </div>
        <div className="form-group">
          <label>Embalagens (%)</label>
          <input type="number" step="0.01" value={form.embalagens} onChange={set('embalagens')} />
        </div>
        <div className="form-group">
          <label>Juros (%)</label>
          <input type="number" step="0.01" value={form.juros} onChange={set('juros')} />
        </div>
      </div>

      <div className="ee-secao">Regime Tributário / Atividade</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Regime de Apuração</label>
          <input maxLength={2} value={form.regime_apuracao} onChange={set('regime_apuracao')} />
        </div>
        <div className="form-group">
          <label>Regime de Tributação</label>
          <input maxLength={2} value={form.regime_tributacao} onChange={set('regime_tributacao')} />
        </div>
        <div className="form-group">
          <label>Atividade Municipal</label>
          <input value={form.atividade_municipal} onChange={set('atividade_municipal')} />
        </div>
        <div className="form-group">
          <label>Atividade Federal</label>
          <input value={form.atividade_federal} onChange={set('atividade_federal')} />
        </div>
        <div className="form-group">
          <label>Alíquota Municipal (%)</label>
          <input type="number" step="0.0001" value={form.aliq_municipal} onChange={set('aliq_municipal')} />
        </div>
        <div className="form-group">
          <label>Classificação Comercial</label>
          <input maxLength={2} value={form.classif_comercial} onChange={set('classif_comercial')} />
        </div>
        <div className="form-group">
          <label>Cód. GARE ICMS</label>
          <input value={form.cod_gare_icms} onChange={set('cod_gare_icms')} />
        </div>
        <div className="form-group">
          <label>ICMS PIS/COFINS Entrada</label>
          <input maxLength={1} value={form.icms_pis_cofins_entrada} onChange={set('icms_pis_cofins_entrada')} placeholder="S/N" />
        </div>
        <div className="form-group">
          <label>ICMS PIS/COFINS Saída</label>
          <input maxLength={1} value={form.icms_pis_cofins_saida} onChange={set('icms_pis_cofins_saida')} placeholder="S/N" />
        </div>
        <div className="form-group">
          <label>Calcular ICMS Dentro do Estado</label>
          <input maxLength={1} value={form.calcular_icms_dentro_estado} onChange={set('calcular_icms_dentro_estado')} placeholder="S/N" />
        </div>
        <div className="form-group">
          <label>Reforma Tributária</label>
          <input maxLength={1} value={form.reforma_tributaria} onChange={set('reforma_tributaria')} placeholder="S/N" />
        </div>
        <div className="form-group">
          <label>Situação</label>
          <input maxLength={1} value={form.situacao} onChange={set('situacao')} placeholder="A/I" />
        </div>
      </div>

      <div className="ee-secao">Financeiro / Cobrança</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Dias para Vencimento</label>
          <input type="number" value={form.dias_vencimento} onChange={set('dias_vencimento')} />
        </div>
        <div className="form-group">
          <label>Mora (%)</label>
          <input type="number" step="0.01" value={form.mora} onChange={set('mora')} />
        </div>
        <div className="form-group">
          <label>Multa (%)</label>
          <input type="number" step="0.01" value={form.multa} onChange={set('multa')} />
        </div>
      </div>

      <div className="ee-secao">Certificado Digital / Arquivos</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Nº do Certificado</label>
          <input value={form.num_certificado} onChange={set('num_certificado')} />
        </div>
        <div className="form-group">
          <label>Caminho do Logo</label>
          <input value={form.caminho_logo} onChange={set('caminho_logo')} />
        </div>
        <div className="form-group">
          <label>Caminho do XML</label>
          <input value={form.caminho_xml} onChange={set('caminho_xml')} />
        </div>
        <div className="form-group">
          <label>Salvar XML</label>
          <input maxLength={1} value={form.salvar_xml} onChange={set('salvar_xml')} placeholder="S/N" />
        </div>
        <div className="form-group">
          <label>Senha Padrão</label>
          <input type="password" value={form.senha_padrao} onChange={set('senha_padrao')} />
        </div>
        <div className="form-group">
          <label>RNTRC</label>
          <input value={form.rntrc} onChange={set('rntrc')} />
        </div>
        <div className="form-group form-group-full">
          <label>Foto do Logo (base64/caminho)</label>
          <textarea rows={2} value={form.foto_logo} onChange={set('foto_logo')} />
        </div>
        <div className="form-group form-group-full">
          <label>Arquivo do Banco</label>
          <textarea rows={2} value={form.arq_banco} onChange={set('arq_banco')} />
        </div>
      </div>

      <div className="ee-secao">NFe / NSU (SEFAZ)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Último NSU</label>
          <input value={form.ult_nsu} onChange={set('ult_nsu')} />
        </div>
        <div className="form-group">
          <label>NSU Máximo</label>
          <input value={form.max_nsu} onChange={set('max_nsu')} />
        </div>
        <div className="form-group">
          <label>Data Última Consulta NSU</label>
          <input type="date" value={form.data_ultima_consulta_nsu} onChange={set('data_ultima_consulta_nsu')} />
        </div>
        <div className="form-group">
          <label>Hora Última Consulta NSU</label>
          <input value={form.hora_ultima_consulta_nsu} onChange={set('hora_ultima_consulta_nsu')} placeholder="HH:MM:SS" />
        </div>
      </div>

      <div className="ee-secao">CTe / NSU (SEFAZ)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Último NSU (CTe)</label>
          <input value={form.ult_nsu_cte} onChange={set('ult_nsu_cte')} />
        </div>
        <div className="form-group">
          <label>NSU Máximo (CTe)</label>
          <input value={form.max_nsu_cte} onChange={set('max_nsu_cte')} />
        </div>
        <div className="form-group">
          <label>Data Última Consulta NSU (CTe)</label>
          <input type="date" value={form.data_ultima_consulta_nsu_cte} onChange={set('data_ultima_consulta_nsu_cte')} />
        </div>
        <div className="form-group">
          <label>Hora Última Consulta NSU (CTe)</label>
          <input value={form.hora_ultima_consulta_nsu_cte} onChange={set('hora_ultima_consulta_nsu_cte')} placeholder="HH:MM:SS" />
        </div>
      </div>

      <div className="ee-secao">E-mail / SMTP</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Servidor SMTP</label>
          <input value={form.smtp_host} onChange={set('smtp_host')} />
        </div>
        <div className="form-group">
          <label>Porta SMTP</label>
          <input type="number" value={form.smtp_porta} onChange={set('smtp_porta')} />
        </div>
        <div className="form-group">
          <label>Usuário SMTP</label>
          <input value={form.smtp_username} onChange={set('smtp_username')} />
        </div>
        <div className="form-group">
          <label>Senha SMTP</label>
          <input type="password" value={form.smtp_password} onChange={set('smtp_password')} />
        </div>
        <div className="form-group">
          <label>E-mail Remetente</label>
          <input type="email" value={form.from_address} onChange={set('from_address')} />
        </div>
        <div className="form-group">
          <label>Nome Remetente</label>
          <input value={form.from_name} onChange={set('from_name')} />
        </div>
        <div className="form-group">
          <label>Autenticar E-mail com SSL</label>
          <input maxLength={1} value={form.autenticar_email_ssl} onChange={set('autenticar_email_ssl')} placeholder="S/N" />
        </div>
      </div>

      <div className="ee-secao">Integração Gmail</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Client ID</label>
          <input value={form.client_id_gmail} onChange={set('client_id_gmail')} />
        </div>
        <div className="form-group">
          <label>Client Secret</label>
          <input value={form.client_secret_gmail} onChange={set('client_secret_gmail')} />
        </div>
        <div className="form-group">
          <label>Token</label>
          <input value={form.token_gmail} onChange={set('token_gmail')} />
        </div>
        <div className="form-group">
          <label>Refresh Token</label>
          <input value={form.refresh_token_gmail} onChange={set('refresh_token_gmail')} />
        </div>
        <div className="form-group">
          <label>Código Gmail</label>
          <input value={form.codigo_gmail} onChange={set('codigo_gmail')} />
        </div>
      </div>

      <div className="ee-secao">Contador</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Nome do Contador</label>
          <input value={form.nome_cont} onChange={set('nome_cont')} />
        </div>
        <div className="form-group">
          <label>CNPJ do Contador</label>
          <input value={form.cnpj_cont} onChange={set('cnpj_cont')} />
        </div>
        <div className="form-group">
          <label>CPF/CNPJ do Contador</label>
          <input value={form.cpf_cnpj_cont} onChange={set('cpf_cnpj_cont')} />
        </div>
        <div className="form-group">
          <label>CRC do Contador</label>
          <input value={form.crc_cont} onChange={set('crc_cont')} />
        </div>
        <div className="form-group form-group-full">
          <label>Endereço do Contador</label>
          <input value={form.endereco_cont} onChange={set('endereco_cont')} />
        </div>
        <div className="form-group">
          <label>Número (Contador)</label>
          <input value={form.num_cont} onChange={set('num_cont')} />
        </div>
        <div className="form-group">
          <label>Bairro (Contador)</label>
          <input value={form.bairro_cont} onChange={set('bairro_cont')} />
        </div>
        <div className="form-group">
          <label>CEP (Contador)</label>
          <input value={form.cep_cont} onChange={set('cep_cont')} />
        </div>
        <div className="form-group">
          <label>Cód. Cidade (Contador, GENUS)</label>
          <input type="number" value={form.cod_cidade_cont} onChange={set('cod_cidade_cont')} />
        </div>
        <div className="form-group">
          <label>Telefone (Contador)</label>
          <input value={form.fone_cont} onChange={set('fone_cont')} />
        </div>
        <div className="form-group">
          <label>Fax (Contador)</label>
          <input value={form.fax_cont} onChange={set('fax_cont')} />
        </div>
        <div className="form-group">
          <label>E-mail (Contador)</label>
          <input type="email" value={form.email_cont} onChange={set('email_cont')} />
        </div>
      </div>
    </>
  );
}

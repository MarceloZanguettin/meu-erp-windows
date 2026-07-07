import React, { useCallback, useEffect, useState } from 'react';
import {
  listarContatosCadastro,
  criarContatoCadastro,
  atualizarContatoCadastro,
  deletarContatoCadastro,
} from '../services/cadastroContatoService.js';

const LINHA_VAZIA = {
  codigo: '',
  contato: '',
  email: '',
  email_nfe: '',
  fone: '',
  fone2: '',
  celular: '',
  celular2: '',
  cod_setor: '',
  conjuge: '',
  data_nascimento_conjuge: '',
  data_casamento: '',
  observacao: '',
};

// Datas vêm da API em ISO (YYYY-MM-DDTHH:mm:ss); <input type="date"> só aceita YYYY-MM-DD.
const paraInputDate = (v) => (typeof v === 'string' ? v.slice(0, 10) : (v ?? ''));

function linhaParaForm(linha) {
  return {
    codigo: linha.codigo ?? '',
    contato: linha.contato ?? '',
    email: linha.email ?? '',
    email_nfe: linha.email_nfe ?? '',
    fone: linha.fone ?? '',
    fone2: linha.fone2 ?? '',
    celular: linha.celular ?? '',
    celular2: linha.celular2 ?? '',
    cod_setor: linha.cod_setor ?? '',
    conjuge: linha.conjuge ?? '',
    data_nascimento_conjuge: paraInputDate(linha.data_nascimento_conjuge),
    data_casamento: paraInputDate(linha.data_casamento),
    observacao: linha.observacao ?? '',
  };
}

/**
 * Gerencia os contatos adicionais (GENUS.CADASTROCONTATO) de um cadastro
 * (CadastroPessoa) já salvo. No GENUS, CADASTROCONTATO é filha de CADASTRO
 * via CODCADASTRO — um mesmo cadastro pode ter vários contatos adicionais
 * (ex.: um contato por setor, dados do cônjuge) — por isso é uma lista, e
 * não campos únicos do form principal de CadastroPessoaWindow.
 *
 * `cod_cadastro` (código bruto original do GENUS) não é exposto aqui como
 * campo editável — o vínculo é feito via `cadastro_pessoa_id` (id Postgres
 * do cadastro já salvo), o mesmo critério já usado em
 * `TabelaPrecosProduto`/`produto_id` (que também omite o `cod_produto`
 * bruto do formulário).
 */
export default function TabelaContatosCadastro({ cadastroPessoaId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [novaLinha, setNovaLinha] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [linhaEdicao, setLinhaEdicao] = useState(LINHA_VAZIA);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!cadastroPessoaId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarContatosCadastro(cadastroPessoaId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [cadastroPessoaId]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleAdicionar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await criarContatoCadastro({ ...novaLinha, cadastro_pessoa_id: cadastroPessoaId });
      setNovaLinha(LINHA_VAZIA);
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const iniciarEdicao = (linha) => {
    setEditandoId(linha.id);
    setLinhaEdicao(linhaParaForm(linha));
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setLinhaEdicao(LINHA_VAZIA);
  };

  const salvarEdicao = async (id) => {
    setSalvando(true);
    setErro(null);
    try {
      await atualizarContatoCadastro(id, linhaEdicao);
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este contato?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarContatoCadastro(id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!cadastroPessoaId) {
    return (
      <div className="cadpes-contatos-placeholder">
        Salve o cadastro primeiro para gerenciar os contatos adicionais.
      </div>
    );
  }

  const campoEdicao = (campo) => (e) => setLinhaEdicao(v => ({ ...v, [campo]: e.target.value }));
  const campoNovo = (campo) => (e) => setNovaLinha(v => ({ ...v, [campo]: e.target.value }));

  return (
    <fieldset className="cadpes-contatos-fieldset">
      <legend>Contatos Adicionais (GENUS: CADASTROCONTATO)</legend>

      {erro && <div className="cadpes-contato-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <div className="cadpes-contatos-wrap">
        <table className="cadpes-contatos-tabela">
          <thead>
            <tr>
              <th>Contato</th>
              <th>E-mail</th>
              <th>Fone</th>
              <th>Celular</th>
              <th>Cônjuge</th>
              <th>NFe</th>
              <th style={{ width: 130 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr><td colSpan={7} className="cadpes-contato-status">Carregando...</td></tr>
            )}
            {!carregando && linhas.length === 0 && (
              <tr><td colSpan={7} className="cadpes-contato-status">Nenhum contato adicional cadastrado.</td></tr>
            )}
            {!carregando && linhas.map(linha => (
              editandoId === linha.id ? (
                <tr key={linha.id}>
                  <td colSpan={7}>
                    <div className="form-grid-2 cadpes-contato-edicao">
                      <div className="form-group">
                        <label>Código (GENUS)</label>
                        <input type="number" value={linhaEdicao.codigo} onChange={campoEdicao('codigo')} />
                      </div>
                      <div className="form-group">
                        <label>Contato</label>
                        <input value={linhaEdicao.contato} onChange={campoEdicao('contato')} />
                      </div>
                      <div className="form-group">
                        <label>E-mail</label>
                        <input type="email" value={linhaEdicao.email} onChange={campoEdicao('email')} />
                      </div>
                      <div className="form-group form-group-checkbox">
                        <label>
                          <input type="checkbox" checked={linhaEdicao.email_nfe === 'S'} onChange={e => setLinhaEdicao(v => ({ ...v, email_nfe: e.target.checked ? 'S' : 'N' }))} />
                          Recebe e-mail de NF-e
                        </label>
                      </div>
                      <div className="form-group">
                        <label>Telefone</label>
                        <input value={linhaEdicao.fone} onChange={campoEdicao('fone')} />
                      </div>
                      <div className="form-group">
                        <label>Telefone 2</label>
                        <input value={linhaEdicao.fone2} onChange={campoEdicao('fone2')} />
                      </div>
                      <div className="form-group">
                        <label>Celular</label>
                        <input value={linhaEdicao.celular} onChange={campoEdicao('celular')} />
                      </div>
                      <div className="form-group">
                        <label>Celular 2</label>
                        <input value={linhaEdicao.celular2} onChange={campoEdicao('celular2')} />
                      </div>
                      <div className="form-group">
                        <label>Código do Setor (GENUS)</label>
                        <input type="number" value={linhaEdicao.cod_setor} onChange={campoEdicao('cod_setor')} />
                      </div>
                      <div className="form-group">
                        <label>Cônjuge</label>
                        <input value={linhaEdicao.conjuge} onChange={campoEdicao('conjuge')} />
                      </div>
                      <div className="form-group">
                        <label>Data de Nascimento do Cônjuge</label>
                        <input type="date" value={linhaEdicao.data_nascimento_conjuge} onChange={campoEdicao('data_nascimento_conjuge')} />
                      </div>
                      <div className="form-group">
                        <label>Data de Casamento</label>
                        <input type="date" value={linhaEdicao.data_casamento} onChange={campoEdicao('data_casamento')} />
                      </div>
                      <div className="form-group form-group-full">
                        <label>Observação</label>
                        <textarea rows={2} value={linhaEdicao.observacao} onChange={campoEdicao('observacao')} />
                      </div>
                    </div>
                    <div className="cadpes-contato-acoes">
                      <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                      <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={linha.id}>
                  <td>{linha.contato || '—'}</td>
                  <td>{linha.email || '—'}</td>
                  <td>{linha.fone || '—'}</td>
                  <td>{linha.celular || '—'}</td>
                  <td>{linha.conjuge || '—'}</td>
                  <td>{linha.email_nfe === 'S' ? 'Sim' : 'Não'}</td>
                  <td>
                    <button type="button" className="btn-search" disabled={salvando} onClick={() => iniciarEdicao(linha)}>Editar</button>
                    <button type="button" className="btn-cancel" disabled={salvando} onClick={() => excluir(linha.id)}>Excluir</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-grid-2" style={{ marginTop: '12px' }}>
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={novaLinha.codigo} onChange={campoNovo('codigo')} />
        </div>
        <div className="form-group">
          <label>Contato</label>
          <input value={novaLinha.contato} onChange={campoNovo('contato')} />
        </div>
        <div className="form-group">
          <label>E-mail</label>
          <input type="email" value={novaLinha.email} onChange={campoNovo('email')} />
        </div>
        <div className="form-group form-group-checkbox">
          <label>
            <input type="checkbox" checked={novaLinha.email_nfe === 'S'} onChange={e => setNovaLinha(v => ({ ...v, email_nfe: e.target.checked ? 'S' : 'N' }))} />
            Recebe e-mail de NF-e
          </label>
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input value={novaLinha.fone} onChange={campoNovo('fone')} />
        </div>
        <div className="form-group">
          <label>Telefone 2</label>
          <input value={novaLinha.fone2} onChange={campoNovo('fone2')} />
        </div>
        <div className="form-group">
          <label>Celular</label>
          <input value={novaLinha.celular} onChange={campoNovo('celular')} />
        </div>
        <div className="form-group">
          <label>Celular 2</label>
          <input value={novaLinha.celular2} onChange={campoNovo('celular2')} />
        </div>
        <div className="form-group">
          <label>Código do Setor (GENUS)</label>
          <input type="number" value={novaLinha.cod_setor} onChange={campoNovo('cod_setor')} />
        </div>
        <div className="form-group">
          <label>Cônjuge</label>
          <input value={novaLinha.conjuge} onChange={campoNovo('conjuge')} />
        </div>
        <div className="form-group">
          <label>Data de Nascimento do Cônjuge</label>
          <input type="date" value={novaLinha.data_nascimento_conjuge} onChange={campoNovo('data_nascimento_conjuge')} />
        </div>
        <div className="form-group">
          <label>Data de Casamento</label>
          <input type="date" value={novaLinha.data_casamento} onChange={campoNovo('data_casamento')} />
        </div>
        <div className="form-group form-group-full">
          <label>Observação</label>
          <textarea rows={2} value={novaLinha.observacao} onChange={campoNovo('observacao')} />
        </div>
      </div>
      <div className="cadpes-contato-acoes">
        <button type="button" className="btn-save" disabled={salvando} onClick={handleAdicionar}>+ Adicionar Contato</button>
      </div>
    </fieldset>
  );
}

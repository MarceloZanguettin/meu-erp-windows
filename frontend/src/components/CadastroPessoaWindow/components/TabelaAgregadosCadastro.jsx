import React, { useCallback, useEffect, useState } from 'react';
import {
  listarAgregados,
  criarAgregado,
  atualizarAgregado,
  deletarAgregado,
} from '../services/agregadoService.js';

const LINHA_VAZIA = {
  codigo: '',
  tipo: '',
  nome: '',
  data_nascimento: '',
  data_casamento: '',
  endereco: '',
  numero: '',
  bairro: '',
  cod_cidade: '',
  fone: '',
  insc: '',
  cep: '',
  cnpj: '',
  produtor_rural: '',
  observacao: '',
};

// Datas vêm da API em ISO (YYYY-MM-DDTHH:mm:ss); <input type="date"> só aceita YYYY-MM-DD.
const paraInputDate = (v) => (typeof v === 'string' ? v.slice(0, 10) : (v ?? ''));

function linhaParaForm(linha) {
  return {
    codigo: linha.codigo ?? '',
    tipo: linha.tipo ?? '',
    nome: linha.nome ?? '',
    data_nascimento: paraInputDate(linha.data_nascimento),
    data_casamento: paraInputDate(linha.data_casamento),
    endereco: linha.endereco ?? '',
    numero: linha.numero ?? '',
    bairro: linha.bairro ?? '',
    cod_cidade: linha.cod_cidade ?? '',
    fone: linha.fone ?? '',
    insc: linha.insc ?? '',
    cep: linha.cep ?? '',
    cnpj: linha.cnpj ?? '',
    produtor_rural: linha.produtor_rural ?? '',
    observacao: linha.observacao ?? '',
  };
}

/**
 * Gerencia os agregados (GENUS.AGREGADOS) de um cadastro (CadastroPessoa) já
 * salvo. No GENUS, AGREGADOS é filha de CADASTRO via CODCADASTRO — um mesmo
 * cadastro pode ter vários agregados (pessoas adicionais vinculadas, ex.:
 * familiares/dependentes de um produtor rural, cada um com nome, endereço,
 * CPF/CNPJ e inscrição próprios) — por isso é uma lista, e não campos únicos
 * do form principal de CadastroPessoaWindow.
 *
 * `cod_cadastro` (código bruto original do GENUS) não é exposto aqui como
 * campo editável — o vínculo é feito via `cadastro_pessoa_id` (id Postgres
 * do cadastro já salvo), o mesmo critério já usado em
 * `TabelaContatosCadastro`/`cadastro_pessoa_id`.
 */
export default function TabelaAgregadosCadastro({ cadastroPessoaId }) {
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
      const dados = await listarAgregados(cadastroPessoaId);
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
      await criarAgregado({ ...novaLinha, cadastro_pessoa_id: cadastroPessoaId });
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
      await atualizarAgregado(id, linhaEdicao);
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este agregado?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarAgregado(id);
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
        Salve o cadastro primeiro para gerenciar os agregados.
      </div>
    );
  }

  const campoEdicao = (campo) => (e) => setLinhaEdicao(v => ({ ...v, [campo]: e.target.value }));
  const campoNovo = (campo) => (e) => setNovaLinha(v => ({ ...v, [campo]: e.target.value }));

  return (
    <fieldset className="cadpes-contatos-fieldset">
      <legend>Agregados (GENUS: AGREGADOS)</legend>

      {erro && <div className="cadpes-contato-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <div className="cadpes-contatos-wrap">
        <table className="cadpes-contatos-tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>CNPJ</th>
              <th>Fone</th>
              <th>Cidade (cód.)</th>
              <th>Prod. Rural</th>
              <th style={{ width: 130 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr><td colSpan={7} className="cadpes-contato-status">Carregando...</td></tr>
            )}
            {!carregando && linhas.length === 0 && (
              <tr><td colSpan={7} className="cadpes-contato-status">Nenhum agregado cadastrado.</td></tr>
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
                        <label>Tipo</label>
                        <input maxLength={1} value={linhaEdicao.tipo} onChange={campoEdicao('tipo')} />
                      </div>
                      <div className="form-group form-group-full">
                        <label>Nome</label>
                        <input maxLength={45} value={linhaEdicao.nome} onChange={campoEdicao('nome')} />
                      </div>
                      <div className="form-group">
                        <label>Data de Nascimento</label>
                        <input type="date" value={linhaEdicao.data_nascimento} onChange={campoEdicao('data_nascimento')} />
                      </div>
                      <div className="form-group">
                        <label>Data de Casamento</label>
                        <input type="date" value={linhaEdicao.data_casamento} onChange={campoEdicao('data_casamento')} />
                      </div>
                      <div className="form-group">
                        <label>Endereço</label>
                        <input maxLength={50} value={linhaEdicao.endereco} onChange={campoEdicao('endereco')} />
                      </div>
                      <div className="form-group">
                        <label>Número</label>
                        <input maxLength={6} value={linhaEdicao.numero} onChange={campoEdicao('numero')} />
                      </div>
                      <div className="form-group">
                        <label>Bairro</label>
                        <input maxLength={35} value={linhaEdicao.bairro} onChange={campoEdicao('bairro')} />
                      </div>
                      <div className="form-group">
                        <label>Código da Cidade (GENUS)</label>
                        <input type="number" value={linhaEdicao.cod_cidade} onChange={campoEdicao('cod_cidade')} />
                      </div>
                      <div className="form-group">
                        <label>Telefone</label>
                        <input maxLength={15} value={linhaEdicao.fone} onChange={campoEdicao('fone')} />
                      </div>
                      <div className="form-group">
                        <label>Inscrição (RG/IE)</label>
                        <input maxLength={15} value={linhaEdicao.insc} onChange={campoEdicao('insc')} />
                      </div>
                      <div className="form-group">
                        <label>CEP</label>
                        <input maxLength={10} value={linhaEdicao.cep} onChange={campoEdicao('cep')} />
                      </div>
                      <div className="form-group">
                        <label>CNPJ</label>
                        <input maxLength={14} value={linhaEdicao.cnpj} onChange={campoEdicao('cnpj')} />
                      </div>
                      <div className="form-group form-group-checkbox">
                        <label>
                          <input type="checkbox" checked={linhaEdicao.produtor_rural === 'S'} onChange={e => setLinhaEdicao(v => ({ ...v, produtor_rural: e.target.checked ? 'S' : 'N' }))} />
                          Produtor Rural
                        </label>
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
                  <td>{linha.nome || '—'}</td>
                  <td>{linha.tipo || '—'}</td>
                  <td>{linha.cnpj || '—'}</td>
                  <td>{linha.fone || '—'}</td>
                  <td>{linha.cod_cidade ?? '—'}</td>
                  <td>{linha.produtor_rural === 'S' ? 'Sim' : 'Não'}</td>
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
          <label>Tipo</label>
          <input maxLength={1} value={novaLinha.tipo} onChange={campoNovo('tipo')} />
        </div>
        <div className="form-group form-group-full">
          <label>Nome</label>
          <input maxLength={45} value={novaLinha.nome} onChange={campoNovo('nome')} />
        </div>
        <div className="form-group">
          <label>Data de Nascimento</label>
          <input type="date" value={novaLinha.data_nascimento} onChange={campoNovo('data_nascimento')} />
        </div>
        <div className="form-group">
          <label>Data de Casamento</label>
          <input type="date" value={novaLinha.data_casamento} onChange={campoNovo('data_casamento')} />
        </div>
        <div className="form-group">
          <label>Endereço</label>
          <input maxLength={50} value={novaLinha.endereco} onChange={campoNovo('endereco')} />
        </div>
        <div className="form-group">
          <label>Número</label>
          <input maxLength={6} value={novaLinha.numero} onChange={campoNovo('numero')} />
        </div>
        <div className="form-group">
          <label>Bairro</label>
          <input maxLength={35} value={novaLinha.bairro} onChange={campoNovo('bairro')} />
        </div>
        <div className="form-group">
          <label>Código da Cidade (GENUS)</label>
          <input type="number" value={novaLinha.cod_cidade} onChange={campoNovo('cod_cidade')} />
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input maxLength={15} value={novaLinha.fone} onChange={campoNovo('fone')} />
        </div>
        <div className="form-group">
          <label>Inscrição (RG/IE)</label>
          <input maxLength={15} value={novaLinha.insc} onChange={campoNovo('insc')} />
        </div>
        <div className="form-group">
          <label>CEP</label>
          <input maxLength={10} value={novaLinha.cep} onChange={campoNovo('cep')} />
        </div>
        <div className="form-group">
          <label>CNPJ</label>
          <input maxLength={14} value={novaLinha.cnpj} onChange={campoNovo('cnpj')} />
        </div>
        <div className="form-group form-group-checkbox">
          <label>
            <input type="checkbox" checked={novaLinha.produtor_rural === 'S'} onChange={e => setNovaLinha(v => ({ ...v, produtor_rural: e.target.checked ? 'S' : 'N' }))} />
            Produtor Rural
          </label>
        </div>
        <div className="form-group form-group-full">
          <label>Observação</label>
          <textarea rows={2} value={novaLinha.observacao} onChange={campoNovo('observacao')} />
        </div>
      </div>
      <div className="cadpes-contato-acoes">
        <button type="button" className="btn-save" disabled={salvando} onClick={handleAdicionar}>+ Adicionar Agregado</button>
      </div>
    </fieldset>
  );
}

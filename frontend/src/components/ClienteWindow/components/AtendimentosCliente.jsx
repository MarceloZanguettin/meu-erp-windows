import React, { useCallback, useEffect, useState } from 'react';
import {
  listarClientesAtendimento,
  criarClienteAtendimento,
  atualizarClienteAtendimento,
  deletarClienteAtendimento,
} from '../services/clienteAtendimentoService.js';

const LINHA_VAZIA = {
  codigo: '',
  cod_funcionario: '',
  data: '',
  hora: '',
  data_retorno: '',
  observacao: '',
};

// Datas vêm da API em ISO (YYYY-MM-DDTHH:mm:ss); <input type="date"> só aceita YYYY-MM-DD.
const paraInputDate = (v) => (typeof v === 'string' ? v.slice(0, 10) : (v ?? ''));

function linhaParaForm(linha) {
  return {
    codigo: linha.codigo ?? '',
    cod_funcionario: linha.cod_funcionario ?? '',
    data: paraInputDate(linha.data),
    hora: linha.hora ?? '',
    data_retorno: paraInputDate(linha.data_retorno),
    observacao: linha.observacao ?? '',
  };
}

/**
 * Gerencia o histórico de atendimentos (GENUS.CLIENTEATENDIMENTO) de um
 * cliente (ClienteCompleto) já salvo. No GENUS, CLIENTEATENDIMENTO é filha
 * de CLIENTE via CODCLIENTE — um mesmo cliente pode ter vários atendimentos
 * registrados ao longo do tempo (ligações, visitas, contatos comerciais
 * etc.) — por isso é uma lista/histórico, e não campos únicos do form
 * principal de ClienteWindow.
 *
 * `cod_cliente` (código bruto original do GENUS) não é exposto aqui como
 * campo editável — o vínculo é feito via `cliente_id` (id Postgres do
 * cliente já salvo), o mesmo critério já usado em
 * `TabelaContatosCadastro`/`cadastro_pessoa_id` (que também omite o
 * `cod_cadastro` bruto do formulário).
 */
export default function AtendimentosCliente({ clienteId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [novaLinha, setNovaLinha] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [linhaEdicao, setLinhaEdicao] = useState(LINHA_VAZIA);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!clienteId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarClientesAtendimento(clienteId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [clienteId]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleAdicionar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await criarClienteAtendimento({ ...novaLinha, cliente_id: clienteId });
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
      await atualizarClienteAtendimento(id, linhaEdicao);
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este atendimento?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarClienteAtendimento(id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!clienteId) {
    return (
      <div className="aba-placeholder">
        Salve o cliente primeiro para gerenciar o histórico de atendimentos.
      </div>
    );
  }

  const campoEdicao = (campo) => (e) => setLinhaEdicao(v => ({ ...v, [campo]: e.target.value }));
  const campoNovo = (campo) => (e) => setNovaLinha(v => ({ ...v, [campo]: e.target.value }));

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Histórico de Atendimentos (GENUS: CLIENTEATENDIMENTO)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Data</th>
            <th>Hora</th>
            <th>Retorno</th>
            <th>Cód. Funcionário</th>
            <th>Observação</th>
            <th style={{ width: 130 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={6} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={6} className="produto-busca-status">Nenhum atendimento registrado para este cliente.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            editandoId === linha.id ? (
              <tr key={linha.id}>
                <td colSpan={6}>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Código (GENUS)</label>
                      <input type="number" value={linhaEdicao.codigo} onChange={campoEdicao('codigo')} />
                    </div>
                    <div className="form-group">
                      <label>Cód. Funcionário (GENUS)</label>
                      <input type="number" value={linhaEdicao.cod_funcionario} onChange={campoEdicao('cod_funcionario')} />
                    </div>
                    <div className="form-group">
                      <label>Data</label>
                      <input type="date" value={linhaEdicao.data} onChange={campoEdicao('data')} />
                    </div>
                    <div className="form-group">
                      <label>Hora</label>
                      <input maxLength={8} placeholder="HH:MM:SS" value={linhaEdicao.hora} onChange={campoEdicao('hora')} />
                    </div>
                    <div className="form-group">
                      <label>Data de Retorno</label>
                      <input type="date" value={linhaEdicao.data_retorno} onChange={campoEdicao('data_retorno')} />
                    </div>
                    <div className="form-group form-group-full">
                      <label>Observação</label>
                      <textarea rows={2} value={linhaEdicao.observacao} onChange={campoEdicao('observacao')} />
                    </div>
                  </div>
                  <div className="form-acoes">
                    <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                    <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                  </div>
                </td>
              </tr>
            ) : (
              <tr key={linha.id}>
                <td>{paraInputDate(linha.data) || '—'}</td>
                <td>{linha.hora || '—'}</td>
                <td>{paraInputDate(linha.data_retorno) || '—'}</td>
                <td>{linha.cod_funcionario ?? '—'}</td>
                <td>{linha.observacao || '—'}</td>
                <td>
                  <button type="button" className="btn-search" disabled={salvando} onClick={() => iniciarEdicao(linha)}>Editar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={() => excluir(linha.id)}>Excluir</button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>

      <div className="form-grid-2" style={{ marginTop: '12px' }}>
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={novaLinha.codigo} onChange={campoNovo('codigo')} />
        </div>
        <div className="form-group">
          <label>Cód. Funcionário (GENUS)</label>
          <input type="number" value={novaLinha.cod_funcionario} onChange={campoNovo('cod_funcionario')} />
        </div>
        <div className="form-group">
          <label>Data</label>
          <input type="date" value={novaLinha.data} onChange={campoNovo('data')} />
        </div>
        <div className="form-group">
          <label>Hora</label>
          <input maxLength={8} placeholder="HH:MM:SS" value={novaLinha.hora} onChange={campoNovo('hora')} />
        </div>
        <div className="form-group">
          <label>Data de Retorno</label>
          <input type="date" value={novaLinha.data_retorno} onChange={campoNovo('data_retorno')} />
        </div>
        <div className="form-group form-group-full">
          <label>Observação</label>
          <textarea rows={2} value={novaLinha.observacao} onChange={campoNovo('observacao')} />
        </div>
      </div>
      <div className="form-acoes">
        <button type="button" className="btn-save" disabled={salvando} onClick={handleAdicionar}>+ Adicionar Atendimento</button>
      </div>
    </fieldset>
  );
}

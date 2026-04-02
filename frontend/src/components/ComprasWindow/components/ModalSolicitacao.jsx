import React from 'react';
import Portal from '../../shared/Portal.jsx';

export default function ModalSolicitacao({ editandoId, form, setForm, itens, setItens, onSalvar, onFechar, ITEM_VAZIO }) {
  const addItem = () => setItens([...itens, { ...ITEM_VAZIO }]);
  const remItem = (i) => setItens(itens.filter((_, idx) => idx !== i));
  const setItem = (i, field, val) => {
    const novo = [...itens];
    novo[i] = { ...novo[i], [field]: val };
    setItens(novo);
  };

  return (
    <Portal>
      <div className="modal-overlay">
      <div className="modal-content compras-modal">
        <div className="modal-header">
          <strong>{editandoId ? 'Editar Solicitação' : 'Nova Solicitação de Compra'}</strong>
        </div>
        <div className="modal-body compras-modal-body">
          <div className="form-group">
            <label>Solicitante</label>
            <input value={form.solicitante} onChange={e => setForm({ ...form, solicitante: e.target.value })} placeholder="Nome do solicitante" />
          </div>
          <div className="form-group">
            <label>Observação</label>
            <input value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
          </div>

          <div className="compras-itens-header">
            <span>Itens da Solicitação</span>
            <button type="button" className="btn-adicionar-item" onClick={addItem}>+ Item</button>
          </div>

          <div className="compras-itens-tabela">
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th style={{ width: 80 }}>Qtd</th>
                  <th style={{ width: 80 }}>Unidade</th>
                  <th style={{ width: 32 }}></th>
                </tr>
              </thead>
              <tbody>
                {itens.map((it, i) => (
                  <tr key={i}>
                    <td><input value={it.descricao} onChange={e => setItem(i, 'descricao', e.target.value)} placeholder="Descrição do item" /></td>
                    <td><input type="number" min="0" value={it.quantidade} onChange={e => setItem(i, 'quantidade', e.target.value)} /></td>
                    <td><input value={it.unidade} onChange={e => setItem(i, 'unidade', e.target.value)} placeholder="un, kg..." /></td>
                    <td>
                      <button type="button" className="btn-remover-item" onClick={() => remItem(i)} disabled={itens.length === 1}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onFechar}>Cancelar</button>
          <button className="btn-save" onClick={onSalvar}>Salvar</button>
        </div>
      </div>
      </div>
    </Portal>
  );
}

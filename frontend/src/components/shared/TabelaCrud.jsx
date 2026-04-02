import React from 'react';
import './shared.css';

/**
 * Tabela CRUD reutilizável.
 *
 * @param {string[]}   colunas        - labels das colunas
 * @param {string[]}   campos         - nomes dos campos correspondentes no objeto
 * @param {object[]}   itens          - array de dados
 * @param {function}   onEditar
 * @param {function}   onExcluir
 * @param {function}   [renderCelula] - (item, campo) => ReactNode, para customização
 * @param {function}   [renderAcoes]  - (item) => ReactNode, para botões extras além de editar/excluir
 */
export default function TabelaCrud({ colunas, campos, itens, onEditar, onExcluir, renderCelula, renderAcoes }) {
  return (
    <div className="tabela-crud-container">
      <table className="tabela-crud">
        <thead>
          <tr>
            {colunas.map(c => <th key={c}>{c}</th>)}
            <th style={{ width: 90 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {itens.length === 0 && (
            <tr>
              <td colSpan={colunas.length + 1} className="tabela-vazia">
                Nenhum registro encontrado.
              </td>
            </tr>
          )}
          {itens.map(item => (
            <tr key={item.id}>
              {campos.map(campo => (
                <td key={campo}>
                  {renderCelula ? renderCelula(item, campo) : (item[campo] ?? '-')}
                </td>
              ))}
              <td className="tabela-acoes">
                {renderAcoes && renderAcoes(item)}
                <button className="btn-acao-edit" title="Editar" onClick={() => onEditar(item)}>✎</button>
                <button className="btn-acao-del"  title="Excluir" onClick={() => onExcluir(item.id)}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

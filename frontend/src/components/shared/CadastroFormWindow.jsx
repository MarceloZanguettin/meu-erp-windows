import { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';

/**
 * Shell reutilizável para janelas de "Novo/Nova X" (cadastro de um item).
 * Mesmo papel que JanelaBase tem para o comportamento de janela: aqui é o
 * comportamento comum de "formulário flutuante com Cancelar/Salvar" que
 * antes era copiado em cada NovoXWindow — botão Salvar com estado de
 * carregamento, tratamento de erro e fechamento ao concluir.
 *
 * O chamador só fornece o conteúdo específico do formulário (children) e a
 * função que efetivamente persiste os dados (salvar).
 */
export default function CadastroFormWindow({
  id,
  titulo,
  onClose,
  onMinimize,
  onSalvar,
  largura = 700,
  altura = 500,
  minLargura = 480,
  minAltura = 360,
  salvar,
  labelSalvar = 'Salvar',
  labelSalvando = 'Salvando...',
  saveButtonClassName = '',
  children,
}) {
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await salvar();
      onSalvar?.();
      onClose();
    } catch (e) {
      alert('Erro: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <JanelaBase
      id={id}
      titulo={titulo}
      onClose={onClose}
      onMinimize={onMinimize}
      largura={largura}
      altura={altura}
      minLargura={minLargura}
      minAltura={minAltura}
    >
      <div className="modal-body">{children}</div>
      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose} disabled={salvando}>Cancelar</button>
        <button className={`btn-save ${saveButtonClassName}`.trim()} onClick={handleSalvar} disabled={salvando}>
          {salvando ? labelSalvando : labelSalvar}
        </button>
      </div>
    </JanelaBase>
  );
}

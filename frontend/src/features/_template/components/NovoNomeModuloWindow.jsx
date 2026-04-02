/**
 * JANELA DE NOVO REGISTRO — NovoNomeModuloWindow
 *
 * Segue o padrão estabelecido:
 *  - JanelaBase (draggável, minimizável, redimensionável, não bloqueia)
 *  - FormNomeModulo (React Hook Form + Zod, molécula pura)
 *  - useMutation via hook de lógica
 *  - onSalvar callback para refresh da lista pai
 */
import React from 'react';
import JanelaBase from '@/Components/JanelaBase/JanelaBase.jsx';
import { FormNomeModulo } from './molecules/FormNomeModulo';
import { useNomeModuloLogic } from '../hooks/useNomeModuloLogic';

export default function NovoNomeModuloWindow({ id, onClose, onMinimize, onSalvar }) {
  const { criar, criando } = useNomeModuloLogic();

  const handleSubmit = async (dados) => {
    try {
      await criar(dados);
      onSalvar?.();  // TanStack Query já invalida o cache via onSuccess no hook
      onClose();
    } catch (e) {
      alert('Erro: ' + e.message);
    }
  };

  return (
    <JanelaBase
      id={id}
      titulo="Novo NomeModulo"
      onClose={onClose}
      onMinimize={onMinimize}
      largura={520}
      altura={400}
      minLargura={400}
      minAltura={320}
    >
      <FormNomeModulo
        onSubmit={handleSubmit}
        onCancel={onClose}
        salvando={criando}
      />
    </JanelaBase>
  );
}

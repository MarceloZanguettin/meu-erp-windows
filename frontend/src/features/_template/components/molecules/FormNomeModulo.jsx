/**
 * MOLÉCULA — FormNomeModulo
 *
 * Formulário controlado pelo React Hook Form + Zod.
 * Recebe onSubmit e onCancel do componente pai (janela).
 * NÃO conhece a API nem o estado global — apenas recebe e emite dados.
 *
 * INSTALAR: npm install @hookform/resolvers
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nomeModuloSchema } from '../../schemas/nomeModuloSchema';

export function FormNomeModulo({ defaultValues = {}, onSubmit, onCancel, salvando }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(nomeModuloSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">

      {/* Campo: Nome */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">Nome *</label>
        <input
          {...register('nome', { required: 'Nome é obrigatório', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
          className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Digite o nome..."
          autoComplete="off"
        />
        {errors.nome && (
          <span className="text-xs text-red-500">{errors.nome.message}</span>
        )}
      </div>

      {/* Campo: Descrição */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">Descrição</label>
        <textarea
          {...register('descricao', { maxLength: { value: 500, message: 'Máximo 500 caracteres' } })}
          rows={3}
          className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          placeholder="Descrição opcional..."
        />
        {errors.descricao && (
          <span className="text-xs text-red-500">{errors.descricao.message}</span>
        )}
      </div>

      {/* Campo: Ativo */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="ativo"
          {...register('ativo')}
          className="w-4 h-4 text-primary-500 rounded border-slate-300"
        />
        <label htmlFor="ativo" className="text-sm text-slate-700">Ativo</label>
      </div>

      {/* Rodapé */}
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={salvando}
          className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={salvando}
          className="px-4 py-2 text-sm rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 font-medium"
        >
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { createCategoryAction } from '@/actions/category-actions';
import type { CategoryRequest } from '@/types';
import { Loader2 } from 'lucide-react';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCategoryModalProps) {
  const [formData, setFormData] = useState<Partial<CategoryRequest>>({
    name: '',
    categoryGender: 'MALE',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        categoryGender: 'MALE',
        description: '',
      });
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.categoryGender) {
      setError('Nome e gênero são obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createCategoryAction(formData as CategoryRequest);

      if (!result.success) {
        setError(result.error || 'Erro ao criar categoria');
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao criar categoria. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Categoria" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nome da Categoria <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: Sub-18 Masculino"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="categoryGender"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Gênero <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryGender"
            name="categoryGender"
            required
            value={formData.categoryGender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting}
          >
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Feminino</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Descrição da categoria..."
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Criando...
              </span>
            ) : (
              'Criar Categoria'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}


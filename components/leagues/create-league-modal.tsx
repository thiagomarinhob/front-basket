'use client';

import { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/ui/modal';
import { createLeagueAction } from '@/actions/league-actions';
import { getAllCategoriesAction } from '@/actions/category-actions';
import type { LeagueRequest, CategoryResponse } from '@/types';
import { Loader2 } from 'lucide-react';

interface CreateLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export function CreateLeagueModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
}: CreateLeagueModalProps) {
  const [formData, setFormData] = useState<Partial<LeagueRequest>>({
    name: '',
    description: '',
    logoUrl: '',
    startDate: '',
    endDate: '',
    categoryId: '',
    userId: userId,
  });
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true);

    try {
      const result = await getAllCategoriesAction();

      if (result.success) {
        setCategories(result.data);
      } else {
        setError('Erro ao carregar categorias');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao carregar categorias. Tente novamente.'
        );
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        name: '',
        description: '',
        logoUrl: '',
        startDate: '',
        endDate: '',
        categoryId: '',
        userId: userId,
      });
      setError(null);
      loadCategories();
    }
  }, [isOpen, userId, loadCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação
    if (!formData.name || !formData.startDate || !formData.categoryId) {
      setError('Nome, data de início e categoria são obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createLeagueAction(formData as LeagueRequest);

      if (!result.success) {
        setError(result.error || 'Erro ao criar liga');
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao criar liga. Tente novamente.'
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
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Liga" size="lg">
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
            Nome da Liga <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: Liga Municipal de Basquete 2024"
            disabled={isSubmitting}
          />
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
            placeholder="Descrição da liga..."
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Data de Início <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Data de Fim
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Categoria <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            value={formData.categoryId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting || isLoadingCategories}
          >
            <option value="">
              {isLoadingCategories ? 'Carregando categorias...' : 'Selecione uma categoria'}
            </option>
            {!isLoadingCategories &&
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} (
                  {category.categoryGender === 'MALE' ? 'Masculino' : 'Feminino'})
                </option>
              ))}
          </select>
          {!isLoadingCategories && categories.length === 0 && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Nenhuma categoria disponível. Crie uma categoria primeiro.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="logoUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            URL do Logo
          </label>
          <input
            type="url"
            id="logoUrl"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="https://exemplo.com/logo.png"
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
              'Criar Liga'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

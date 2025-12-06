'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { addCategoryToTeamAction } from '@/actions/team-actions';
import { getAllCategoriesAction } from '@/actions/category-actions';
import type { CategoryResponse, ListCategoryResponse } from '@/types';
import { Loader2, Plus } from 'lucide-react';

interface AddCategoryToTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teamId: string;
  currentCategoryIds: string[];
}

export function AddCategoryToTeamModal({
  isOpen,
  onClose,
  onSuccess,
  teamId,
  currentCategoryIds,
}: AddCategoryToTeamModalProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingCategoryId, setAddingCategoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      setError(null);
      setSuccessMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await getAllCategoriesAction();
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        setError(result.error || 'Erro ao carregar categorias');
      }
    } catch (err) {
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (categoryId: string) => {
    setAddingCategoryId(categoryId);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await addCategoryToTeamAction(teamId, categoryId);
      if (result.success) {
        setSuccessMessage('Categoria adicionada com sucesso!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 500);
      } else {
        setError(result.error || 'Erro ao adicionar categoria');
      }
    } catch (err) {
      setError('Erro ao adicionar categoria ao time');
    } finally {
      setAddingCategoryId(null);
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'MALE':
        return 'Masculino';
      case 'FEMALE':
        return 'Feminino';
      default:
        return gender;
    }
  };

  // Filtra categorias que já estão no time
  const availableCategories = categories.filter(
    (category) => !currentCategoryIds.includes(category.id)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Categoria ao Time"
      size="lg"
    >
      <div className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : availableCategories.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {categories.length === 0
              ? 'Nenhuma categoria disponível'
              : 'Todas as categorias já estão associadas ao time'}
          </div>
        ) : (
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {availableCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-md border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </p>
                      {category.description && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <span className="ml-4 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                      {getGenderLabel(category.categoryGender)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddCategory(category.id)}
                  disabled={addingCategoryId === category.id}
                  className="ml-4 flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {addingCategoryId === category.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { createTeamAction } from '@/actions/team-actions';
import type { TeamRequest } from '@/types';
import { Loader2 } from 'lucide-react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTeamModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTeamModalProps) {
  const [formData, setFormData] = useState<Partial<TeamRequest>>({
    name: '',
    shortName: '',
    logoUrl: '',
    location: '',
    description: '',
    ranking: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        shortName: '',
        logoUrl: '',
        location: '',
        description: '',
        ranking: undefined,
      });
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name) {
      setError('Nome é obrigatório');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createTeamAction(formData as TeamRequest);

      if (!result.success) {
        setError(result.error || 'Erro ao criar time');
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao criar time. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'ranking' ? (value ? parseInt(value, 10) : undefined) : value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Time" size="lg">
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
            Nome do Time <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: Flamengo Basquete"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="shortName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nome Curto
            </label>
            <input
              type="text"
              id="shortName"
              name="shortName"
              value={formData.shortName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Ex: FLA"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="ranking"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Ranking
            </label>
            <input
              type="number"
              id="ranking"
              name="ranking"
              min="1"
              value={formData.ranking || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Ex: 1"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Localização
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: Rio de Janeiro, RJ"
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
            placeholder="Descrição do time..."
            disabled={isSubmitting}
          />
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
              'Criar Time'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}


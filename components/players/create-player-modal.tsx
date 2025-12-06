'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { createPlayerAction, getPlayerPositionsAction } from '@/actions/player-actions';
import type { Player, PlayerPosition } from '@/types';
import { Loader2 } from 'lucide-react';

interface CreatePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePlayerModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePlayerModalProps) {
  const [formData, setFormData] = useState<Partial<Player>>({
    firstName: '',
    lastName: '',
    document: '',
    nickName: '',
    birthDate: '',
    height: undefined,
    jerseyNumber: undefined,
    photoURL: '',
    position: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<PlayerPosition[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        document: '',
        nickName: '',
        birthDate: '',
        height: undefined,
        jerseyNumber: undefined,
        photoURL: '',
        position: undefined,
      });
      setError(null);
      loadPositions();
    }
  }, [isOpen]);

  const loadPositions = async () => {
    setIsLoadingPositions(true);
    try {
      const result = await getPlayerPositionsAction();
      if (result.success && result.data) {
        setPositions(result.data);
      }
    } catch (err) {
      console.error('Erro ao carregar posições:', err);
    } finally {
      setIsLoadingPositions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName || !formData.lastName || !formData.document) {
      setError('Nome, sobrenome e documento são obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      // Converte a data para o formato esperado pela API
      const playerData: Player = {
        ...formData,
        birthDate: formData.birthDate || undefined,
        height: formData.height ? parseFloat(String(formData.height)) : undefined,
        jerseyNumber: formData.jerseyNumber ? parseInt(String(formData.jerseyNumber), 10) : undefined,
        position: formData.position || undefined,
      } as Player;

      const result = await createPlayerAction(playerData);

      if (!result.success) {
        setError(result.error || 'Erro ao criar jogador');
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao criar jogador. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPositionLabel = (position: PlayerPosition): string => {
    const labels: Record<PlayerPosition, string> = {
      ARMADOR: 'Armador',
      ALA_ARMADOR: 'Ala/Armador',
      ALA: 'Ala',
      ALA_PIVO: 'Ala/Pivô',
      PIVO: 'Pivô',
    };
    return labels[position] || position;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'height'
          ? value ? parseFloat(value) : undefined
          : name === 'jerseyNumber'
          ? value ? parseInt(value, 10) : undefined
          : name === 'position'
          ? value || undefined
          : value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Jogador" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Ex: João"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Sobrenome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Ex: Silva"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="document"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Documento (CPF) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="document"
            name="document"
            required
            value={formData.document}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="000.000.000-00"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="nickName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Apelido
            </label>
            <input
              type="text"
              id="nickName"
              name="nickName"
              value={formData.nickName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Ex: Joãozinho"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Data de Nascimento
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="height"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Altura (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              min="0"
              step="0.01"
              value={formData.height || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Ex: 195.5"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="jerseyNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Número da Camisa
            </label>
            <input
              type="number"
              id="jerseyNumber"
              name="jerseyNumber"
              min="0"
              max="99"
              value={formData.jerseyNumber || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Ex: 10"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Posição
          </label>
          <select
            id="position"
            name="position"
            value={formData.position || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting || isLoadingPositions}
          >
            <option value="">
              {isLoadingPositions ? 'Carregando posições...' : 'Selecione uma posição'}
            </option>
            {!isLoadingPositions &&
              positions.map((position) => (
                <option key={position} value={position}>
                  {getPositionLabel(position)}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="photoURL"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            URL da Foto
          </label>
          <input
            type="url"
            id="photoURL"
            name="photoURL"
            value={formData.photoURL}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="https://exemplo.com/foto.jpg"
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
              'Criar Jogador'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}


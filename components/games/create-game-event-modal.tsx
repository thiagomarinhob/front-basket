'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { createGameEventAction } from '@/actions/game-actions';
import type { GameEventRequest } from '@/types';
import { Loader2 } from 'lucide-react';

interface CreateGameEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gameId: string;
  teamId: string;
  playerId: string;
}

export function CreateGameEventModal({
  isOpen,
  onClose,
  onSuccess,
  gameId: initialGameId,
  teamId: initialTeamId,
  playerId: initialPlayerId,
}: CreateGameEventModalProps) {
  const [formData, setFormData] = useState<Partial<GameEventRequest>>({
    gameId: initialGameId || '',
    teamId: initialTeamId || '',
    playerId: initialPlayerId || '',
    eventType: 'POINTS',
    eventTime: 0,
    points: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        gameId: initialGameId || '',
        teamId: initialTeamId || '',
        playerId: initialPlayerId || '',
        eventType: 'POINTS',
        eventTime: 0,
        points: undefined,
      });
      setError(null);
    }
  }, [isOpen, initialGameId, initialTeamId, initialPlayerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.gameId || !formData.teamId || !formData.playerId || formData.eventTime === undefined) {
      setError('Jogo, time, jogador e tempo são obrigatórios');
      return;
    }

    if (formData.eventType === 'POINTS' && !formData.points) {
      setError('Pontos são obrigatórios para eventos de pontuação');
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData: GameEventRequest = {
        gameId: formData.gameId!,
        teamId: formData.teamId!,
        playerId: formData.playerId!,
        eventType: formData.eventType!,
        eventTime: formData.eventTime!,
        points: formData.eventType === 'POINTS' ? formData.points : undefined,
      };

      const result = await createGameEventAction(eventData);

      if (!result.success) {
        setError(result.error || 'Erro ao criar evento');
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao criar evento. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'eventTime' || name === 'points'
          ? value ? parseInt(value, 10) : undefined
          : value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Evento de Jogo" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="eventType"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tipo de Evento <span className="text-red-500">*</span>
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            value={formData.eventType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting}
          >
            <option value="POINTS">Pontos</option>
            <option value="FOUL">Falta</option>
            <option value="ASSIST">Assistência</option>
            <option value="TURNOVER">Perda de Bola</option>
            <option value="REBOUND">Rebote</option>
            <option value="TIMEOUT">Time-out</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="eventTime"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tempo do Evento (segundos) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="eventTime"
              name="eventTime"
              required
              min="0"
              value={formData.eventTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="0"
              disabled={isSubmitting}
            />
          </div>

          {formData.eventType === 'POINTS' && (
            <div>
              <label
                htmlFor="points"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Pontos <span className="text-red-500">*</span>
              </label>
              <select
                id="points"
                name="points"
                required={formData.eventType === 'POINTS'}
                value={formData.points || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
              >
                <option value="">Selecione</option>
                <option value="1">1 ponto</option>
                <option value="2">2 pontos</option>
                <option value="3">3 pontos</option>
              </select>
            </div>
          )}
        </div>

        {!initialGameId && (
          <div>
            <label
              htmlFor="gameId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ID do Jogo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="gameId"
              name="gameId"
              required
              value={formData.gameId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting || !!initialGameId}
            />
          </div>
        )}

        {!initialTeamId && (
          <div>
            <label
              htmlFor="teamId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ID do Time <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="teamId"
              name="teamId"
              required
              value={formData.teamId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting || !!initialTeamId}
            />
          </div>
        )}

        {!initialPlayerId && (
          <div>
            <label
              htmlFor="playerId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ID do Jogador <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="playerId"
              name="playerId"
              required
              value={formData.playerId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting || !!initialPlayerId}
            />
          </div>
        )}

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
              'Criar Evento'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}


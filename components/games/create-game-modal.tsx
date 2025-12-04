'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { createGameAction } from '@/actions/game-actions';
import { getAllLeaguesAction } from '@/actions/league-actions';
import type { GameRequest, LeagueResponse, ListTeamResponse } from '@/types';
import { Loader2 } from 'lucide-react';
import { getLeagueTeamsAction } from '@/actions/league-actions';

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  leagueId?: string;
}

export function CreateGameModal({
  isOpen,
  onClose,
  onSuccess,
  leagueId: initialLeagueId,
}: CreateGameModalProps) {
  const [formData, setFormData] = useState<Partial<GameRequest>>({
    leagueId: initialLeagueId || '',
    homeTeamId: '',
    awayTeamId: '',
    venue: '',
    scheduledDate: '',
    status: 'SCHEDULED',
  });
  const [leagues, setLeagues] = useState<LeagueResponse[]>([]);
  const [teams, setTeams] = useState<ListTeamResponse[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadLeagues();
      if (initialLeagueId) {
        setFormData((prev) => ({ ...prev, leagueId: initialLeagueId }));
        loadTeams(initialLeagueId);
      }
    }
  }, [isOpen, initialLeagueId]);

  const loadLeagues = async () => {
    try {
      const result = await getAllLeaguesAction();
      if (result.success) {
        setLeagues(result.data);
      }
    } catch (err) {
      console.error('Erro ao carregar ligas:', err);
    }
  };

  const loadTeams = async (leagueId: string) => {
    if (!leagueId) {
      setTeams([]);
      return;
    }

    setIsLoadingTeams(true);
    try {
      const result = await getLeagueTeamsAction(leagueId);
      if (result.success) {
        setTeams(result.data);
      }
    } catch (err) {
      console.error('Erro ao carregar times:', err);
      setTeams([]);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setFormData({
        leagueId: initialLeagueId || '',
        homeTeamId: '',
        awayTeamId: '',
        venue: '',
        scheduledDate: '',
        status: 'SCHEDULED',
      });
      setError(null);
      if (initialLeagueId) {
        loadTeams(initialLeagueId);
      } else {
        setTeams([]);
      }
    }
  }, [isOpen, initialLeagueId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.leagueId || !formData.homeTeamId || !formData.awayTeamId || !formData.scheduledDate) {
      setError('Liga, times e data são obrigatórios');
      return;
    }

    if (formData.homeTeamId === formData.awayTeamId) {
      setError('Os times devem ser diferentes');
      return;
    }

    setIsSubmitting(true);

    try {
      // Converte a data do formato datetime-local para ISO string
      const gameData: GameRequest = {
        ...formData,
        scheduledDate: formData.scheduledDate
          ? new Date(formData.scheduledDate).toISOString()
          : formData.scheduledDate!,
      } as GameRequest;

      const result = await createGameAction(gameData);

      if (!result.success) {
        setError(result.error || 'Erro ao criar jogo');
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao criar jogo. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Se a liga mudou, carrega os times
      if (name === 'leagueId') {
        loadTeams(value);
        // Limpa a seleção de times
        newData.homeTeamId = '';
        newData.awayTeamId = '';
      }
      
      return newData;
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Jogo" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="leagueId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Liga <span className="text-red-500">*</span>
          </label>
          <select
            id="leagueId"
            name="leagueId"
            required
            value={formData.leagueId}
            onChange={handleChange}
            disabled={isSubmitting || !!initialLeagueId}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          >
            <option value="">Selecione uma liga</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="homeTeamId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Time Mandante <span className="text-red-500">*</span>
            </label>
            <select
              id="homeTeamId"
              name="homeTeamId"
              required
              value={formData.homeTeamId}
              onChange={handleChange}
              disabled={isSubmitting || !formData.leagueId || isLoadingTeams}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
            >
              <option value="">
                {isLoadingTeams ? 'Carregando...' : !formData.leagueId ? 'Selecione uma liga primeiro' : 'Selecione o time'}
              </option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="awayTeamId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Time Visitante <span className="text-red-500">*</span>
            </label>
            <select
              id="awayTeamId"
              name="awayTeamId"
              required
              value={formData.awayTeamId}
              onChange={handleChange}
              disabled={isSubmitting || !formData.leagueId || isLoadingTeams}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
            >
              <option value="">
                {isLoadingTeams ? 'Carregando...' : !formData.leagueId ? 'Selecione uma liga primeiro' : 'Selecione o time'}
              </option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="scheduledDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Data e Hora <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="scheduledDate"
              name="scheduledDate"
              required
              value={formData.scheduledDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            >
              <option value="SCHEDULED">Agendado</option>
              <option value="IN_PROGRESS">Em Andamento</option>
              <option value="COMPLETED">Concluído</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="venue"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Local
          </label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: Ginásio Municipal"
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
              'Criar Jogo'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}


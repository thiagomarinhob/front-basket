'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { addTeamToLeagueAction } from '@/actions/league-actions';
import { getTeamsByCategoryAction } from '@/actions/team-actions';
import type { TeamResponse } from '@/types';
import { Loader2, Plus } from 'lucide-react';

interface AddTeamToLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  leagueId: string;
  currentTeamIds: string[];
  categoryId?: string;
}

export function AddTeamToLeagueModal({
  isOpen,
  onClose,
  onSuccess,
  leagueId,
  currentTeamIds,
  categoryId,
}: AddTeamToLeagueModalProps) {
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingTeamId, setAddingTeamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTeams();
      setError(null);
      setSuccessMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, categoryId]);

  const loadTeams = async () => {
    setLoading(true);
    try {
      // Se tem categoriaId, busca apenas times daquela categoria
      if (categoryId) {
        const result = await getTeamsByCategoryAction(categoryId);
        if (result.success && result.data) {
          setTeams(result.data);
        } else {
          setError(result.error || 'Erro ao carregar times por categoria');
        }
      } else {
        setError('Categoria da liga não encontrada. Não é possível adicionar times.');
      }
    } catch (err) {
      setError('Erro ao carregar times');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = async (teamId: string) => {
    setAddingTeamId(teamId);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await addTeamToLeagueAction(leagueId, teamId);
      if (result.success) {
        setSuccessMessage('Time adicionado com sucesso!');
        // Aguarda um pouco antes de chamar onSuccess para mostrar a mensagem
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 500);
      } else {
        setError(result.error || 'Erro ao adicionar time');
      }
    } catch (err) {
      setError('Erro ao adicionar time à liga');
    } finally {
      setAddingTeamId(null);
    }
  };

  // Filtra times que já estão na liga
  const availableTeams = teams.filter(
    (team) => !currentTeamIds.includes(team.id)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Times à Liga"
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
        ) : availableTeams.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {teams.length === 0
              ? 'Nenhum time disponível'
              : 'Todos os times já estão na liga'}
          </div>
        ) : (
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {availableTeams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between rounded-md border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  {team.logoUrl ? (
                    <img
                      src={team.logoUrl}
                      alt={team.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {team.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {team.name}
                    </p>
                    {team.location && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {team.location}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleAddTeam(team.id)}
                  disabled={addingTeamId === team.id}
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {addingTeamId === team.id ? (
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


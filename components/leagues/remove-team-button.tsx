'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { removeTeamFromLeagueAction } from '@/actions/league-actions';
import { useRouter } from 'next/navigation';

interface RemoveTeamButtonProps {
  leagueId: string;
  teamId: string;
  teamName: string;
}

export function RemoveTeamButton({
  leagueId,
  teamId,
  teamName,
}: RemoveTeamButtonProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRemove = async () => {
    if (
      !confirm(
        `Tem certeza que deseja remover o time "${teamName}" desta liga?`
      )
    ) {
      return;
    }

    setIsRemoving(true);
    setError(null);

    try {
      const result = await removeTeamFromLeagueAction(leagueId, teamId);
      if (result.success) {
        // Aguarda um pouco para garantir que a remoção foi processada
        setTimeout(() => {
          router.refresh();
        }, 300);
      } else {
        setError(result.error || 'Erro ao remover time da liga');
        setIsRemoving(false);
      }
    } catch (err) {
      console.error('Erro ao remover time:', err);
      setError(err instanceof Error ? err.message : 'Erro ao remover time da liga');
      setIsRemoving(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleRemove}
        disabled={isRemoving}
        className="flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
        title="Remover time da liga"
      >
        <Trash2 className="h-4 w-4" />
        {isRemoving ? 'Removendo...' : 'Remover'}
      </button>
      {error && (
        <div className="absolute right-0 top-full z-50 mt-1 max-w-xs rounded-md bg-red-50 p-2 text-xs text-red-600 shadow-lg dark:bg-red-900/20 dark:text-red-400">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 font-bold hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}


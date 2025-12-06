'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AddTeamToLeagueModal } from './add-team-to-league-modal';
import { useRouter } from 'next/navigation';

interface AddTeamButtonProps {
  leagueId: string;
  currentTeamIds: string[];
  categoryId?: string;
}

export function AddTeamButton({ leagueId, currentTeamIds, categoryId }: AddTeamButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        <Plus className="h-4 w-4" />
        Adicionar Time
      </button>

      <AddTeamToLeagueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        leagueId={leagueId}
        currentTeamIds={currentTeamIds}
        categoryId={categoryId}
      />
    </>
  );
}


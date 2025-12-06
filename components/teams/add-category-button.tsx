'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AddCategoryToTeamModal } from './add-category-to-team-modal';
import { useRouter } from 'next/navigation';

interface AddCategoryButtonProps {
  teamId: string;
  currentCategoryIds: string[];
}

export function AddCategoryButton({ teamId, currentCategoryIds }: AddCategoryButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
        title="Adicionar categoria ao time"
      >
        <Plus className="h-4 w-4" />
        Adicionar Categoria
      </button>

      <AddCategoryToTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        teamId={teamId}
        currentCategoryIds={currentCategoryIds}
      />
    </>
  );
}


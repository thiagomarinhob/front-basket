'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/admin/layout/header';
import { getAllLeaguesAction } from '@/actions/league-actions';
import { getCurrentUserIdAction } from '@/actions/auth-actions';
import { CreateLeagueModal } from '@/components/leagues/create-league-modal';
import type { LeagueResponse } from '@/types';
import { Trophy, Plus, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function LigasPage() {
  const [leagues, setLeagues] = useState<LeagueResponse[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [leaguesResult, userIdResult] = await Promise.all([
        getAllLeaguesAction(),
        getCurrentUserIdAction(),
      ]);
      console.log("🚀 ~ loadData ~ leaguesResult:", leaguesResult)

      if (leaguesResult.success) {
        setLeagues(leaguesResult.data);
      } else {
        setError(leaguesResult.error || 'Erro ao carregar ligas');
      }

      if (userIdResult.success && userIdResult.data) {
        setUserId(userIdResult.data);
      }

      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeagueCreated = () => {
    loadData();
  };

  return (
    <div>
      <Header
        title="Ligas"
        description="Gerencie todas as ligas de basquete"
        action={
          !isLoading && userId ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              Nova Liga
            </button>
          ) : null
        }
      />

      {userId && (
        <CreateLeagueModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleLeagueCreated}
          userId={userId}
        />
      )}

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : leagues.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <Trophy className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Nenhuma liga cadastrada ainda.
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Use o botão acima para criar uma nova liga
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Data Início
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Data Fim
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leagues.map((league) => (
                  <tr
                    key={league.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        {league.logoUrl && (
                          <img
                            src={league.logoUrl}
                            alt={league.name}
                            className="mr-3 h-10 w-10 rounded-full object-cover"
                          />
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {league.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {league.description || '-'}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(league.startDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {league.endDate
                        ? new Date(league.endDate).toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/ligas/${league.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

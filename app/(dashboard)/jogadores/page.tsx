'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/admin/layout/header';
import { getAllPlayersAction } from '@/actions/player-actions';
import { CreatePlayerModal } from '@/components/players/create-player-modal';
import type { PlayerResponse, PagePlayerResponse } from '@/types';
import { Plus, User, Loader2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function JogadoresPage() {
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [pagination, setPagination] = useState<{
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
  }>({
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  });

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const playersResult = await getAllPlayersAction(page, size);

      if (playersResult.success && playersResult.data) {
        setPlayers(playersResult.data.content);
        setPagination({
          totalPages: playersResult.data.totalPages,
          totalElements: playersResult.data.totalElements,
          first: playersResult.data.first,
          last: playersResult.data.last,
        });
      } else {
        setError(playersResult.error || 'Erro ao carregar jogadores');
      }

      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayerCreated = () => {
    loadData();
    setIsModalOpen(false);
  };

  const handlePreviousPage = () => {
    if (!pagination.first) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (!pagination.last) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div>
      <Header
        title="Jogadores"
        description="Gerencie todos os jogadores do sistema"
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Novo Jogador
          </button>
        }
      />

      <CreatePlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePlayerCreated}
      />

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : players.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Nenhum jogador cadastrado ainda.
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Use o botão acima para criar um novo jogador
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Apelido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Altura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Número
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {players.map((player) => (
                    <tr
                      key={player.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          {player.photoURL && (
                            <Image
                              src={player.photoURL}
                              alt={`${player.firstName} ${player.lastName}`}
                              width={40}
                              height={40}
                              className="mr-3 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {player.firstName} {player.lastName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {player.document}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {player.nickName || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {player.height ? `${player.height}m` : '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {player.jerseyNumber || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <Link
                          href={`/jogadores/${player.id}`}
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

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando {page * size + 1} a{' '}
                {Math.min((page + 1) * size, pagination.totalElements)} de{' '}
                {pagination.totalElements} jogadores
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={pagination.first}
                  className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Página {page + 1} de {pagination.totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={pagination.last}
                  className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

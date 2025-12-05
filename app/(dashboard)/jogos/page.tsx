'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/admin/layout/header';
import { getAllGamesAction, getAllLeaguesAction } from '@/actions';
import { CreateGameModal } from '@/components/games/create-game-modal';
import type { GameResponse, LeagueResponse, GameStatus } from '@/types';
import {
  Plus,
  Calendar,
  Loader2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const GAME_STATUS_OPTIONS: { value: GameStatus; label: string }[] = [
  { value: 'SCHEDULED', label: 'Agendado' },
  { value: 'IN_PROGRESS', label: 'Em Andamento' },
  { value: 'COMPLETED', label: 'Finalizado' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

export default function JogosPage() {
  const [games, setGames] = useState<GameResponse[]>([]);
  const [leagues, setLeagues] = useState<LeagueResponse[]>([]);
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

  // Filtros
  const [filters, setFilters] = useState<{
    leagueId?: string;
    status?: GameStatus;
    startDate?: string;
    endDate?: string;
  }>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadLeagues();
  }, []);

  useEffect(() => {
    loadData();
  }, [page, filters]);

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

  const loadData = async () => {
    try {
      setIsLoading(true);
      const gamesResult = await getAllGamesAction(page, size, filters);

      if (gamesResult.success && gamesResult.data) {
        setGames(gamesResult.data.content);
        setPagination({
          totalPages: gamesResult.data.totalPages,
          totalElements: gamesResult.data.totalElements,
          first: gamesResult.data.first,
          last: gamesResult.data.last,
        });
      } else {
        setError(gamesResult.error || 'Erro ao carregar jogos');
      }

      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameCreated = () => {
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

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (value === '' || value === undefined) {
        delete newFilters[key as keyof typeof newFilters];
      } else {
        (newFilters as any)[key] = value;
      }
      return newFilters;
    });
    setPage(0); // Reset para primeira página ao filtrar
  };

  const clearFilters = () => {
    setFilters({});
    setPage(0);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const getStatusBadgeColor = (status: GameStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: GameStatus) => {
    return GAME_STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      <Header
        title="Jogos"
        description="Gerencie todos os jogos agendados"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                showFilters || hasActiveFilters
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filtros
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                  {Object.keys(filters).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              Novo Jogo
            </button>
          </div>
        }
      />

      <CreateGameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleGameCreated}
      />

      {/* Filtros */}
      {showFilters && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Filtros
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-3 w-3" />
                Limpar filtros
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Liga
              </label>
              <select
                value={filters.leagueId || ''}
                onChange={(e) => handleFilterChange('leagueId', e.target.value || undefined)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todas as ligas</option>
                {leagues.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) =>
                  handleFilterChange('status', (e.target.value as GameStatus) || undefined)
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todos os status</option>
                {GAME_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Data Inicial
              </label>
              <input
                type="datetime-local"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Data Final
              </label>
              <input
                type="datetime-local"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
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
      ) : games.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {hasActiveFilters
              ? 'Nenhum jogo encontrado com os filtros aplicados.'
              : 'Nenhum jogo cadastrado ainda.'}
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {hasActiveFilters
              ? 'Tente ajustar os filtros ou criar um novo jogo'
              : 'Use o botão acima para criar um novo jogo'}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Liga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Times
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Local
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Placar
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {games.map((game) => (
                  <tr
                    key={game.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {game.league.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/images/team-placeholder.svg"
                            alt={game.homeTeam.name}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {game.homeTeam.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">vs</span>
                        <div className="flex items-center gap-2">
                          <Image
                            src="/images/team-placeholder.svg"
                            alt={game.awayTeam.name}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {game.awayTeam.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(game.scheduledDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {game.venue || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(
                          game.status
                        )}`}
                      >
                        {getStatusLabel(game.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {game.homeScore !== undefined && game.awayScore !== undefined ? (
                        <span className="font-medium">
                          {game.homeScore} - {game.awayScore}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/jogos/${game.id}`}
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

      {/* Paginação */}
      {!isLoading && games.length > 0 && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Mostrando {page * size + 1} a{' '}
            {Math.min((page + 1) * size, pagination.totalElements)} de{' '}
            {pagination.totalElements} jogos
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
    </div>
  );
}

import { notFound } from 'next/navigation';
import { Header } from '@/components/admin/layout/header';
import { getGameStatsAction } from '@/actions/game-actions';
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  ArrowLeft,
  Target,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { GameStatsResponse, PlayerStatsResponse } from '@/types';

interface GameDetailsPageProps {
  params: Promise<{ id: string }>;
}

const getStatusBadgeColor = (status: string) => {
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

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'Agendado';
    case 'IN_PROGRESS':
      return 'Em Andamento';
    case 'COMPLETED':
      return 'Finalizado';
    case 'CANCELLED':
      return 'Cancelado';
    default:
      return status;
  }
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

export default async function GameDetailsPage({ params }: GameDetailsPageProps) {
  const { id } = await params;

  // Busca as estatísticas do jogo
  const statsResult = await getGameStatsAction(id);

  if (!statsResult.success || !statsResult.data) {
    notFound();
  }

  const gameStats: GameStatsResponse = statsResult.data;

  // Separa estatísticas por time
  const homeTeamStats = gameStats.playerStats.filter(
    (stat) => stat.teamName === gameStats.homeTeamName
  );
  const awayTeamStats = gameStats.playerStats.filter(
    (stat) => stat.teamName === gameStats.awayTeamName
  );

  // Calcula totais por time
  const calculateTeamTotals = (stats: PlayerStatsResponse[]) => {
    return stats.reduce(
      (acc, stat) => ({
        points: acc.points + stat.totalPoints,
        assists: acc.assists + stat.assists,
        rebounds: acc.rebounds + stat.rebounds,
        fouls: acc.fouls + stat.fouls,
      }),
      { points: 0, assists: 0, rebounds: 0, fouls: 0 }
    );
  };

  const homeTotals = calculateTeamTotals(homeTeamStats);
  const awayTotals = calculateTeamTotals(awayTeamStats);

  return (
    <div className="space-y-6">
      {/* Header com botão de voltar */}
      <div className="flex items-center gap-4">
        <Link
          href="/jogos"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Jogos
        </Link>
      </div>

      {/* Header do Jogo */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/team-placeholder.svg"
                  alt={gameStats.homeTeamName}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {gameStats.homeTeamName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Casa</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                {gameStats.status === 'COMPLETED' ? (
                  <>
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                      {gameStats.homeScore} - {gameStats.awayScore}
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeColor(
                        gameStats.status
                      )}`}
                    >
                      {getStatusLabel(gameStats.status)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-semibold text-gray-400">vs</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {gameStats.awayTeamName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Visitante</p>
                </div>
                <Image
                  src="/images/team-placeholder.svg"
                  alt={gameStats.awayTeamName}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Data/Hora
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(gameStats.scheduledDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                  <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {getStatusLabel(gameStats.status)}
                  </p>
                </div>
              </div>

              {gameStats.status === 'COMPLETED' && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                    <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Placar Final
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {gameStats.homeScore} - {gameStats.awayScore}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      {gameStats.status === 'COMPLETED' && gameStats.playerStats.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Estatísticas do Time da Casa */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {gameStats.homeTeamName}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Pontos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {homeTotals.points}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Assistências
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {homeTotals.assists}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Rebotes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {homeTotals.rebounds}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Faltas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {homeTotals.fouls}
                </p>
              </div>
            </div>
          </div>

          {/* Estatísticas do Time Visitante */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {gameStats.awayTeamName}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Pontos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {awayTotals.points}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Assistências
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {awayTotals.assists}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Rebotes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {awayTotals.rebounds}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Faltas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {awayTotals.fouls}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas dos Jogadores */}
      {gameStats.status === 'COMPLETED' && gameStats.playerStats.length > 0 ? (
        <div className="space-y-6">
          <Header
            title="Estatísticas dos Jogadores"
            description="Estatísticas individuais de cada jogador na partida"
          />

          {/* Estatísticas do Time da Casa */}
          {homeTeamStats.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {gameStats.homeTeamName}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Jogador
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        PTS
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        AST
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        REB
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        FAL
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Detalhes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {homeTeamStats.map((stat) => (
                      <tr
                        key={stat.playerId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {stat.playerName}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                          {stat.totalPoints}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                          {stat.assists}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                          {stat.rebounds}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                          {stat.fouls}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-xs">
                            {stat.points1}L / {stat.points2}M / {stat.points3}T
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Estatísticas do Time Visitante */}
          {awayTeamStats.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {gameStats.awayTeamName}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Jogador
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        PTS
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        AST
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        REB
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        FAL
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Detalhes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {awayTeamStats.map((stat) => (
                      <tr
                        key={stat.playerId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {stat.playerName}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                          {stat.totalPoints}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                          {stat.assists}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                          {stat.rebounds}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                          {stat.fouls}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-xs">
                            {stat.points1}L / {stat.points2}M / {stat.points3}T
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : gameStats.status === 'COMPLETED' ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Nenhuma estatística registrada para este jogo.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            As estatísticas estarão disponíveis após o jogo ser finalizado.
          </p>
        </div>
      )}
    </div>
  );
}


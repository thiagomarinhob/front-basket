import { notFound } from 'next/navigation';
import { Header } from '@/components/admin/layout/header';
import {
  getLeagueByIdAction,
  getLeagueStandingsAction,
  getLeagueTeamsAction,
  getTopScorersAction,
  getThreePointLeadersAction,
} from '@/actions/league-actions';
import { getGamesByLeagueAction } from '@/actions/game-actions';
import {
  Trophy,
  Calendar,
  Users,
  TrendingUp,
  Target,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import type {
  LeagueResponse,
  TeamStandingsResponse,
  ListTeamResponse,
  GameResponse,
  TopScorerResponse,
  ThreePointLeaderResponse,
} from '@/types';

interface LeagueDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeagueDetailsPage({
  params,
}: LeagueDetailsPageProps) {
  const { id } = await params;

  // Busca os dados da liga
  const leagueResult = await getLeagueByIdAction(id);

  if (!leagueResult.success || !leagueResult.data) {
    notFound();
  }

  const league: LeagueResponse = leagueResult.data;

  // Busca dados relacionados em paralelo
  const [
    standingsResult,
    teamsResult,
    gamesResult,
    topScorersResult,
    threePointLeadersResult,
  ] = await Promise.all([
    getLeagueStandingsAction(id),
    getLeagueTeamsAction(id),
    getGamesByLeagueAction(id),
    getTopScorersAction(id),
    getThreePointLeadersAction(id, 0, 5),
  ]);

  const standings: TeamStandingsResponse[] = standingsResult.success
    ? standingsResult.data
    : [];
  const teams: ListTeamResponse[] = teamsResult.success ? teamsResult.data : [];
  const games: GameResponse[] = gamesResult.success ? gamesResult.data : [];
  const topScorers: TopScorerResponse[] = topScorersResult.success
    ? topScorersResult.data
    : [];
  const threePointLeaders: ThreePointLeaderResponse[] =
    threePointLeadersResult.success && threePointLeadersResult.data
      ? threePointLeadersResult.data.content
      : [];

  return (
    <div className="space-y-6">
      {/* Header com botão de voltar */}
      <div className="flex items-center gap-4">
        <Link
          href="/ligas"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Ligas
        </Link>
      </div>

      <Header
        title={league.name}
        description={league.description || 'Detalhes da liga'}
      />

      {/* Informações básicas da liga */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Status
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {league.endDate ? 'Finalizada' : 'Em Andamento'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Data Início
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(league.startDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        {league.endDate && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <Calendar className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Data Fim
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(league.endDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Times
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {teams.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tabela de Classificação */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Classificação
            </h2>
          </div>
          <div className="overflow-x-auto">
            {standings.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Nenhum dado de classificação disponível
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Pos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Time
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      J
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      V
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      D
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Pts
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {standings.map((team) => (
                    <tr
                      key={team.teamId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {team.position}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {team.teamLogoUrl && (
                            <img
                              src={team.teamLogoUrl}
                              alt={team.teamName}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          )}
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {team.teamName}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                        {team.gamesPlayed}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                        {team.wins}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                        {team.losses}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                        {team.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Times Participantes */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Times Participantes
            </h2>
          </div>
          <div className="p-6">
            {teams.length === 0 ? (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Nenhum time cadastrado
              </p>
            ) : (
              <div className="space-y-3">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center gap-3 rounded-md border border-gray-200 p-3 dark:border-gray-700"
                  >
                    {team.logoUrl && (
                      <img
                        src={team.logoUrl}
                        alt={team.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Scorers */}
      {topScorers.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Maiores Pontuadores
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Pos
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Jogador
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Time
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Jogos
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Total Pts
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Média
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {topScorers.slice(0, 10).map((scorer) => (
                  <tr
                    key={scorer.playerId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {scorer.rank}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {scorer.playerName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {scorer.teamLogoUrl && (
                          <img
                            src={scorer.teamLogoUrl}
                            alt={scorer.teamName}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {scorer.teamName}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      {scorer.gamesPlayed}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      {scorer.totalPoints}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      {scorer.pointsPerGame.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Líderes de 3 Pontos */}
      {threePointLeaders.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Líderes de 3 Pontos
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Pos
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Jogador
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Time
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Jogos
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Total 3pts
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Média
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {threePointLeaders.map((leader) => (
                  <tr
                    key={leader.playerId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {leader.rank}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {leader.playerName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {leader.teamLogoUrl && (
                          <img
                            src={leader.teamLogoUrl}
                            alt={leader.teamName}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {leader.teamName}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      {leader.gamesPlayed}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      {leader.totalThreePointers}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      {leader.threePointersPerGame.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Jogos Recentes */}
      {games.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Jogos
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Time Casa
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Placar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Time Visitante
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {games.map((game) => (
                  <tr
                    key={game.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(game.scheduledDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {game.homeTeam.logoUrl && (
                          <img
                            src={game.homeTeam.logoUrl}
                            alt={game.homeTeam.name}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {game.homeTeam.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center">
                      {game.status === 'COMPLETED' &&
                      game.homeScore !== undefined &&
                      game.awayScore !== undefined ? (
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {game.homeScore} - {game.awayScore}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {game.awayTeam.logoUrl && (
                          <img
                            src={game.awayTeam.logoUrl}
                            alt={game.awayTeam.name}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {game.awayTeam.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          game.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : game.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : game.status === 'SCHEDULED'
                                ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {game.status === 'COMPLETED'
                          ? 'Finalizado'
                          : game.status === 'IN_PROGRESS'
                            ? 'Em Andamento'
                            : game.status === 'SCHEDULED'
                              ? 'Agendado'
                              : 'Cancelado'}
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
  );
}


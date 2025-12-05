'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/admin/layout/header';
import { getGameStatsAction, getGameByIdAction, createGameEventAction } from '@/actions/game-actions';
import { getTeamPlayersAction } from '@/actions/team-actions';
import type { GameStatsResponse, GameResponse, ListPlayersResponse, GameEventRequest } from '@/types';
import {
  Play,
  Pause,
  Square,
  Edit,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface PlayerWithStats extends ListPlayersResponse {
  points: number;
  fouls: number;
  assists: number;
  rebounds: number;
  isOnCourt: boolean;
}

type TimerState = 'stopped' | 'running' | 'paused';

export default function LiveGameTrackerPage() {
  const params = useParams();
  const gameId = params.id as string;

  const [gameStats, setGameStats] = useState<GameStatsResponse | null>(null);
  const [game, setGame] = useState<GameResponse | null>(null);
  const [homeTeamPlayers, setHomeTeamPlayers] = useState<PlayerWithStats[]>([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState<PlayerWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Timer state
  const [timerState, setTimerState] = useState<TimerState>('stopped');
  const [gameTime, setGameTime] = useState(0); // em segundos
  const [period, setPeriod] = useState(1);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editTimeValue, setEditTimeValue] = useState('00:00');

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState === 'running') {
      interval = setInterval(() => {
        setGameTime((prev) => {
          const newTime = prev + 1;
          // 10 minutos por período (600 segundos)
          if (newTime >= 600) {
            setPeriod((prev) => prev + 1);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState]);

  // Load game data
  useEffect(() => {
    loadGameData();
  }, [gameId]);

  const loadGameData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Busca o jogo completo e as stats em paralelo
      const [gameResult, statsResult] = await Promise.all([
        getGameByIdAction(gameId),
        getGameStatsAction(gameId),
      ]);

      if (!gameResult.success || !gameResult.data) {
        setError(gameResult.error || 'Erro ao carregar dados do jogo');
        return;
      }

      if (!statsResult.success || !statsResult.data) {
        setError(statsResult.error || 'Erro ao carregar estatísticas do jogo');
        return;
      }

      const gameData = gameResult.data;
      const stats = statsResult.data;

      setGame(gameData);
      setGameStats(stats);

      // Busca jogadores dos times
      const [homePlayersResult, awayPlayersResult] = await Promise.all([
        getTeamPlayersAction(gameData.homeTeam.id),
        getTeamPlayersAction(gameData.awayTeam.id),
      ]);

      // Inicializa jogadores com stats existentes ou zeros
      const initializePlayers = (
        players: ListPlayersResponse[],
        existingStats: typeof stats.playerStats
      ): PlayerWithStats[] => {
        return players.map((player) => {
          const existingStat = existingStats.find((stat) => stat.playerId === player.id);
          return {
            ...player,
            points: existingStat?.totalPoints || 0,
            fouls: existingStat?.fouls || 0,
            assists: existingStat?.assists || 0,
            rebounds: existingStat?.rebounds || 0,
            isOnCourt: false,
          };
        });
      };

      if (homePlayersResult.success && homePlayersResult.data) {
        const homeStats = stats.playerStats.filter(
          (stat) => stat.teamName === stats.homeTeamName
        );
        setHomeTeamPlayers(initializePlayers(homePlayersResult.data, homeStats));
      }

      if (awayPlayersResult.success && awayPlayersResult.data) {
        const awayStats = stats.playerStats.filter(
          (stat) => stat.teamName === stats.awayTeamName
        );
        setAwayTeamPlayers(initializePlayers(awayPlayersResult.data, awayStats));
      }
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setTimerState('running');
  };

  const handlePauseTimer = () => {
    setTimerState('paused');
  };

  const handleStopTimer = () => {
    setTimerState('stopped');
    setGameTime(0);
  };

  const handleEditTime = () => {
    setIsEditingTime(true);
    setEditTimeValue(formatTime(gameTime));
  };

  const handleSaveTime = () => {
    const [mins, secs] = editTimeValue.split(':').map(Number);
    const totalSeconds = mins * 60 + secs;
    setGameTime(totalSeconds);
    setIsEditingTime(false);
  };

  const handleCancelEditTime = () => {
    setIsEditingTime(false);
  };

  const handlePlayerAction = async (
    playerId: string,
    action: 'points1' | 'points2' | 'points3' | 'foul' | 'assist' | 'rebound',
    isHomeTeam: boolean
  ) => {
    if (!game) {
      alert('Dados do jogo não carregados');
      return;
    }

    try {
      const teamId = isHomeTeam ? game.homeTeam.id : game.awayTeam.id;

      const eventType =
        action === 'foul'
          ? 'FOUL'
          : action === 'assist'
            ? 'ASSIST'
            : action === 'rebound'
              ? 'REBOUND'
              : 'POINTS';

      const points =
        action === 'points1' ? 1 : action === 'points2' ? 2 : action === 'points3' ? 3 : undefined;

      const eventData: GameEventRequest = {
        gameId,
        teamId,
        playerId,
        eventType: eventType as any,
        eventTime: gameTime,
        points,
      };

      const result = await createGameEventAction(eventData);

      if (result.success) {
        // Atualiza o estado local
        const updatePlayer = (player: PlayerWithStats) => {
          if (player.id === playerId) {
            switch (action) {
              case 'points1':
                return { ...player, points: player.points + 1 };
              case 'points2':
                return { ...player, points: player.points + 2 };
              case 'points3':
                return { ...player, points: player.points + 3 };
              case 'foul':
                return { ...player, fouls: player.fouls + 1 };
              case 'assist':
                return { ...player, assists: player.assists + 1 };
              case 'rebound':
                return { ...player, rebounds: player.rebounds + 1 };
              default:
                return player;
            }
          }
          return player;
        };

        if (isHomeTeam) {
          setHomeTeamPlayers((prev) => prev.map(updatePlayer));
        } else {
          setAwayTeamPlayers((prev) => prev.map(updatePlayer));
        }

        // Atualiza o placar se for pontos
        if (action.startsWith('points')) {
          const pointsToAdd = action === 'points1' ? 1 : action === 'points2' ? 2 : 3;
          if (gameStats) {
            setGameStats({
              ...gameStats,
              homeScore: isHomeTeam
                ? (gameStats.homeScore || 0) + pointsToAdd
                : gameStats.homeScore,
              awayScore: !isHomeTeam
                ? (gameStats.awayScore || 0) + pointsToAdd
                : gameStats.awayScore,
            });
          }
        }

        // Recarrega as stats do jogo após um delay para garantir que o backend processou
        setTimeout(() => {
          loadGameData();
        }, 500);
      } else {
        alert(result.error || 'Erro ao registrar ação');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar ação');
    }
  };

  const togglePlayerOnCourt = (playerId: string, isHomeTeam: boolean) => {
    if (isHomeTeam) {
      setHomeTeamPlayers((prev) => {
        const player = prev.find((p) => p.id === playerId);
        if (!player) return prev;

        const currentlyOnCourt = prev.filter((p) => p.isOnCourt);
        const isCurrentlyOnCourt = player.isOnCourt;

        // Se está tentando adicionar e já tem 5 em quadra, não permite
        if (!isCurrentlyOnCourt && currentlyOnCourt.length >= 5) {
          alert('Já existem 5 jogadores em quadra. Remova um jogador primeiro.');
          return prev;
        }

        // Atualiza o estado do jogador
        return prev.map((p) => (p.id === playerId ? { ...p, isOnCourt: !p.isOnCourt } : p));
      });
    } else {
      setAwayTeamPlayers((prev) => {
        const player = prev.find((p) => p.id === playerId);
        if (!player) return prev;

        const currentlyOnCourt = prev.filter((p) => p.isOnCourt);
        const isCurrentlyOnCourt = player.isOnCourt;

        // Se está tentando adicionar e já tem 5 em quadra, não permite
        if (!isCurrentlyOnCourt && currentlyOnCourt.length >= 5) {
          alert('Já existem 5 jogadores em quadra. Remova um jogador primeiro.');
          return prev;
        }

        // Atualiza o estado do jogador
        return prev.map((p) => (p.id === playerId ? { ...p, isOnCourt: !p.isOnCourt } : p));
      });
    }
  };

  const handleEndGame = async () => {
    if (confirm('Tem certeza que deseja encerrar o jogo?')) {
      // Aqui você pode adicionar lógica para finalizar o jogo
      // Por enquanto, apenas para o timer
      handleStopTimer();
      alert('Jogo encerrado!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !gameStats) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        {error || 'Erro ao carregar dados do jogo'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/jogos/${gameId}`}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Detalhes
        </Link>
      </div>

      <Header
        title="Registro de Jogo ao Vivo"
        description={`${gameStats.homeTeamName} vs ${gameStats.awayTeamName}`}
      />

      {/* Placar e Timer */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Placar */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Placar</h3>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">{gameStats.homeTeamName}</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {gameStats.homeScore || 0}
              </p>
            </div>
            <div className="text-2xl font-semibold text-gray-400">x</div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">{gameStats.awayTeamName}</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {gameStats.awayScore || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Cronômetro
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Período:</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{period}º</span>
            </div>
            <div className="flex items-center justify-center">
              {isEditingTime ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editTimeValue}
                    onChange={(e) => setEditTimeValue(e.target.value)}
                    className="w-24 rounded-md border border-gray-300 px-3 py-2 text-center text-3xl font-bold dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="00:00"
                  />
                  <button
                    onClick={handleSaveTime}
                    className="rounded-md bg-green-600 p-2 text-white hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleCancelEditTime}
                    className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {formatTime(gameTime)}
                  </span>
                  <button
                    onClick={handleEditTime}
                    className="ml-2 rounded-md bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-2">
              {timerState === 'stopped' && (
                <button
                  onClick={handleStartTimer}
                  className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  <Play className="h-4 w-4" />
                  Iniciar
                </button>
              )}
              {timerState === 'running' && (
                <button
                  onClick={handlePauseTimer}
                  className="flex items-center gap-2 rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                >
                  <Pause className="h-4 w-4" />
                  Pausar
                </button>
              )}
              {timerState === 'paused' && (
                <>
                  <button
                    onClick={handleStartTimer}
                    className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    <Play className="h-4 w-4" />
                    Retomar
                  </button>
                  <button
                    onClick={handleStopTimer}
                    className="flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  >
                    <Square className="h-4 w-4" />
                    Parar
                  </button>
                </>
              )}
              <button
                onClick={handleEndGame}
                className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                <Square className="h-4 w-4" />
                Encerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Jogadores */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Time da Casa */}
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {gameStats.homeTeamName}
            </h3>
          </div>
          <div className="p-4">
            {homeTeamPlayers.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Carregando jogadores...
              </p>
            ) : (
              <div className="space-y-1">
                {homeTeamPlayers.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onAction={(action) => handlePlayerAction(player.id, action, true)}
                    onToggleCourt={() => togglePlayerOnCourt(player.id, true)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Time Visitante */}
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {gameStats.awayTeamName}
            </h3>
          </div>
          <div className="p-4">
            {awayTeamPlayers.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Carregando jogadores...
              </p>
            ) : (
              <div className="space-y-1">
                {awayTeamPlayers.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onAction={(action) => handlePlayerAction(player.id, action, false)}
                    onToggleCourt={() => togglePlayerOnCourt(player.id, false)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PlayerCardProps {
  player: PlayerWithStats;
  onAction: (action: 'points1' | 'points2' | 'points3' | 'foul' | 'assist' | 'rebound') => void;
  onToggleCourt: () => void;
}

function PlayerCard({ player, onAction, onToggleCourt }: PlayerCardProps) {
  const playerName = player.nickName || `${player.firstName} ${player.lastName}`;

  return (
    <div
      className={`flex items-center gap-2 rounded border px-3 py-2 text-xs ${
        player.isOnCourt
          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
          : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50'
      }`}
    >
      {/* Botão Em Quadra */}
      <button
        onClick={onToggleCourt}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${
          player.isOnCourt
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
        }`}
        title={player.isOnCourt ? 'Remover da quadra' : 'Adicionar à quadra'}
      >
        <Users className="h-3 w-3" />
      </button>

      {/* Nome do Jogador */}
      <div className="min-w-[120px] shrink-0">
        <span className="font-medium text-gray-900 dark:text-white">
          {player.jerseyNumber && `#${player.jerseyNumber} `}
          {playerName}
        </span>
      </div>

      {/* Estatísticas */}
      <div className="ml-auto flex items-center gap-3 shrink-0">
        <div className="text-center">
          <span className="text-gray-600 dark:text-gray-400">PTS</span>
          <span className="ml-1 font-semibold text-gray-900 dark:text-white">
            {player.points}
          </span>
        </div>
        <div className="text-center">
          <span className="text-gray-600 dark:text-gray-400">FAL</span>
          <span className="ml-1 font-semibold text-gray-900 dark:text-white">
            {player.fouls}
          </span>
        </div>
        <div className="text-center">
          <span className="text-gray-600 dark:text-gray-400">AST</span>
          <span className="ml-1 font-semibold text-gray-900 dark:text-white">
            {player.assists}
          </span>
        </div>
        <div className="text-center">
          <span className="text-gray-600 dark:text-gray-400">REB</span>
          <span className="ml-1 font-semibold text-gray-900 dark:text-white">
            {player.rebounds}
          </span>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onAction('points1')}
          className="h-6 w-6 rounded bg-green-600 text-xs font-medium text-white hover:bg-green-700"
          title="1 ponto"
        >
          +1
        </button>
        <button
          onClick={() => onAction('points2')}
          className="h-6 w-6 rounded bg-blue-600 text-xs font-medium text-white hover:bg-blue-700"
          title="2 pontos"
        >
          +2
        </button>
        <button
          onClick={() => onAction('points3')}
          className="h-6 w-6 rounded bg-purple-600 text-xs font-medium text-white hover:bg-purple-700"
          title="3 pontos"
        >
          +3
        </button>
        <button
          onClick={() => onAction('foul')}
          className="h-6 w-6 rounded bg-red-600 text-xs font-medium text-white hover:bg-red-700"
          title="Falta"
        >
          F
        </button>
        <button
          onClick={() => onAction('assist')}
          className="h-6 w-6 rounded bg-yellow-600 text-xs font-medium text-white hover:bg-yellow-700"
          title="Assistência"
        >
          A
        </button>
        <button
          onClick={() => onAction('rebound')}
          className="h-6 w-6 rounded bg-orange-600 text-xs font-medium text-white hover:bg-orange-700"
          title="Rebote"
        >
          R
        </button>
      </div>
    </div>
  );
}


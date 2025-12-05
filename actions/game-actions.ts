'use server';

import { apiRequest } from './_helpers';
import type {
  GameRequest,
  GameResponse,
  GameStatsResponse,
  PlayerStatsRequest,
  PlayerStatsResponse,
  GameEventRequest,
  GameEvent,
  PageGameResponse,
  GameStatus,
} from '@/types';

/**
 * Cria um novo jogo
 */
export async function createGameAction(data: GameRequest) {
  try {
    const game = await apiRequest<GameResponse>('/games', {
      method: 'POST',
      body: data,
      requireAuth: true,
    });

    return {
      success: true,
      data: game,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar jogo',
    };
  }
}

/**
 * Lista todos os jogos com filtros e paginação
 */
export async function getAllGamesAction(
  page: number = 0,
  size: number = 10,
  filters?: {
    leagueId?: string;
    status?: GameStatus;
    startDate?: string;
    endDate?: string;
  }
) {
  try {
    const params: Record<string, string | number> = {
      page,
      size,
    };

    if (filters?.leagueId) {
      params.leagueId = filters.leagueId;
    }
    if (filters?.status) {
      params.status = filters.status;
    }
    if (filters?.startDate) {
      // Converte de datetime-local (YYYY-MM-DDTHH:mm) para ISO_DATE_TIME (YYYY-MM-DDTHH:mm:ss)
      const startDate = filters.startDate.includes('T')
        ? `${filters.startDate}:00`
        : filters.startDate;
      params.startDate = startDate;
    }
    if (filters?.endDate) {
      // Converte de datetime-local (YYYY-MM-DDTHH:mm) para ISO_DATE_TIME (YYYY-MM-DDTHH:mm:ss)
      const endDate = filters.endDate.includes('T')
        ? `${filters.endDate}:00`
        : filters.endDate;
      params.endDate = endDate;
    }

    const games = await apiRequest<PageGameResponse>('/games', {
      method: 'GET',
      params,
      requireAuth: true,
    });

    return {
      success: true,
      data: games,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar jogos',
      data: null,
    };
  }
}

/**
 * Lista todos os jogos de uma liga
 */
export async function getGamesByLeagueAction(leagueId: string) {
  try {
    const games = await apiRequest<GameResponse[]>(`/games/league/${leagueId}`, {
      method: 'GET',
      requireAuth: true,
    });

    return {
      success: true,
      data: games,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar jogos',
      data: [],
    };
  }
}

/**
 * Busca as estatísticas completas de uma partida
 */
export async function getGameStatsAction(gameId: string) {
  try {
    const stats = await apiRequest<GameStatsResponse>(`/games/${gameId}/stats`, {
      method: 'GET',
      requireAuth: true,
    });

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar estatísticas do jogo',
      data: null,
    };
  }
}

/**
 * Registra as estatísticas de todos os jogadores de uma partida
 */
export async function recordGameStatsAction(gameId: string, stats: PlayerStatsRequest[]) {
  try {
    await apiRequest<unknown>(`/games/${gameId}/stats`, {
      method: 'POST',
      body: stats,
      requireAuth: true,
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao registrar estatísticas',
    };
  }
}

/**
 * Busca as estatísticas de um jogador específico em uma partida
 */
export async function getPlayerStatsInGameAction(gameId: string, playerId: string) {
  try {
    const stats = await apiRequest<PlayerStatsResponse>(
      `/games/${gameId}/players/${playerId}/stats`,
      {
        method: 'GET',
        requireAuth: true,
      }
    );

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar estatísticas do jogador',
      data: null,
    };
  }
}

/**
 * Busca um jogo pelo ID através da lista de jogos
 * Como não há endpoint direto, busca através da lista paginada
 */
export async function getGameByIdAction(gameId: string) {
  try {
    // Busca o jogo na primeira página (assumindo que o jogo existe)
    const gamesResult = await getAllGamesAction(0, 1000);
    
    if (gamesResult.success && gamesResult.data) {
      const game = gamesResult.data.content.find((g) => g.id === gameId);
      
      if (game) {
        return {
          success: true,
          data: game,
        };
      }
    }

    return {
      success: false,
      error: 'Jogo não encontrado',
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar jogo',
      data: null,
    };
  }
}

/**
 * Cria um evento de jogo
 */
export async function createGameEventAction(data: GameEventRequest) {
  try {
    const event = await apiRequest<GameEvent>('/games/events', {
      method: 'POST',
      body: data,
      requireAuth: true,
    });

    return {
      success: true,
      data: event,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar evento de jogo',
    };
  }
}


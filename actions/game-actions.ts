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


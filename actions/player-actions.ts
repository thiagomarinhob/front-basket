'use server';

import { apiRequest } from './_helpers';
import type { Player, PlayerResponse, PagePlayerResponse, PlayerPosition } from '@/types';

/**
 * Cria um novo jogador
 */
export async function createPlayerAction(data: Player) {
  try {
    const result = await apiRequest<unknown>('/players', {
      method: 'POST',
      body: data,
      requireAuth: true,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar jogador',
    };
  }
}

/**
 * Busca todos os jogadores (paginado)
 */
export async function getAllPlayersAction(page: number = 0, size: number = 10) {
  try {
    const players = await apiRequest<PagePlayerResponse>('/players', {
      method: 'GET',
      params: { page, size },
      requireAuth: true,
    });

    return {
      success: true,
      data: players,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar jogadores',
      data: null,
    };
  }
}

/**
 * Busca um jogador pelo ID
 */
export async function getPlayerByIdAction(id: string) {
  try {
    const player = await apiRequest<PlayerResponse>(`/players/${id}`, {
      method: 'GET',
      requireAuth: true,
    });

    return {
      success: true,
      data: player,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar jogador',
      data: null,
    };
  }
}

/**
 * Busca todas as posições disponíveis
 */
export async function getPlayerPositionsAction() {
  try {
    const positions = await apiRequest<PlayerPosition[]>('/players/positions', {
      method: 'GET',
      requireAuth: true,
    });

    return {
      success: true,
      data: positions,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar posições',
      data: null,
    };
  }
}


'use server';

import { apiRequest } from './_helpers';
import type {
  LeagueResponse,
  LeagueRequest,
  TeamStandingsResponse,
  TopScorerResponse,
  ThreePointLeaderResponse,
  PageThreePointLeaderResponse,
  ListTeamResponse,
} from '@/types';

/**
 * Busca todas as ligas
 */
export async function getAllLeaguesAction() {
  try {
    const leagues = await apiRequest<LeagueResponse[]>('/leagues', {
      method: 'GET',
      requireAuth: true,
    });

    return {
      success: true,
      data: leagues,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar ligas',
      data: [],
    };
  }
}

/**
 * Busca uma liga pelo ID
 */
export async function getLeagueByIdAction(id: string) {
  try {
    const league = await apiRequest<LeagueResponse>(`/leagues/${id}`, {
      method: 'GET',
      requireAuth: true,
    });

    return {
      success: true,
      data: league,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar liga',
      data: null,
    };
  }
}

/**
 * Cria uma nova liga
 */
export async function createLeagueAction(data: LeagueRequest) {
  try {
    const result = await apiRequest<unknown>('/leagues', {
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
      error: error instanceof Error ? error.message : 'Erro ao criar liga',
    };
  }
}

/**
 * Busca a tabela de classificação de uma liga
 */
export async function getLeagueStandingsAction(leagueId: string) {
  try {
    const standings = await apiRequest<TeamStandingsResponse[]>(
      `/leagues/${leagueId}/standings`,
      {
        method: 'GET',
        requireAuth: true,
      }
    );

    return {
      success: true,
      data: standings,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar classificação',
      data: [],
    };
  }
}

/**
 * Busca os maiores pontuadores de uma liga
 */
export async function getTopScorersAction(leagueId: string) {
  try {
    const topScorers = await apiRequest<TopScorerResponse[]>(
      `/leagues/${leagueId}/player-stats/top-scorers`,
      {
        method: 'GET',
        requireAuth: true,
      }
    );

    return {
      success: true,
      data: topScorers,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar maiores pontuadores',
      data: [],
    };
  }
}

/**
 * Busca os líderes de cestas de 3 pontos de uma liga (paginado)
 */
export async function getThreePointLeadersAction(
  leagueId: string,
  page: number = 0,
  size: number = 10
) {
  try {
    const leaders = await apiRequest<PageThreePointLeaderResponse>(
      `/leagues/${leagueId}/player-stats/three-point-leaders`,
      {
        method: 'GET',
        params: { page, size },
        requireAuth: true,
      }
    );

    return {
      success: true,
      data: leaders,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar líderes de 3 pontos',
      data: null,
    };
  }
}

/**
 * Lista os times de uma liga
 */
export async function getLeagueTeamsAction(leagueId: string) {
  try {
    const teams = await apiRequest<ListTeamResponse[]>(
      `/leagues/${leagueId}/teams`,
      {
        method: 'GET',
        requireAuth: true,
      }
    );

    return {
      success: true,
      data: teams,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar times da liga',
      data: [],
    };
  }
}

/**
 * Adiciona um time a uma liga
 */
export async function addTeamToLeagueAction(leagueId: string, teamId: string) {
  try {
    const result = await apiRequest<unknown>(
      `/leagues/${leagueId}/teams/${teamId}`,
      {
        method: 'POST',
        requireAuth: true,
      }
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao adicionar time à liga',
    };
  }
}


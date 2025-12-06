'use server';

import { apiRequest } from './_helpers';
import type {
  TeamRequest,
  TeamResponse,
  PageTeamResponse,
  ListPlayersResponse,
  ListCategoryResponse,
  TeamPlayerResponse,
} from '@/types';

/**
 * Cria um novo time
 */
export async function createTeamAction(data: TeamRequest) {
  try {
    const result = await apiRequest<unknown>('/teams', {
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
      error: error instanceof Error ? error.message : 'Erro ao criar time',
    };
  }
}

/**
 * Busca todos os times (paginado)
 */
export async function getAllTeamsAction(page: number = 0, size: number = 10) {
  try {
    const teams = await apiRequest<PageTeamResponse>('/teams', {
      method: 'GET',
      params: { page, size },
      requireAuth: true,
    });

    return {
      success: true,
      data: teams,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar times',
      data: null,
    };
  }
}

/**
 * Busca um time pelo ID
 */
export async function getTeamByIdAction(id: string) {
  try {
    const team = await apiRequest<TeamResponse>(`/teams/${id}`, {
      method: 'GET',
      requireAuth: true,
    });

    return {
      success: true,
      data: team,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar time',
      data: null,
    };
  }
}

/**
 * Lista os jogadores de um time
 */
export async function getTeamPlayersAction(teamId: string) {
  try {
    const players = await apiRequest<ListPlayersResponse[]>(
      `/teams/${teamId}/players`,
      {
        method: 'GET',
        requireAuth: true,
      }
    );

    return {
      success: true,
      data: players,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar jogadores do time',
      data: [],
    };
  }
}

/**
 * Lista os jogadores de um time por categoria
 */
export async function getTeamPlayersByCategoryAction(teamId: string, categoryId: string) {
  try {
    const players = await apiRequest<ListPlayersResponse[]>(
      `/teams/${teamId}/category/${categoryId}/players`,
      {
        method: 'GET',
        requireAuth: true,
      }
    );

    return {
      success: true,
      data: players,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar jogadores por categoria',
      data: [],
    };
  }
}

/**
 * Lista as categorias de um time
 */
export async function getTeamCategoriesAction(teamId: string) {
  try {
    const categories = await apiRequest<ListCategoryResponse[]>(
      `/teams/${teamId}/categories`,
      {
        method: 'GET',
        requireAuth: true,
      }
    );

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar categorias do time',
      data: [],
    };
  }
}

/**
 * Adiciona um jogador a um time
 */
export async function addPlayerToTeamAction(
  teamId: string,
  playerId: string,
  categoryId: string
) {
  try {
    const result = await apiRequest<TeamPlayerResponse>(
      `/teams/${teamId}/player/${playerId}/category/${categoryId}`,
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
      error: error instanceof Error ? error.message : 'Erro ao adicionar jogador ao time',
    };
  }
}

/**
 * Adiciona uma categoria a um time
 */
export async function addCategoryToTeamAction(teamId: string, categoryId: string) {
  try {
    const result = await apiRequest<unknown>(
      `/teams/${teamId}/categories/add/${categoryId}`,
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
      error: error instanceof Error ? error.message : 'Erro ao adicionar categoria ao time',
    };
  }
}

/**
 * Lista os times por categoria
 */
export async function getTeamsByCategoryAction(categoryId: string) {
  try {
    const teams = await apiRequest<TeamResponse[]>(
      `/teams/category/${categoryId}`,
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
      error: error instanceof Error ? error.message : 'Erro ao buscar times por categoria',
      data: [],
    };
  }
}


// Cliente de API para Basket API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth-token');
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  // Adiciona query params se existirem
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  const headers = getAuthHeaders();

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      ...headers,
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token inválido ou expirado
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        window.location.href = '/login';
      }
    }
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  // Alguns endpoints podem retornar 204 (No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Helpers específicos
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number>) =>
    apiRequest<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),

  patch: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Serviços de API específicos
export const authService = {
  signIn: async (email: string, password: string) => {
    return api.post<import('@/types').AuthUserResponse>('/auth/sign-in', {
      email,
      password,
    });
  },
};

export const userService = {
  create: async (data: import('@/types').CreateUserRequest) => {
    return api.post<import('@/types').User>('/users', data);
  },
};

export const leagueService = {
  getAll: async () => {
    return api.get<import('@/types').LeagueResponse[]>('/leagues');
  },
  getById: async (id: string) => {
    return api.get<import('@/types').LeagueResponse>(`/leagues/${id}`);
  },
  create: async (data: import('@/types').LeagueRequest) => {
    return api.post<unknown>('/leagues', data);
  },
  getStandings: async (leagueId: string) => {
    return api.get<import('@/types').TeamStandingsResponse[]>(
      `/leagues/${leagueId}/standings`
    );
  },
  getTopScorers: async (leagueId: string) => {
    return api.get<import('@/types').TopScorerResponse[]>(
      `/leagues/${leagueId}/player-stats/top-scorers`
    );
  },
  getThreePointLeaders: async (
    leagueId: string,
    page = 0,
    size = 10
  ) => {
    return api.get<import('@/types').PageThreePointLeaderResponse>(
      `/leagues/${leagueId}/player-stats/three-point-leaders`,
      { page, size }
    );
  },
  getTeams: async (leagueId: string) => {
    return api.get<import('@/types').ListTeamResponse[]>(
      `/leagues/${leagueId}/teams`
    );
  },
};

export const teamService = {
  getAll: async () => {
    return api.get<import('@/types').TeamResponse[]>('/teams');
  },
  create: async (data: import('@/types').TeamRequest) => {
    return api.post<unknown>('/teams', data);
  },
  getById: async (id: string) => {
    return api.get<import('@/types').TeamResponse>(`/teams/${id}`);
  },
  getPlayers: async (teamId: string) => {
    return api.get<import('@/types').ListPlayersResponse[]>(
      `/teams/${teamId}/players`
    );
  },
  getPlayersByCategory: async (teamId: string, categoryId: string) => {
    return api.get<import('@/types').ListPlayersResponse[]>(
      `/teams/${teamId}/category/${categoryId}/players`
    );
  },
  getCategories: async (teamId: string) => {
    return api.get<import('@/types').ListCategoryResponse[]>(
      `/teams/${teamId}/categories`
    );
  },
  addPlayer: async (teamId: string, playerId: string, categoryId: string) => {
    return api.post<import('@/types').TeamPlayerResponse>(
      `/teams/${teamId}/player/${playerId}/category/${categoryId}`
    );
  },
  addCategory: async (teamId: string, categoryId: string) => {
    return api.post<import('@/types').TeamCategoryResponse>(
      `/teams/${teamId}/categories/add/${categoryId}`
    );
  },
  addToLeague: async (leagueId: string, teamId: string) => {
    return api.post<unknown>(`/leagues/${leagueId}/teams/${teamId}`);
  },
};

export const playerService = {
  create: async (data: import('@/types').Player) => {
    return api.post<unknown>('/players', data);
  },
};

export const categoryService = {
  create: async (data: import('@/types').CategoryRequest) => {
    return api.post<import('@/types').Category>('/categories', data);
  },
};

export const gameService = {
  create: async (data: import('@/types').GameRequest) => {
    return api.post<import('@/types').GameResponse>('/games', data);
  },
  getByLeague: async (leagueId: string) => {
    return api.get<import('@/types').GameResponse[]>(
      `/games/league/${leagueId}`
    );
  },
  getStats: async (gameId: string) => {
    return api.get<import('@/types').GameStatsResponse>(
      `/games/${gameId}/stats`
    );
  },
  recordStats: async (gameId: string, stats: import('@/types').PlayerStatsRequest[]) => {
    return api.post(`/games/${gameId}/stats`, stats);
  },
  getPlayerStats: async (gameId: string, playerId: string) => {
    return api.get<import('@/types').PlayerStatsResponse>(
      `/games/${gameId}/players/${playerId}/stats`
    );
  },
  createEvent: async (data: import('@/types').GameEventRequest) => {
    return api.post<import('@/types').GameEvent>('/games/events', data);
  },
};
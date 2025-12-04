// Tipos baseados na API de Basquete

// ===== USUÁRIOS =====
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

// ===== AUTENTICAÇÃO =====
export interface AuthUserRequest {
  email: string;
  password: string;
}

export interface AuthUserResponse {
  access_token: string;
  expires_in: number;
}

// ===== CATEGORIAS =====
export type CategoryGender = 'MALE' | 'FEMALE';

export interface Category {
  id: string;
  name: string;
  description?: string;
  categoryGender: CategoryGender;
}

export interface CategoryRequest {
  name: string;
  categoryGender: CategoryGender;
  description?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
  categoryGender: CategoryGender;
}

export interface ListCategoryResponse {
  id: string;
  name: string;
  categoryGender: CategoryGender;
}

// ===== TIMES =====
export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logoUrl?: string;
  location?: string;
  description?: string;
  ranking?: number;
  categoryEntityList?: TeamCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamCategory {
  id: string;
  team: Team;
  category: Category;
}

export interface TeamRequest {
  name: string;
  shortName?: string;
  logoUrl?: string;
  location?: string;
  description?: string;
  ranking?: number;
}

export interface TeamResponse {
  id: string;
  name: string;
  shortName?: string;
  logoUrl?: string;
  location?: string;
  description?: string;
  ranking?: number;
  categories: CategoryResponse[];
}

export interface ListTeamResponse {
  id: string;
  name: string;
  logoUrl?: string;
  location?: string;
}

// ===== JOGADORES =====
export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  nickName?: string;
  birthDate: string;
  height?: number;
  jerseyNumber?: number;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerResponse {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  nickName?: string;
  birthDate: string;
  height?: number;
  jerseyNumber?: number;
  photoURL?: string;
}

export interface ListPlayersResponse {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  nickName?: string;
  birthDate: string;
  height?: number;
  jerseyNumber?: number;
  photoURL?: string;
  categoryName?: string;
}

export interface TeamPlayerResponse {
  associationId: string;
  teamId: string;
  teamName: string;
  playerId: string;
  playerName: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  startDate: string;
}

// ===== LIGAS =====
export type LeagueStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED';

export interface League {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  startDate: string;
  endDate?: string;
  status?: LeagueStatus;
  user?: User;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeagueRequest {
  name: string;
  description?: string;
  logoUrl?: string;
  startDate: string;
  endDate?: string;
  categoryId: string;
  userId: string;
}

export interface LeagueResponse {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  startDate: string;
  endDate?: string;
}

// ===== JOGOS =====
export type GameStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Game {
  id: string;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  venue?: string;
  scheduledDate: string;
  status: GameStatus;
  homeScore?: number;
  awayScore?: number;
  currentPeriod?: number;
  periodTime?: number;
  isOvertime?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameRequest {
  leagueId: string;
  homeTeamId: string;
  awayTeamId: string;
  venue?: string;
  scheduledDate: string;
  status?: GameStatus;
}

export interface GameResponse {
  id: string;
  league: {
    id: string;
    name: string;
  };
  homeTeam: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  venue?: string;
  scheduledDate: string;
  status: GameStatus;
  homeScore?: number;
  awayScore?: number;
}

// ===== ESTATÍSTICAS =====
export interface PlayerStatsRequest {
  playerId: string;
  teamId: string;
  points1: number;
  points2: number;
  points3: number;
  fouls: number;
  assists: number;
  rebounds: number;
}

export interface PlayerStatsResponse {
  playerId: string;
  playerName: string;
  teamName: string;
  points1: number;
  points2: number;
  points3: number;
  totalPoints: number;
  fouls: number;
  assists: number;
  rebounds: number;
}

export interface GameStatsResponse {
  gameId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  scheduledDate: string;
  status: GameStatus;
  playerStats: PlayerStatsResponse[];
}

// ===== EVENTOS DE JOGO =====
export type GameEventType = 'POINTS' | 'FOUL' | 'ASSIST' | 'TURNOVER' | 'REBOUND' | 'TIMEOUT';

export interface GameEventRequest {
  gameId: string;
  teamId: string;
  playerId: string;
  eventType: GameEventType;
  eventTime: number;
  points?: number;
}

export interface GameEvent {
  id: string;
  game: Game;
  player: Player;
  team: Team;
  eventType: GameEventType;
  eventTime: number;
  points?: number;
  createdAt: string;
}

// ===== RANKINGS =====
export interface TeamStandingsResponse {
  teamId: string;
  teamName: string;
  teamLogoUrl?: string;
  position: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  points: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDifference: number;
  winningPercentage: number;
}

export interface TopScorerResponse {
  rank: number;
  playerId: string;
  playerName: string;
  teamName: string;
  teamLogoUrl?: string;
  gamesPlayed: number;
  totalPoints: number;
  totalFouls: number;
  totalAssists: number;
  totalRebounds: number;
  pointsPerGame: number;
}

export interface ThreePointLeaderResponse {
  rank: number;
  playerId: string;
  playerName: string;
  teamName: string;
  teamLogoUrl?: string;
  gamesPlayed: number;
  totalThreePointers: number;
  pointsFromThreePointers: number;
  threePointersPerGame: number;
}

export interface PageThreePointLeaderResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: ThreePointLeaderResponse[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PagePlayerResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: PlayerResponse[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PageTeamResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: TeamResponse[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
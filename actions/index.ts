// Exporta todas as actions para facilitar os imports

// Auth
export { loginAction, logoutAction } from './auth-actions';

// Users
export { createUserAction } from './user-actions';

// Leagues
export {
  getAllLeaguesAction,
  getLeagueByIdAction,
  createLeagueAction,
  getLeagueStandingsAction,
  getTopScorersAction,
  getThreePointLeadersAction,
  getLeagueTeamsAction,
  addTeamToLeagueAction,
} from './league-actions';

// Teams
export {
  createTeamAction,
  getAllTeamsAction,
  getTeamByIdAction,
  getTeamPlayersAction,
  getTeamPlayersByCategoryAction,
  getTeamCategoriesAction,
  addPlayerToTeamAction,
  addCategoryToTeamAction,
} from './team-actions';

// Players
export {
  createPlayerAction,
  getAllPlayersAction,
  getPlayerByIdAction,
} from './player-actions';

// Categories
export { createCategoryAction } from './category-actions';

// Games
export {
  createGameAction,
  getGamesByLeagueAction,
  getGameStatsAction,
  recordGameStatsAction,
  getPlayerStatsInGameAction,
  createGameEventAction,
} from './game-actions';


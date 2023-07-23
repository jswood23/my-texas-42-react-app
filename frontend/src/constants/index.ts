import type { GameState, ProfileData, UserData } from '../types'

export const apiContext = 'mytexas42api'

export const CONNECTION_STATES = {
  connecting: 'Connecting',
  open: 'Open',
  closing: 'Closing',
  closed: 'Closed',
  uninstantiated: 'Uninstantiated'
}

export const defaultGameState: GameState = {
  match_name: '',
  match_invite_code: '',
  rules: [],
  team_1: [],
  team_2: [],
  current_round: 0,
  current_starting_bidder: 0,
  current_is_bidding: true,
  current_player_turn: 0,
  current_round_rules: [],
  player_dominoes: '',
  current_team_1_round_score: 0,
  current_team_2_round_score: 0,
  current_team_1_total_score: 0,
  current_team_2_total_score: 0,
  current_round_history: [],
  total_round_history: []
}

export const defaultProfileData: ProfileData = {
  game_history: [],
  games_played: 0,
  games_won: 0,
  rounds_played: 0,
  rounds_won: 0,
  total_points_as_bidder: 0,
  total_rounds_as_bidder: 0,
  total_points_as_support: 0,
  total_rounds_as_support: 0,
  total_points_as_counter: 0,
  total_rounds_as_counter: 0
}

export const defaultUserData: UserData = {
  exists: false,
  attributes: {
    email: 'default@email.com',
    email_verified: false,
    sub: '12345'
  },
  username: ''
}

export const EMPTY_MEMBER_TEXT = '--empty--'

export const GAME_STAGES = {
  IN_GAME_LOADING: 'in-game loading',
  IN_GAME_STAGE: 'in-game',
  LOADING_STATE: 'loading',
  LOBBY_LOADING: 'lobbies loading',
  LOBBY_STAGE: 'lobbies',
  NEW_GAME_LOADING: 'new-game loading',
  NEW_GAME_STAGE: 'new-game'
}

export const INVITE_CODE_LENGTH = 6

export const ITEMS_PER_PAGE = 4

export const requireLoginPages = ['/profile']

export const SERVER_MESSAGE_TYPES = {
  chat: 'chat',
  gameUpdate: 'game-update'
}

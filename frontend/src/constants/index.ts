import type { ProfileData, UserData } from '../types'

export const apiContext = 'mytexas42api'

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
  username: ''
}

export const GAME_STAGES = {
  IN_GAME_STAGE: 'in-game',
  LOADING_STATE: 'loading',
  LOBBY_STAGE: 'lobbies',
  NEW_GAME_STAGE: 'new-game'
}

export const requireLoginPages = ['/profile']

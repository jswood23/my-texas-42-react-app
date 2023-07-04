import type { ProfileData, UserData } from '../types'

export const requireLoginPages = ['/profile']

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

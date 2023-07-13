export interface LobbyInfo {
  match_id: string
  match_name: string
  match_invite_code: string
  match_privacy: number
  rules: string[]
  team_1: string[]
  team_2: string[]
}

export type OpenAlert = (message: string, severity: string) => void

export interface ProfileData {
  friends?: string[]
  incoming_friend_requests?: string[]
  is_admin?: boolean
  game_history: string[]
  games_played: number
  games_won: number
  rounds_played: number
  rounds_won: number
  total_points_as_bidder: number
  total_rounds_as_bidder: number
  total_points_as_support: number
  total_rounds_as_support: number
  total_points_as_counter: number
  total_rounds_as_counter: number
}

export interface Rule {
  rule_name: string
  rule_description: string
  excludes: string[]
  requires: string[]
}

export interface UserData {
  exists: boolean
  readonly attributes: {
    email: string
    email_verified: boolean
    sub: string
  }
  readonly username: string
}

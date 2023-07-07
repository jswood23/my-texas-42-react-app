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
  readonly username: string
}

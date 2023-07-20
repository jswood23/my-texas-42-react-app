import type { ReadyState } from 'react-use-websocket'
import type { SendJsonMessage } from 'react-use-websocket/dist/lib/types'

export interface ChatMessage {
  message?: string
  username: string
}

export interface GameState {
  match_name: string
  match_invite_code: string
  rules: string[]
  team_1: string[]
  team_2: string[]
  current_round: number
  current_starting_bidder: number
  current_is_bidding: boolean
  current_player_turn: number
  current_round_rules: string[]
  player_dominoes: string
  current_team_1_round_score: number
  current_team_2_round_score: number
  current_team_1_total_score: number
  current_team_2_total_score: number
  current_round_history: string[]
  total_round_history: string[][]
}

export interface ServerMessage extends ChatMessage {
  gameData?: GameState
  messageType?: string
}

export interface WebSocketConnection {
  connectionStatus: string
  lastMessage?: any
  sendJsonMessage: SendJsonMessage
  socketUrl: string
  setSocketUrl: (url: string) => void
  queryParams: any
  readyState: ReadyState
  setQueryParams: (params: any) => void
}

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

export interface GlobalObj {
  connection: WebSocketConnection
  openAlert: OpenAlert
  userData: UserData
}

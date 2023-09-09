import type { GameState } from '../types'

export const MOVE_TYPES = {
  bid: 'bid',
  call: 'call',
  play: 'play'
}

export const defaultGameState: GameState = {
  match_name: '',
  match_invite_code: '',
  rules: [],
  team_1: ['Player 1', 'Player 3'],
  team_2: ['jswood23', 'Player 2'],
  current_round: 0,
  current_starting_bidder: 0,
  current_starting_player: 0,
  current_is_bidding: true,
  current_player_turn: 0,
  current_round_rules: '',
  player_dominoes: ['6-1', '6-2', '6-3', '6-4', '6-5', '6-0', '6-6'],
  current_team_1_round_score: 0,
  current_team_2_round_score: 0,
  current_team_1_total_score: 0,
  current_team_2_total_score: 0,
  current_round_history: [],
  total_round_history: []
}
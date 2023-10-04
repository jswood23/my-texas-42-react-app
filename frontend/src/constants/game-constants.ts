import type { GameState } from '../types'

export const defaultGameState: GameState = {
  match_name: '',
  match_invite_code: '',
  rules: [],
  team_1: [],
  team_2: [],
  current_round: 0,
  current_starting_bidder: 1,
  current_starting_player: 1,
  current_player_turn: 1,
  current_is_bidding: false,
  current_round_rules: '',
  player_dominoes: [],
  current_team_1_round_score: 0,
  current_team_2_round_score: 0,
  current_team_1_total_score: 0,
  current_team_2_total_score: 0,
  current_round_history: [],
  total_round_history: []
}

export const MOVE_TYPES = {
  bid: 'bid',
  call: 'call',
  play: 'play'
}

export const RULES = {
  NO_FORCED_BID: 'No forced bid',
  FORCED_31_BID: 'Forced 31 bid',
  FORCED_NIL: 'Forced Nil',
  NIL_2_MARK: '2-mark Nil',
  SPLASH_2_MARK: '2-mark Splash',
  PLUNGE_2_MARK: '2-mark Plunge',
  SEVENS_2_MARK: '2-mark Sevens',
  DELVE: 'Delve',
  NIL: 'Nil',
  SPLASH: 'Splash',
  PLUNGE: 'Plunge',
  SEVENS: 'Sevens',
  DOUBLES_HIGH: 'Doubles-high',
  DOUBLES_LOW: 'Doubles-low',
  DOUBLES_OWN_SUIT: 'Doubles-own-suit',
  DOUBLES_TRUMP: 'Doubles-trump',
  FOLLOW_ME: 'Follow-me',
  UNDECIDED: 'Undecided'
}

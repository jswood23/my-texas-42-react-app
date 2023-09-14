import type { GameState } from '../types'

const roundRules = {
  bid: 31,
  biddingTeam: 1,
  trump: 'Follow-me',
  variant: ''
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
  current_player_turn: 0,
  current_is_bidding: true,
  current_round_rules: roundRules, // roundRules or empty string
  player_dominoes: ['6-1', '6-2', '6-3', '6-4', '6-5', '6-0', '6-6'],
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

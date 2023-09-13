import type { GameState } from '../../../../../types'
import { RULES } from '../../../../../constants/game-constants'

export const getBidString = (bid: number) => {
  if (bid === 0) {
    return 'pass'
  } else if (bid % 42 === 0) {
    return `${(bid / 42)}-mark`
  }
  return bid.toString()
}

export const getIsCalling = (lobby: GameState) => {
  if (typeof lobby.current_round_rules === 'string') {
    return false
  }

  return !lobby.current_is_bidding &&
    lobby.current_round_rules.trump === RULES.UNDECIDED
}

export const getUserPosition = (gameState: GameState, username: string) => {
  if (gameState.team_1.includes(username)) {
    return gameState.team_1.indexOf(username) * 2
  } else if (gameState.team_2.includes(username)) {
    return gameState.team_2.indexOf(username) * 2 + 1
  }
  return -1
}

export const replaceGameString = (gameString: string) => {
  const gameStrings: string[] = [RULES.DOUBLES_TRUMP, RULES.FOLLOW_ME, RULES.DOUBLES_LOW, RULES.DOUBLES_HIGH, RULES.DOUBLES_OWN_SUIT]
  const replaced: string[] = ['doubles', 'follow me', 'doubles are low', 'doubles are high', 'doubles are a suit of their own']
  const index = gameStrings.indexOf(gameString)
  if (index > -1) return replaced[index]
  return gameString
}

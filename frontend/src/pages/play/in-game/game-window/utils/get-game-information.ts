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

export const getCurrentHighestBid = (currentRoundHistory: string[]) => {
  let highestBid = 0

  currentRoundHistory.forEach(move => {
    if (move.includes('\\')) {
      highestBid = Math.max(highestBid, +move.split('\\')[2])
    }
  })

  return highestBid
}

export const getDoublesInHand = (playerHand: string[]) => {
  let doublesInHand = 0
  playerHand.forEach(domino => {
    const sides = domino.split('-')
    if (sides[0] === sides[1]) {
      doublesInHand += 1
    }
  })
  return doublesInHand
}

export const getIsCalling = (lobby: GameState) => {
  if (typeof lobby.current_round_rules === 'string') {
    return false
  }

  return !lobby.current_is_bidding &&
    lobby.current_round_rules.trump === RULES.UNDECIDED
}

export const getMostCommonSuit = (playerHand: string[]) => {
  const suitCounts: number[] = Array(7).fill(0)

  // note: we are counting each double as 2 of its suit instead of 1
  playerHand.forEach(domino => {
    domino.split('-').forEach(side => {
      suitCounts[(+side)] += 1
    })
  })

  // get side with the highest count
  // get the higher side when there is a tie
  let index = -1
  let count = -1
  for (let i = 0; i < suitCounts.length; i += 1) {
    if (suitCounts[i] >= count) {
      index = i
      count = suitCounts[i]
    }
  }

  return index
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
  const replaced: string[] = ['doubles are trump', 'follow me', 'doubles are low', 'doubles are high', 'doubles are a suit of their own']
  const index = gameStrings.indexOf(gameString)
  if (index > -1) return replaced[index]
  return gameString
}

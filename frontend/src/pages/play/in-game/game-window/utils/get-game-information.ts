import { type GameState } from '../../../../../types'

export const getUserPosition = (gameState: GameState, username: string) => {
  if (gameState.team_1.includes(username)) {
    return gameState.team_1.indexOf(username) * 2
  } else if (gameState.team_2.includes(username)) {
    return gameState.team_2.indexOf(username) * 2 + 1
  }
  return -1
}

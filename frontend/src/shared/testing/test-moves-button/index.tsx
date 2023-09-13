import { Button } from '@mui/material'
import { type GlobalObj } from '../../../types'
import { getUserPosition } from '../../../pages/play/in-game/game-window/utils/get-game-information'

interface Props {
  globals: GlobalObj
}

const bids = [
  'Player 1\\bid\\31',
  'jswood23\\bid\\84',
  'Player 3\\bid\\0',
  'Player 2\\bid\\126',
  'Player 2 has won the bid.'
]

const plays = [

]

const TestMovesButton = ({ globals }: Props) => {
  const moves = bids

  const nextMove = () => {
    const newGameState = { ...globals.gameState }
    if (newGameState.current_round_history.length < moves.length) {
      const newMove = moves[newGameState.current_round_history.length]

      if (newMove.includes('\\')) {
        newGameState.current_player_turn = (newGameState.current_player_turn + 1) % 4
      } else if (newMove.includes(' has won')) {
        newGameState.current_player_turn = getUserPosition(globals.gameState, newMove.split(' has won')[0])
      }

      newGameState.current_round_history.push(newMove)
    }
    globals.setGameState(newGameState)
  }

  return (
    <Button variant='contained' onClick={nextMove}>
      Next Move
    </Button>
  )
}

export default TestMovesButton

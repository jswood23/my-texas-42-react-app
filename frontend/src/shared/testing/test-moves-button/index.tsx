import { Button } from '@mui/material'
import { type GlobalObj } from '../../../types'

interface Props {
  globals: GlobalObj
}

const moves = [
  'Howdy there!'
]

const TestMovesButton = ({ globals }: Props) => {
  const nextMove = () => {
    const newGameState = { ...globals.gameState }
    if (newGameState.current_round_history.length < moves.length) {
      newGameState.current_round_history.push(moves[newGameState.current_round_history.length])
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

import { getCurrentHighestBid } from '../utils/get-game-information'
import type { GlobalObj } from '../../../../../types'
import * as React from 'react'
import GameButton from '../../../../../shared/game-button'
import { pos } from '../utils/helpers'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
}

const ShowBiddingOptions = ({ globals, windowHeight, windowWidth }: Props) => {
  const currentHighestBid = React.useMemo(() => getCurrentHighestBid(globals.gameState.current_round_history), [globals.gameState.current_round_history])

  return (
    <GameButton
      xpos={pos(50, windowWidth)}
      ypos={pos(50, windowHeight)}
      width={pos(10, windowWidth)}
      height={pos(5, windowHeight)}
      fontSize={pos(2, windowWidth)}
      text='howdy there'
      onClick={() => { console.log('click me') }}
    />
  )
}

export default ShowBiddingOptions

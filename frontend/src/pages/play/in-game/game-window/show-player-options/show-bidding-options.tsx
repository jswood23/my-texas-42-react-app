import { getCurrentHighestBid } from '../utils/get-game-information'
import type { GlobalObj } from '../../../../../types'
import * as React from 'react'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
}

const ShowBiddingOptions = ({ globals, windowHeight, windowWidth }: Props) => {
  const currentHighestBid = React.useMemo(() => getCurrentHighestBid(globals.gameState.current_round_history), [globals.gameState.current_round_history])

  // console.log(currentHighestBid)

  return <></>
}

export default ShowBiddingOptions

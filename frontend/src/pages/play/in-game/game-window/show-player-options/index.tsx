import { getIsCalling, getUserPosition } from '../utils/get-game-information'
import type { GlobalObj } from '../../../../../types'
import * as React from 'react'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
}

const ShowPlayerOptions = ({ globals, windowHeight, windowWidth }: Props) => {
  const userPosition = React.useMemo(() => getUserPosition(globals.gameState, globals.userData.username), [globals.gameState.team_1, globals.gameState.team_2, globals.userData.username])

  const showOptions = React.useCallback(() => {
    if (globals.gameState.current_player_turn !== userPosition) {
      return <></>
    }

    if (globals.gameState.current_is_bidding) {
      // return bidding options
      return <></>
    }

    if (getIsCalling(globals.gameState)) {
      // return calling options
      return <></>
    }

    // return play button
    return <></>
  }, [globals.gameState, userPosition])

  return (
    <>
      {showOptions()}
    </>
  )
}

export default ShowPlayerOptions

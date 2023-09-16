import type { DominoObj, GlobalObj } from '../../../../../types'
import { getIsCalling, getUserPosition } from '../utils/get-game-information'
import * as React from 'react'
import ShowBiddingOptions from './show-bidding-options'
import ShowCallingOptions from './show-calling-options'
import ShowPlayButton from './show-play-button'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
  stagedDomino: DominoObj | null | undefined
  setStagedDomino: React.Dispatch<React.SetStateAction<DominoObj | null | undefined>>
}

const ShowPlayerOptions = ({ globals, windowHeight, windowWidth, stagedDomino, setStagedDomino }: Props) => {
  const userPosition = React.useMemo(() => getUserPosition(globals.gameState, globals.userData.username), [globals.gameState.team_1, globals.gameState.team_2, globals.userData.username])

  const showOptions = React.useCallback(() => {
    if (globals.gameState.current_player_turn !== userPosition) {
      return <></>
    }

    if (globals.gameState.current_is_bidding) {
      // return bidding options
      return <ShowBiddingOptions globals={globals} windowHeight={windowHeight} windowWidth={windowWidth} />
    }

    if (getIsCalling(globals.gameState)) {
      // return calling options
      return <ShowCallingOptions globals={globals} windowHeight={windowHeight} windowWidth={windowWidth} />
    }

    // return play button
    return <ShowPlayButton globals={globals} windowHeight={windowHeight} windowWidth={windowWidth} stagedDomino={stagedDomino} setStagedDomino={setStagedDomino} />
  }, [globals.gameState, userPosition, stagedDomino, setStagedDomino])

  return (
    <>
      {showOptions()}
    </>
  )
}

export default ShowPlayerOptions

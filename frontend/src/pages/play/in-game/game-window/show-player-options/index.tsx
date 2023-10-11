import type { DominoObj, GlobalObj, ServerMessage } from '../../../../../types'
import { getIsCalling } from '../utils/get-game-information'
import { pos } from '../utils/helpers'
import GameSpinner from '../../../../../shared/game-spinner'
import * as React from 'react'
import ShowBiddingOptions from './show-bidding-options'
import ShowCallingOptions from './show-calling-options'
import ShowPlayButton from './show-play-button'
import { SERVER_MESSAGE_TYPES } from '../../../../../constants'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
  stagedDomino: DominoObj | null | undefined
  lastServerMessage: ServerMessage
}

const ShowPlayerOptions = ({ globals, windowHeight, windowWidth, stagedDomino, lastServerMessage }: Props) => {
  const [hasPlayed, setHasPlayed] = React.useState(false)
  const [stage, setStage] = React.useState(1)

  React.useEffect(() => {
    if (globals.gameState.current_is_bidding) {
      setStage(1)
    } else if (getIsCalling(globals.gameState)) {
      setStage(2)
    } else {
      setStage(3)
    }

    setHasPlayed(false)
  }, [globals.gameState.current_is_bidding, globals.gameState.current_round_rules])

  React.useEffect(() => {
    if (lastServerMessage?.messageType === SERVER_MESSAGE_TYPES.gameError) {
      setHasPlayed(false)
    }
  }, [lastServerMessage])

  const showGameSpinner = () => {
    return (
      <>
        <GameSpinner
          xpos={pos(50, windowWidth)}
          ypos={pos(50, windowHeight)}
          size={pos(5, windowWidth)}
        />
      </>
    )
  }

  const showOptions = React.useCallback(() => {
    if (hasPlayed) {
      return showGameSpinner()
    }

    switch (stage) {
      case 1:
        return <ShowBiddingOptions globals={globals} windowHeight={windowHeight} windowWidth={windowWidth} setHasPlayed={setHasPlayed} />
      case 2:
        return <ShowCallingOptions globals={globals} windowHeight={windowHeight} windowWidth={windowWidth} setHasPlayed={setHasPlayed} />
      default:
        return <ShowPlayButton globals={globals} windowHeight={windowHeight} windowWidth={windowWidth} stagedDomino={stagedDomino} setHasPlayed={setHasPlayed} />
    }
  }, [hasPlayed, globals.gameState, stage, stagedDomino])

  return (
    <>
      {showOptions()}
    </>
  )
}

export default ShowPlayerOptions

import { getBidString, getCurrentHighestBid } from '../utils/get-game-information'
import type { GlobalObj } from '../../../../../types'
import * as React from 'react'
import GameButton from '../../../../../shared/game-button'
import { pos } from '../utils/helpers'
import { MOVE_TYPES } from '../../../../../constants/game-constants'
import GameNumberPicker from '../../../../../shared/game-number-picker'
import GameSpinner from '../../../../../shared/game-spinner'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
}

const ShowBiddingOptions = ({ globals, windowHeight, windowWidth }: Props) => {
  const [hasBid, setHasBid] = React.useState(false)
  const [hasWaited, setHasWaited] = React.useState(false)
  const currentHighestBid = React.useMemo(() => getCurrentHighestBid(globals.gameState.current_round_history), [globals.gameState.current_round_history])
  const showNumericBid = currentHighestBid < 42
  const markBid = showNumericBid ? 84 : currentHighestBid + 42
  const lowestAllowedBid = Math.max(30, currentHighestBid + 1)
  const movesSoFar = globals.gameState.current_round_history.length
  const showBiddingOptions = hasWaited && !hasBid

  React.useEffect(() => {
    if (movesSoFar === 0) {
      setHasWaited(false)
    } else {
      setHasWaited(true)
    }
  }, [movesSoFar, setHasWaited])

  React.useEffect(() => {
    if (!hasWaited) {
      setTimeout(() => { setHasWaited(true) }, 1900)
    }
  }, [hasWaited, setHasWaited])

  const xPositions = React.useMemo(() => {
    if (!showNumericBid) {
      return [44 - 8, 0, 44 + 8]
    }
    return [44 - 18, 41, 44 + 18]
  }, [showNumericBid])

  const makeBid = (bid: number) => {
    globals.connection.sendJsonMessage({ action: 'play_turn', data: JSON.stringify({ move: bid, moveType: MOVE_TYPES.bid }) })
    setHasBid(true)
  }

  const showButtons = () => {
    return (
      <>
        <GameButton
          xpos={pos(xPositions[0], windowWidth)}
          ypos={pos(60, windowHeight)}
          width={pos(12, windowWidth)}
          height={pos(6, windowHeight)}
          fontSize={pos(2, windowWidth)}
          text={getBidString(0)}
          onClick={() => {
            makeBid(0)
          }}
        />
        {showNumericBid &&
          <GameNumberPicker
            xpos={pos(xPositions[1], windowWidth)}
            ypos={pos(60, windowHeight)}
            width={pos(18, windowWidth)}
            height={pos(6, windowHeight)}
            fontSize={pos(3, windowWidth)}
            onChoose={makeBid}
            min={lowestAllowedBid}
            max={42}
          />
        }
        <GameButton
          xpos={pos(xPositions[2], windowWidth)}
          ypos={pos(60, windowHeight)}
          width={pos(12, windowWidth)}
          height={pos(6, windowHeight)}
          fontSize={pos(2, windowWidth)}
          text={getBidString(markBid)}
          onClick={() => {
            makeBid(markBid)
          }}
        />
      </>
    )
  }

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

  return (
    <>
      {showBiddingOptions && showButtons()}
      {hasBid && showGameSpinner()}
    </>
  )
}

export default ShowBiddingOptions

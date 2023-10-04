import type { DominoObj, GlobalObj } from '../../../../../types'
import { MOVE_TYPES } from '../../../../../constants/game-constants'
import { pos } from '../utils/helpers'
import * as React from 'react'
import GameButton from '../../../../../shared/game-button'
import GameSpinner from '../../../../../shared/game-spinner'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
  stagedDomino: DominoObj | null | undefined
  setHasPlayed: React.Dispatch<React.SetStateAction<boolean>>
}

const ShowPlayButton = ({ globals, windowHeight, windowWidth, stagedDomino, setHasPlayed }: Props) => {
  const disablePlayButton = React.useMemo(() => { return !stagedDomino }, [stagedDomino])

  const onClickPlay = () => {
    globals.connection.sendJsonMessage({ action: 'play_turn', data: JSON.stringify({ move: stagedDomino?.type, moveType: MOVE_TYPES.play }) })
    setHasPlayed(true)
  }

  return (
    <>
      <GameButton
        xpos={pos(44, windowWidth)}
        ypos={pos(64.5, windowHeight)}
        width={pos(12, windowWidth)}
        height={pos(6, windowHeight)}
        text='Play'
        fontSize={pos(2, windowWidth)}
        disabled={disablePlayButton}
        onClick={onClickPlay}
      />
    </>
  )
}

export default ShowPlayButton

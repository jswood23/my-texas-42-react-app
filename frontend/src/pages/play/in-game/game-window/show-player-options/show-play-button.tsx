import type { DominoObj, GlobalObj } from '../../../../../types'
import { pos } from '../utils/helpers'
import GameButton from '../../../../../shared/game-button'
import * as React from 'react'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
  stagedDomino: DominoObj | null | undefined
  setStagedDomino: React.Dispatch<React.SetStateAction<DominoObj | null | undefined>>
}

const ShowPlayButton = ({ globals, windowHeight, windowWidth, stagedDomino, setStagedDomino }: Props) => {
  const disablePlayButton = React.useMemo(() => { return !stagedDomino }, [stagedDomino])

  const onClickPlay = () => {
    console.log('click me')
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

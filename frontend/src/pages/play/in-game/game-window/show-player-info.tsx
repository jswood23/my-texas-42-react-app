import { type GlobalObj } from '../../../../types'
import * as React from 'react'
import { getUserPosition } from './utils/get-game-information'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
}

const ShowPlayerInfo = ({ globals, windowHeight, windowWidth }: Props) => {
  const userPosition = React.useMemo(() => getUserPosition(globals.gameState, globals.userData.username), [globals.gameState.team_1, globals.gameState.team_2])

  return (
    <>
    </>
  )
}

export default ShowPlayerInfo

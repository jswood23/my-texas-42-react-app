import { getUserPosition } from './utils/get-game-information'
import { type GlobalObj } from '../../../../types'
import { limitString } from '../../../../utils/string-utils'
import { pos } from './utils/helpers'
import { Typography } from '@mui/material'
import * as React from 'react'
import styled from 'styled-components'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
}

interface StyledProps {
  xpos: number
  ypos: number
  width: number
  height: number
}

const StyledRoot = styled.div<StyledProps>(({ xpos, ypos, width, height }) => {
  return ({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: `${xpos}px`,
    top: `${ypos}px`,
    width: `${width}px`,
    height: `${height}px`
  })
})

const ShowPlayerInfo = ({ globals, windowHeight, windowWidth }: Props) => {
  const userPosition = React.useMemo(() => getUserPosition(globals.gameState, globals.userData.username), [globals.gameState.team_1, globals.gameState.team_2, globals.userData.username])
  const gameState = globals.gameState

  const displayOtherPlayerUsernames = () => {
    if (userPosition === -1) return <></>

    const players = [gameState.team_1[0], gameState.team_2[0], gameState.team_1[1], gameState.team_2[1]]
    const usernameList = []
    const positions = [[0, 30], [35, 13], [70, 30]]
    let i = (userPosition + 1) % 4
    while (i !== userPosition) {
      usernameList.push(players[i])
      i = (i + 1) % 4
    }

    i = -1
    return usernameList.map(username => {
      i += 1
      return (
        <StyledRoot
          key={`username-${username}`}
          xpos={pos(positions[i][0], windowWidth)}
          ypos={pos(positions[i][1], windowHeight)}
          width={pos(30, windowWidth)}
          height={pos(10, windowHeight)}
        >
          <Typography>
            {limitString(username, 26)}
          </Typography>
        </StyledRoot>
      )
    })
  }

  return (
    <>
      {displayOtherPlayerUsernames()}
    </>
  )
}

export default ShowPlayerInfo

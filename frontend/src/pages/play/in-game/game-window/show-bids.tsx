import { Box, Typography } from '@mui/material'
import { getBidString, getIsCalling, getUserPosition } from './utils/get-game-information'
import { type GlobalObj } from '../../../../types'
import { pos } from './utils/helpers'
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

const StyledBox = styled(Box)<StyledProps>(({ theme, xpos, ypos, width, height }) => {
  return ({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: `${xpos}px`,
    top: `${ypos}px`,
    width: `${width}px`,
    height: `${height}px`,
    '.player-bid': {
      color: theme.palette.light.main,
      fontSize: theme.spacing(2),
      fontStyle: 'italic',
      userSelect: 'none'
    }
  })
})

const ShowBids = ({ globals, windowHeight, windowWidth }: Props) => {
  const shouldShowBids = React.useMemo(() => globals.gameState.current_is_bidding || getIsCalling(globals.gameState), [globals.gameState])
  const userPosition = React.useMemo(() => getUserPosition(globals.gameState, globals.userData.username), [globals.gameState.team_1, globals.gameState.team_2, globals.userData.username])

  const displayBids = React.useCallback(() => {
    const bids: string[] = []
    const positions = [[40, 60], [20, 45], [40, 30], [60, 45]]

    const bidsSoFar = Math.min(4, globals.gameState.current_round_history.length)

    for (let i = 0; i < bidsSoFar; i += 1) {
      const bid = +(globals.gameState.current_round_history[i].split('\\')[2])
      bids.push(getBidString(bid))
    }

    let i = -1
    return bids.map(bid => {
      i += 1

      const x = (i - userPosition + globals.gameState.current_starting_bidder + 4) % 4

      return (
        <StyledBox
          key={`player-bid-${i}`}
          xpos={pos(positions[x][0], windowWidth)}
          ypos={pos(positions[x][1], windowHeight)}
          width={pos(20, windowWidth)}
          height={pos(10, windowHeight)}
        >
          <Typography className='player-bid'>{bid}</Typography>
        </StyledBox>
      )
    })
  }, [globals.gameState.current_starting_bidder, globals.gameState.current_round_history, globals.userData.username])

  return (
    <>
      {shouldShowBids && displayBids()}
    </>
  )
}

export default ShowBids

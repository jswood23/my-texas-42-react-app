import { Box } from '@mui/material'
import { type GlobalObj } from '../../../../types'
import { pos } from './utils/helpers'
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
  isleftaligned: string
}

const StyledBox = styled(Box)<StyledProps>(({ theme, xpos, ypos, width, height, isleftaligned }) => {
  const isLeftAligned = isleftaligned === 'true'
  const borderStyle = '1px solid #A0A0A0'
  return ({
    position: 'absolute',
    left: `${xpos}px`,
    top: `${ypos}px`,
    width: `${width}px`,
    height: `${height}px`,

    borderBottom: borderStyle,
    borderRight: isLeftAligned ? borderStyle : 'none',
    borderLeft: isLeftAligned ? 'none' : borderStyle
  })
})

const ShowTeamInfo = ({ globals, windowHeight, windowWidth }: Props) => {
  const showTeam = (teamNumber: number, usernames: string[], marks: number, points: number) => {
    const x = 70 * (teamNumber - 1)
    return (
      <StyledBox
        xpos={pos(x, windowWidth)}
        ypos={0}
        width={pos(30, windowWidth)}
        height={pos(30, windowHeight)}
        isleftaligned={(x === 0).toString()}
      >

      </StyledBox>
    )
  }

  return (
    <>
      {showTeam(1, globals.gameState.team_1, 0, 0)}
      {showTeam(2, globals.gameState.team_2, 0, 0)}
    </>
  )
}

export default ShowTeamInfo

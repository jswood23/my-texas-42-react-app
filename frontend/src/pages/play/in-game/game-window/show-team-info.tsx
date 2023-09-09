import { Box, Typography } from '@mui/material'
import { type GlobalObj } from '../../../../types'
import { limitString } from '../../../../utils/string-utils'
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

    boxShadow: '0 2px 5px 3px #E0E0E0',
    borderRadius: '5px',
    borderBottom: borderStyle,
    borderRight: isLeftAligned ? borderStyle : 'none',
    borderLeft: isLeftAligned ? 'none' : borderStyle,
    padding: theme.spacing(0.5),

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    userSelect: 'none',

    '.team-marks': {
      fontSize: theme.spacing(2)
    },
    '.team-usernames': {
      color: theme.palette.light.main,
      fontSize: theme.spacing(1.5),
      fontStyle: 'italic'
    },
    '.team-points': {
      color: 'black',
      fontSize: theme.spacing(2)
    }
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
        <Typography className='team-marks'>
          Team {teamNumber}: <strong>{marks}</strong>
        </Typography>
        <Typography className='team-usernames'>
          {usernames.map(username => limitString(username, 14)).join(', ')}
        </Typography>
        <Typography className='team-points'>
          {points} point{points !== 1 && 's'}
        </Typography>
      </StyledBox>
    )
  }

  return (
    <>
      {showTeam(1, globals.gameState.team_1, globals.gameState.current_team_1_total_score, globals.gameState.current_team_1_round_score)}
      {showTeam(2, globals.gameState.team_2, globals.gameState.current_team_2_total_score, globals.gameState.current_team_2_round_score)}
    </>
  )
}

export default ShowTeamInfo

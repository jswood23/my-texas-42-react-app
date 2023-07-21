import { EMPTY_MEMBER_TEXT } from '../../../constants'
import type { GameState, GlobalObj } from '../../../types'
import { Typography } from '@mui/material'
import styled from 'styled-components'

const StyledRoot = styled.div(({ theme }) => ({
  width: '100%',
  height: '100%',

  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  '.waiting-text': {
    color: theme.palette.light.main,
    fontSize: theme.spacing(3),
    fontStyle: 'italic',
    userSelect: 'none'
  },
  '.teams-container': {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    width: '100%'
  },
  '.team-title-text': {
    fontSize: theme.spacing(2.5),
    userSelect: 'none'
  },
  '.single-team-container': {
    display: 'flex',
    flexBasis: '30%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  '.team-member-text': {
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(0.5),
    userSelect: 'none'
  },
  '.team-member-empty': {
    color: theme.palette.light.main,
    fontSize: theme.spacing(2),
    fontStyle: 'italic',
    marginTop: theme.spacing(0.5),
    userSelect: 'none'
  }
}))

interface Props {
  gameState: GameState
  globals: GlobalObj
}

const LobbyWaitingScreen = ({ gameState, globals }: Props) => {
  const displayTeam = (teamMembers: string[]) => {
    const withEmpty = Object.assign([], teamMembers)
    while (withEmpty.length < 2) {
      withEmpty.push(EMPTY_MEMBER_TEXT)
    }

    return withEmpty.map((teamMember: string) => {
      const isEmpty = teamMember === EMPTY_MEMBER_TEXT
      return (
        <Typography
          key={`team-member-${teamMember}`}
          className={isEmpty ? 'team-member-empty' : 'team-member-text'}
        >
          {teamMember}
        </Typography>
      )
    })
  }

  return (
    <StyledRoot>
      <Typography className='waiting-text'>Waiting on players...</Typography>
      <div className='teams-container'>
        <div className='single-team-container'>
          <Typography className='team-title-text'>Team 1</Typography>
          {displayTeam(gameState.team_1)}
        </div>
        <div className='single-team-container'>
          <Typography className='team-title-text'>Team 2</Typography>
          {displayTeam(gameState.team_2)}
        </div>
      </div>
    </StyledRoot>
  )
}

export default LobbyWaitingScreen

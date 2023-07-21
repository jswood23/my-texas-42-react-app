import { EMPTY_MEMBER_TEXT } from '../../../constants'
import type { GameState, GlobalObj } from '../../../types'
import { Button, Typography } from '@mui/material'
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
  '.switch-teams-button': {
    backgroundColor: theme.palette.primary.alt,
    color: theme.palette.secondary.main,
    fontSize: theme.isMobile ? theme.spacing(2) : theme.spacing(1.5),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    '&:hover': {
      color: theme.palette.secondary.alt,
      backgroundColor: theme.palette.primary.main
    }
  },
  '.teams-container': {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(1.5),
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

    let i = 0
    return withEmpty.map((teamMember: string) => {
      i += 1
      const isEmpty = teamMember === EMPTY_MEMBER_TEXT
      return (
        <Typography
          key={`team-member-${i}`}
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
      <Button
        className='switch-teams-button'
      >
        Switch teams
      </Button>
    </StyledRoot>
  )
}

export default LobbyWaitingScreen

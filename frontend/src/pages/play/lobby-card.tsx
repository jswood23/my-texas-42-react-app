import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { EMPTY_MEMBER_TEXT, GAME_STAGES } from '../../constants'
import type { LobbyInfo, OpenAlert, UserData } from '../../types'
import { limitString } from '../../utils/string-utils'
import styled from 'styled-components'

interface Props {
  lobbyInfo: LobbyInfo
  onChangeStage: (newStage: string) => void
  openAlert: OpenAlert
  userData: UserData
}

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
  padding: theme.spacing(1),
  width: theme.isMobile ? '100%' : '75%',
  '.horizontal-row-item-container': {
    display: 'flex',
    flexBasis: '50%',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  '.horizontal-row-container': {
    display: 'flex',
    width: '100%'
  },
  '.join-lobby-button': {
    backgroundColor: theme.palette.primary.alt,
    color: theme.palette.secondary.main,
    fontSize: theme.isMobile ? theme.spacing(2) : theme.spacing(1.5),
    '&:hover': {
      color: theme.palette.secondary.alt,
      backgroundColor: theme.palette.primary.main
    }
  },
  '.lobby-card-name': {
    fontSize: theme.spacing(1.7),
    fontWeight: 'bold'
  },
  '.lobby-card-rules': {
    color: theme.palette.light.main,
    fontSize: theme.spacing(1.5),
    marginBottom: theme.spacing(1)
  },
  '.team-title-text': {
    width: '100%',
    textAlign: 'center'
  },
  '.team-member-text': {
    textAlign: 'center',
    width: '100%'
  },
  '.team-member-empty': {
    color: theme.palette.light.main,
    textAlign: 'center',
    width: '100%'
  }
}))

const LobbyCard = ({ lobbyInfo, onChangeStage, openAlert, userData }: Props) => {
  const lobbyName = limitString(lobbyInfo.match_name, 30)
  const isTeam1Full = lobbyInfo.team_1.length >= 2
  const isTeam2Full = lobbyInfo.team_2.length >= 2

  const displayRules = () => {
    let rulesStr = 'Rules: '
    const rules: string[] = lobbyInfo.rules
    const n = rules.length

    for (let i = 0; i < n; i++) {
      rulesStr += rules[i]
      if (i < n - 1) rulesStr += ', '
    }

    return <Typography className="lobby-card-rules">{rulesStr}</Typography>
  }

  const displayTeam = (team: string[]) => {
    const teamMembers = Object.assign([], team) // make shallow copy of team list to add --empty-- to
    while (teamMembers.length < 2) {
      teamMembers.push(EMPTY_MEMBER_TEXT)
    }

    let i = 0
    return teamMembers.map((member: string) => {
      const isEmpty = member === EMPTY_MEMBER_TEXT
      i++
      return (
        <Typography
          className={isEmpty ? 'team-member-empty' : 'team-member-text'}
          key={`team-member-${i}`}
        >
          {member}
        </Typography>
      )
    })
  }

  const handleJoinGame = (team: number) => {
    console.log(
      `Joining team ${team} for game with invite code ${lobbyInfo.match_invite_code}`
    )
    onChangeStage(GAME_STAGES.IN_GAME_STAGE)
  }

  return (
    <StyledCard>
      <CardContent>
        <Typography className="lobby-card-name">{lobbyName}</Typography>
        {displayRules()}
        <div className="horizontal-row-container">
          <div className="horizontal-row-item-container">
            <Typography className="team-title-text">Team 1:</Typography>
            {displayTeam(lobbyInfo.team_1)}
          </div>
          <div className="horizontal-row-item-container">
            <Typography className="team-title-text">Team 2:</Typography>
            {displayTeam(lobbyInfo.team_2)}
          </div>
        </div>
      </CardContent>
      <CardActions className="horizontal-row-container">
        <div className="horizontal-row-item-container">
          <Button
            className="join-lobby-button"
            variant="contained"
            disabled={isTeam1Full}
            onClick={() => {
              handleJoinGame(1)
            }}
          >
            Join Team 1
          </Button>
        </div>
        <div className="horizontal-row-item-container">
          <Button
            className="join-lobby-button"
            variant="contained"
            disabled={isTeam2Full}
            onClick={() => {
              handleJoinGame(2)
            }}
          >
            Join Team 2
          </Button>
        </div>
      </CardActions>
    </StyledCard>
  )
}

export default LobbyCard

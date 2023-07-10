import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { EMPTY_MEMBER_TEXT } from '../../constants'
import type { LobbyInfo, OpenAlert, UserData } from '../../types'
import { limitString } from '../../utils/string-utils'
import styled from 'styled-components'

interface Props {
  lobbyInfo: LobbyInfo
  openAlert: OpenAlert
  userData: UserData
}

const StyledCard = styled(Card)(({ theme }) => ({
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
    fontSize: theme.spacing(1.5)
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

const LobbyCard = ({ lobbyInfo, openAlert, userData }: Props) => {
  const lobbyName = limitString(lobbyInfo.match_name, 30)

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
    while (team.length < 2) {
      team.push(EMPTY_MEMBER_TEXT)
    }

    let i = 0
    return team.map((member: string) => {
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
          <Button className="join-lobby-button" variant="contained">
            Join Team 1
          </Button>
        </div>
        <div className="horizontal-row-item-container">
          <Button className="join-lobby-button" variant="contained">
            Join Team 2
          </Button>
        </div>
      </CardActions>
    </StyledCard>
  )
}

export default LobbyCard

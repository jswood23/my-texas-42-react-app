import { AddCircle } from '@mui/icons-material'
import { Button, Divider, TextField, Typography } from '@mui/material'
import { GAME_STAGES } from '../../constants'
import type { OpenAlert, UserData } from '../../types'
import * as React from 'react'
import styled from 'styled-components'

interface Props {
  onChangeStage: (newStage: string) => void
  openAlert: OpenAlert
  userData: UserData
}

const StyledRoot = styled.div(({ theme }) => ({
  '.new-game-button': {
    backgroundColor: theme.palette.primary.alt,
    color: theme.palette.secondary.main,
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(2),
    minHeight: theme.isMobile ? theme.spacing(6) : theme.spacing(4),
    minWidth: theme.spacing(13),
    '&:hover': {
      color: theme.palette.secondary.alt,
      backgroundColor: theme.palette.primary.main
    }
  },
  '.horizontal-centered-item-container': {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  '.invite-code-text-field': {
    fontSize: theme.spacing(1.5)
  },
  '.join-by-invite-button': {
    backgroundColor: theme.palette.primary.alt,
    color: theme.palette.secondary.main,
    fontSize: theme.isMobile ? theme.spacing(2) : theme.spacing(1.5),
    marginLeft: theme.spacing(5),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    '&:hover': {
      color: theme.palette.secondary.alt,
      backgroundColor: theme.palette.primary.main
    }
  },
  '.new-game-icon': {
    marginRight: theme.spacing(1)
  },
  '.or-divider': {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: theme.isMobile ? '75%' : '50%',
    '.or-text': {
      color: theme.palette.light.main,
      fontSize: theme.spacing(2),
      fontStyle: 'italic'
    }
  },
  '.vertical-centered-item-container': {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  }
}))

const Lobbies = ({ onChangeStage, openAlert, userData }: Props) => {
  const [inviteCode, setInviteCode] = React.useState('')

  const onChangeInviteCode = (e: { target: { value: string } }) => {
    setInviteCode(e.target.value)
  }

  const onClickJoinByInvite = () => {
    if (!inviteCode) {
      openAlert('Please enter an invite code.', 'error')
      return
    }
    openAlert(`Joining game with code ${inviteCode}`, 'info')
  }

  const onClickStartNewGame = () => { onChangeStage(GAME_STAGES.NEW_GAME_STAGE) }

  return (
    <StyledRoot>
      <div className="vertical-centered-item-container">
        <Button
          className="new-game-button"
          variant="contained"
          onClick={onClickStartNewGame}
        >
          <AddCircle className="new-game-icon" />
          Start new game
        </Button>
        <Divider className="or-divider">
          <Typography className="or-text">or</Typography>
        </Divider>
        <div className="horizontal-centered-item-container">
          <TextField
            className="invite-code-text-field"
            id="invite-code-text-field"
            label="Enter invite code"
            size="small"
            value={inviteCode}
            onChange={onChangeInviteCode}
          />
          <Button
            className="join-by-invite-button"
            variant="contained"
            onClick={onClickJoinByInvite}
          >
            Join
          </Button>
        </div>
        <Divider className="or-divider">
          <Typography className="or-text">or</Typography>
        </Divider>
      </div>
    </StyledRoot>
  )
}

export default Lobbies

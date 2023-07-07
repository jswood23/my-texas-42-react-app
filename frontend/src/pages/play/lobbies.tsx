import { AddCircle } from '@mui/icons-material'
import { Button, Divider, TextField, Typography } from '@mui/material'
import { GAME_STAGES, INVITE_CODE_LENGTH } from '../../constants'
import { isMobile } from 'react-device-detect'
import type { LobbyInfo, OpenAlert, UserData } from '../../types'
import LobbyCard from './lobby-card'
import * as React from 'react'
import styled from 'styled-components'

interface Props {
  onChangeStage: (newStage: string) => void
  openAlert: OpenAlert
  userData: UserData
}

const StyledRoot = styled.div(({ theme }) => ({
  '.divider-text': {
    color: theme.palette.light.main,
    fontSize: theme.spacing(2),
    fontStyle: 'italic'
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
  '.lobby-lists-container': {
    alignItems: theme.isMobile ? 'center' : 'flex-start',
    display: 'flex',
    flexDirection: theme.isMobile ? 'column' : 'row',
    justifyContent: theme.isMobile ? 'flex-start' : 'center',
    width: '100%'
  },
  '.lobby-header-divider': {
    width: '90%'
  },
  '.lobby-list': {
    alignItems: 'center',
    display: 'flex',
    flexBasis: '50%',
    flexDirection: 'column',
    marginBottom: theme.spacing(1)
  },
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
  '.new-game-icon': {
    marginRight: theme.spacing(1)
  },
  '.or-divider': {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: theme.isMobile ? '75%' : '50%'
  },
  '.vertical-centered-item-container': {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  }
}))

const exampleLobby: LobbyInfo = {
  match_id: 'lobby_id_1',
  match_name: 'Example Lobby',
  match_privacy: 0,
  allowed_players: [],
  rules: ['Forced 31 bid', '2-mark Nil', '2-mark Splash', '2-mark Plunge'],
  team_1: [],
  team_2: []
}

const Lobbies = ({ onChangeStage, openAlert, userData }: Props) => {
  const [inviteCode, setInviteCode] = React.useState('')

  const onChangeInviteCode = (e: { target: { value: string } }) => {
    setInviteCode(e.target.value)
  }

  const onClickJoinByInvite = () => {
    if (inviteCode.length !== INVITE_CODE_LENGTH) {
      openAlert(`Please enter a ${INVITE_CODE_LENGTH}-character invite code.`, 'error')
      return
    }
    openAlert(`Joining game with code ${inviteCode}`, 'info')
  }

  const onClickStartNewGame = () => { onChangeStage(GAME_STAGES.NEW_GAME_STAGE) }

  const privateLobbyList = (
    <div className="lobby-list">
      <Divider className="lobby-header-divider">
        <Typography className="divider-text">Join a private lobby</Typography>
      </Divider>
      <Typography>Some text</Typography>
    </div>
  )

  const publicLobbyList = (
    <div className="lobby-list">
      <Divider className="lobby-header-divider">
        <Typography className="divider-text">Join a public lobby</Typography>
      </Divider>
      <LobbyCard lobbyInfo={exampleLobby} openAlert={openAlert} userData={userData} />
    </div>
  )

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
          <Typography className="divider-text">or</Typography>
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
          <Typography className="divider-text">or</Typography>
        </Divider>
        <div className="lobby-lists-container">
          {isMobile
            ? (
            <>
              {privateLobbyList}
              {publicLobbyList}
            </>
              )
            : (
            <>
              {publicLobbyList}
              {privateLobbyList}
            </>
              )}
        </div>
      </div>
    </StyledRoot>
  )
}

export default Lobbies

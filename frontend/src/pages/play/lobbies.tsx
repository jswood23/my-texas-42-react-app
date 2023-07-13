import { AddCircle } from '@mui/icons-material'
import { Button, Divider, Pagination, TextField, Typography } from '@mui/material'
import {
  GAME_STAGES,
  INVITE_CODE_LENGTH,
  ITEMS_PER_PAGE
} from '../../constants'
import { isMobile } from 'react-device-detect'
import type { LobbyInfo, OpenAlert, UserData } from '../../types'
import LobbyCard from './lobby-card'
import * as React from 'react'
import styled from 'styled-components'

interface Props {
  onChangeStage: (
    newStage: string,
    newInviteCode?: string,
    newTeamNumber?: number
  ) => void
  openAlert: OpenAlert
  privateLobbies: LobbyInfo[]
  publicLobbies: LobbyInfo[]
  userData: UserData
}

const StyledRoot = styled.div(({ theme }) => ({
  '.divider-text': {
    color: theme.palette.light.main,
    fontSize: theme.spacing(2),
    fontStyle: 'italic',
    userSelect: 'none'
  },
  '.empty-lobby-list-text': {
    color: theme.palette.light.main,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
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

const Lobbies = ({ onChangeStage, openAlert, privateLobbies, publicLobbies, userData }: Props) => {
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
    onChangeStage(GAME_STAGES.IN_GAME_STAGE, inviteCode, 1)
  }

  const onClickStartNewGame = () => { onChangeStage(GAME_STAGES.NEW_GAME_STAGE) }

  const displayLobbyList = (lobbyList: LobbyInfo[]) => {
    const [page, setPage] = React.useState(1)
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(Math.min(value, totalPages))
    }

    const totalPages = Math.ceil(lobbyList.length / ITEMS_PER_PAGE)
    const p = page - 1
    const thisPage = lobbyList.slice(
      p * ITEMS_PER_PAGE,
      (p + 1) * ITEMS_PER_PAGE
    )

    let i = 0
    return (
      <>
        {thisPage.map((thisLobby: LobbyInfo) => {
          i++
          return (
            <LobbyCard
              key={`lobby-card-${i}`}
              lobbyInfo={thisLobby}
              onChangeStage={onChangeStage}
              openAlert={openAlert}
              userData={userData}
            />
          )
        })}
        {lobbyList.length > ITEMS_PER_PAGE &&
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        }
        {lobbyList.length === 0 &&
          <Typography className="empty-lobby-list-text">
            No open lobbies.
          </Typography>
        }
      </>
    )
  }

  const privateLobbyList = (
    <div className="lobby-list">
      <Divider className="lobby-header-divider">
        <Typography className="divider-text">Join a private lobby</Typography>
      </Divider>
      {displayLobbyList(privateLobbies)}
    </div>
  )

  const publicLobbyList = (
    <div className="lobby-list">
      <Divider className="lobby-header-divider">
        <Typography className="divider-text">Join a public lobby</Typography>
      </Divider>
      {displayLobbyList(publicLobbies)}
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

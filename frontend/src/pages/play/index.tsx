import { API } from 'aws-amplify'
import { Button } from '@mui/material'
import { CONNECTION_STATES, GAME_STAGES, apiContext } from '../../constants'
import type { GlobalObj, LobbyInfo } from '../../types'
import { styled } from 'styled-components'
import { useLocation } from 'react-router-dom'
import InGame from './in-game'
import Lobbies from './lobbies'
import NewGame from './new-game'
import PageContainer from '../../shared/page-container'
import * as React from 'react'

interface Props {
  globals: GlobalObj
}

const StyledRoot = styled.div(({ theme }) => ({
  '.disconnect-button': {
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
  }
}))

const PlayPage = ({ globals }: Props) => {
  const emptyLobbyList: LobbyInfo[] = []
  const [stage, setStage] = React.useState(GAME_STAGES.LOBBY_LOADING)
  const [publicLobbies, setPublicLobbies] = React.useState(emptyLobbyList)
  const [privateLobbies, setPrivateLobbies] = React.useState(emptyLobbyList)
  const [inviteCode, setInviteCode] = React.useState('')
  const [teamNumber, setTeamNumber] = React.useState(0)

  const isInLobby = stage.includes(GAME_STAGES.LOBBY_STAGE)
  const isNewGame = stage.includes(GAME_STAGES.NEW_GAME_STAGE)
  const isInGame = stage.includes(GAME_STAGES.IN_GAME_STAGE)
  const isLoading = stage.includes(GAME_STAGES.LOADING_STATE)
  const disableDisconnectButton = globals.connection.connectionStatus !== CONNECTION_STATES.open
  const matchName = globals.gameState.match_name ?? 'undefined'
  const pageTitle = isInLobby
    ? 'Game Lobbies'
    : isNewGame
      ? 'New Game'
      : isInGame
        ? matchName
        : 'Undefined Stage'

  const location = useLocation()

  const onChangeStage = (newStage: string, newInviteCode = '', newTeamNumber = 0) => {
    setStage(newStage)
    if (newInviteCode && newTeamNumber) {
      setInviteCode(newInviteCode.toUpperCase())
      setTeamNumber(newTeamNumber)
    }
  }

  React.useEffect(() => {
    const getLobbyLists = async () => {
      let isInGame = false
      onChangeStage(GAME_STAGES.LOBBY_LOADING)

      await API.get(apiContext, '/list_lobbies', {})
        .then((response) => {
          if (response.inGame) {
            isInGame = true
          } else {
            setPublicLobbies(response.publicLobbies)
            setPrivateLobbies(response.privateLobbies)
          }
        })
        .catch((error) => {
          console.log(error)
          globals.openAlert('There was an error getting the list of lobbies.', 'error')
          setPublicLobbies(emptyLobbyList)
          setPrivateLobbies(emptyLobbyList)
        })

      onChangeStage(isInGame ? GAME_STAGES.IN_GAME_LOADING : GAME_STAGES.LOBBY_STAGE)
    }

    if (globals.connection.connectionStatus === CONNECTION_STATES.open) {
      onChangeStage(GAME_STAGES.IN_GAME_STAGE)
    } else {
      globals.connection.setQueryParams({})
      globals.connection.setSocketUrl(null)
      getLobbyLists()
    }
  }, [location])

  const action = isInGame
    ? (
    <Button
      className='disconnect-button'
      disabled={disableDisconnectButton}
      onClick={() => { globals.connection.disconnect() }}
      variant='contained'
    >
      disconnect
    </Button>
      )
    : <></>

  return (
    <StyledRoot>
      <PageContainer
        action={action}
        isLoading={isLoading}
        title={pageTitle}
        globals={globals}
      >
        {isInLobby && (
          <Lobbies
            globals={globals}
            onChangeStage={onChangeStage}
            privateLobbies={privateLobbies}
            publicLobbies={publicLobbies}
          />
        )}
        {isNewGame && (
          <NewGame
            globals={globals}
            onChangeStage={onChangeStage}
          />
        )}
        {isInGame && (
          <InGame
            globals={globals}
            inviteCode={inviteCode}
            onChangeStage={onChangeStage}
            teamNumber={teamNumber}
          />
        )}
      </PageContainer>
    </StyledRoot>
  )
}

export default PlayPage

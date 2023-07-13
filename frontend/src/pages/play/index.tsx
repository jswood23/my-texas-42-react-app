import { API } from 'aws-amplify'
import { GAME_STAGES, apiContext } from '../../constants'
import type { LobbyInfo, OpenAlert, UserData } from '../../types'
import { useLocation } from 'react-router-dom'
import InGame from './in-game'
import Lobbies from './lobbies'
import NewGame from './new-game'
import PageContainer from '../../shared/page-container'
import * as React from 'react'

interface Props {
  openAlert: OpenAlert
  userData: UserData
}

const PlayPage = ({ openAlert, userData }: Props) => {
  const emptyLobbyList: LobbyInfo[] = []
  const [stage, setStage] = React.useState(GAME_STAGES.LOBBY_LOADING)
  const [publicLobbies, setPublicLobbies] = React.useState(emptyLobbyList)
  const [privateLobbies, setPrivateLobbies] = React.useState(emptyLobbyList)
  const [inviteCode, setInviteCode] = React.useState('')

  const isInLobby = stage.includes(GAME_STAGES.LOBBY_STAGE)
  const isNewGame = stage.includes(GAME_STAGES.NEW_GAME_STAGE)
  const isInGame = stage.includes(GAME_STAGES.IN_GAME_STAGE)
  const isLoading = stage.includes(GAME_STAGES.LOADING_STATE)
  const pageTitle = isInLobby
    ? 'Game Lobbies'
    : isNewGame
      ? 'New Game'
      : isInGame
        ? 'Texas 42'
        : 'Undefined Stage'

  const location = useLocation()

  const onChangeStage = (newStage: string, newInviteCode = '') => {
    setStage(newStage)
    if (newInviteCode) {
      setInviteCode(newInviteCode.toUpperCase())
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
          openAlert('There was an error getting the list of lobbies.', 'error')
          setPublicLobbies(emptyLobbyList)
          setPrivateLobbies(emptyLobbyList)
        })

      onChangeStage(isInGame ? GAME_STAGES.IN_GAME_LOADING : GAME_STAGES.LOBBY_STAGE)
    }

    getLobbyLists()
  }, [location])

  return (
    <PageContainer
      isLoading={isLoading}
      title={pageTitle}
      openAlert={openAlert}
      userData={userData}
    >
      {isInLobby && (
        <Lobbies
          onChangeStage={onChangeStage}
          openAlert={openAlert}
          privateLobbies={privateLobbies}
          publicLobbies={publicLobbies}
          userData={userData}
        />
      )}
      {isNewGame && (
        <NewGame
          onChangeStage={onChangeStage}
          openAlert={openAlert}
          userData={userData}
        />
      )}
      {isInGame && (
        <InGame
          inviteCode={inviteCode}
          onChangeStage={onChangeStage}
          openAlert={openAlert}
          userData={userData}
        />
      )}
    </PageContainer>
  )
}

export default PlayPage

import { GAME_STAGES } from '../../constants'
import type { OpenAlert, UserData } from '../../types'
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
  const [stage, setStage] = React.useState('in-game')
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

  const onChangeStage = (newStage: string) => {
    setStage(newStage)
  }

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
          onChangeStage={onChangeStage}
          openAlert={openAlert}
          userData={userData}
        />
      )}
    </PageContainer>
  )
}

export default PlayPage

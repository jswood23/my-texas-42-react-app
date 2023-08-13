import { CONNECTION_STATES, SERVER_MESSAGE_TYPES } from '../../../../constants'
import type { GameState, GlobalObj, RoundRules, ServerMessage } from '../../../../types'
import { CircularProgress } from '@mui/material'
import GameDisplay from './game-display-test'
import LobbyWaitingScreen from './lobby-waiting-screen'
import * as React from 'react'
import styled from 'styled-components'

const StyledRoot = styled.div(({ theme }) => ({
  border: '1px solid #A0A0A0',
  borderRadius: '5px',
  boxShadow: '0 2px 5px 3px #E0E0E0',
  flexBasis: '70%',

  height: theme.isMobile ? theme.spacing(50) : theme.spacing(67),
  minHeight: theme.spacing(60),
  marginBottom: theme.spacing(2),

  '.circular-progress-container': {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

interface Props {
  globals: GlobalObj
  inviteCode: string
  teamNumber: number
}

const GameWindow = ({
  globals,
  inviteCode,
  teamNumber
}: Props) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const isConnected = globals.connection.connectionStatus === CONNECTION_STATES.open
  const isLobbyFull = globals.gameState.team_1.length === 2 && globals.gameState.team_2.length === 2

  React.useEffect(() => {
    if (globals.connection.connectionStatus === CONNECTION_STATES.open) {
      globals.connection.sendJsonMessage({ action: 'refresh_player_game_state' })
    }
  }, [globals.connection.connectionStatus])

  React.useEffect(() => {
    if (globals.connection.lastMessage !== null) {
      const messageData = (JSON.parse(globals.connection.lastMessage.data) as ServerMessage)
      const newGameState: GameState = messageData.gameData as GameState
      const gameError: string =
            messageData.message ?? 'An unknown error occurred.'
      switch (messageData?.messageType) {
        case SERVER_MESSAGE_TYPES.gameUpdate:
          if (typeof newGameState.current_round_rules === 'string') {
            newGameState.current_round_rules = JSON.parse(
              newGameState.current_round_rules
            ) as RoundRules
          }
          globals.setGameState(newGameState)
          setIsLoading(false)
          break
        case SERVER_MESSAGE_TYPES.gameError:
          globals.openAlert(gameError, 'error')
          break
      }
    }
  }, [globals.connection.lastMessage])

  return (
    <StyledRoot>
      {isLoading && (
        <div className="circular-progress-container">
          <CircularProgress size={50} />
        </div>
      )}
      {isConnected && !isLoading && !isLobbyFull && (
        <LobbyWaitingScreen globals={globals} />
      )}
      {isConnected && !isLoading && isLobbyFull && (
        <GameDisplay globals={globals} />
      )}
    </StyledRoot>
  )
}

export default GameWindow

import { CONNECTION_STATES, SERVER_MESSAGE_TYPES } from '../../../constants'
import type { GameState, GlobalObj, ServerMessage, WebSocketConnection } from '../../../types'
import { Typography } from '@mui/material'
import * as React from 'react'
import styled from 'styled-components'

const StyledRoot = styled.div(({ theme }) => ({
  border: '1px solid #A0A0A0',
  borderRadius: '5px',
  boxShadow: '0 2px 5px 3px #E0E0E0',
  flexBasis: '70%',

  height: theme.isMobile ? theme.spacing(50) : theme.spacing(67),
  minHeight: theme.spacing(60),
  marginBottom: theme.spacing(2)
}))

interface Props {
  globals: GlobalObj
  inviteCode: string
  connection: WebSocketConnection
  teamNumber: number
}

const defaultGameState: GameState = {
  match_name: '__default_match_name__',
  match_invite_code: 'ABC123',
  rules: [],
  team_1: [],
  team_2: [],
  current_round: 0,
  current_starting_bidder: 0,
  current_is_bidding: true,
  current_player_turn: 0,
  current_round_rules: [],
  player_dominoes: '',
  current_team_1_round_score: 0,
  current_team_2_round_score: 0,
  current_team_1_total_score: 0,
  current_team_2_total_score: 0,
  current_round_history: [],
  total_round_history: []
}

const GameWindow = ({
  connection,
  globals,
  inviteCode,
  teamNumber
}: Props) => {
  const [gameState, setGameState] = React.useState(defaultGameState)

  React.useEffect(() => {
    if (connection.connectionStatus === CONNECTION_STATES.open) {
      connection.sendJsonMessage({ action: 'refresh_player_game_state' })
    }
  }, [connection.connectionStatus])

  React.useEffect(() => {
    if (connection.lastMessage !== null) {
      const messageData = (JSON.parse(connection.lastMessage.data) as ServerMessage)
      if (messageData?.messageType === SERVER_MESSAGE_TYPES.gameUpdate) {
        const newGameState: GameState = (messageData.gameData as GameState)
        setGameState(newGameState)
      }
    }
  }, [connection.lastMessage])

  return (
    <StyledRoot>
      <Typography>Connection Status: {connection.connectionStatus}</Typography>
      <Typography>Invite Code: {inviteCode}</Typography>
      <Typography>Team Number: {teamNumber}</Typography>
      <Typography>Team 1: {gameState.team_1}</Typography>
      <Typography>Team 2: {gameState.team_2}</Typography>
    </StyledRoot>
  )
}

export default GameWindow

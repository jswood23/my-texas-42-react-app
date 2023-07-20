import { CONNECTION_STATES } from '../../../constants'
import type { GlobalObj, WebSocketConnection } from '../../../types'
import { useNavigate } from 'react-router-dom'
import ChatBox from './chat-box'
import config from '../../../constants/config'
import * as React from 'react'
import styled from 'styled-components'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import GameWindow from './game-window'

const StyledRoot = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: theme.isMobile ? 'column' : 'row'
}))

interface Props {
  globals: GlobalObj
  inviteCode: string
  onChangeStage: (newStage: string, newInviteCode?: string, newTeamNumber?: number) => void
  teamNumber: number
}

const InGame = ({ globals, inviteCode, onChangeStage, teamNumber }: Props) => {
  const navigate = useNavigate()
  const socketUrl = config.websocket.URL ?? ''

  const queryParams = {
    match_invite_code: inviteCode,
    team_number: teamNumber,
    user_id: globals.userData.attributes.sub,
    username: globals.userData.username
  }

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    queryParams
  })

  const connectionStatus = {
    [ReadyState.CONNECTING]: CONNECTION_STATES.connecting,
    [ReadyState.OPEN]: CONNECTION_STATES.open,
    [ReadyState.CLOSING]: CONNECTION_STATES.closing,
    [ReadyState.CLOSED]: CONNECTION_STATES.closed,
    [ReadyState.UNINSTANTIATED]: CONNECTION_STATES.uninstantiated
  }[readyState]

  const connection: WebSocketConnection = {
    connectionStatus,
    lastMessage,
    sendJsonMessage
  }

  React.useEffect(() => {
    switch (connectionStatus) {
      case CONNECTION_STATES.closed: {
        globals.openAlert('Unable to connect to lobby.', 'error')
        navigate('/play')
      }
    }
  }, [connectionStatus])

  return (
    <StyledRoot>
      <GameWindow
        connection={connection}
        globals={globals}
        inviteCode={inviteCode}
        teamNumber={teamNumber}
      />
      <ChatBox
        connection={connection}
        globals={globals}
      />
    </StyledRoot>
  )
}

export default InGame

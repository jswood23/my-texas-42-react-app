import { CONNECTION_STATES } from '../../../constants'
import type { OpenAlert, UserData, WebSocketConnection } from '../../../types'
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
  inviteCode: string
  onChangeStage: (newStage: string, newInviteCode?: string, newTeamNumber?: number) => void
  openAlert: OpenAlert
  teamNumber: number
  userData: UserData
}

const InGame = ({ inviteCode, onChangeStage, openAlert, teamNumber, userData }: Props) => {
  const navigate = useNavigate()
  const socketUrl = config.websocket.URL ?? ''

  const queryParams = {
    match_invite_code: inviteCode,
    team_number: teamNumber,
    user_id: userData.attributes.sub,
    username: userData.username
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
        openAlert('Unable to connect to lobby.', 'error')
        navigate('/play')
      }
    }
  }, [connectionStatus])

  return (
    <StyledRoot>
      <GameWindow
        connection={connection}
        inviteCode={inviteCode}
        openAlert={openAlert}
        teamNumber={teamNumber}
        userData={userData}
      />
      <ChatBox
        connection={connection}
        openAlert={openAlert}
        userData={userData}
      />
    </StyledRoot>
  )
}

export default InGame

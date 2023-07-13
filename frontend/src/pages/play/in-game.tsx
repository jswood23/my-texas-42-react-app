import type { OpenAlert, UserData } from '../../types'
import { Typography } from '@mui/material'
import config from '../../constants/config'
import styled from 'styled-components'
import useWebSocket, { ReadyState } from 'react-use-websocket'

const StyledRoot = styled.div(() => ({

}))

interface Props {
  inviteCode: string
  onChangeStage: (newStage: string, newInviteCode?: string) => void
  openAlert: OpenAlert
  userData: UserData
}

const InGame = ({ inviteCode, onChangeStage, openAlert, userData }: Props) => {
  const socketUrl = config.websocket.URL ?? ''

  const queryParams = {
    match_invite_code: inviteCode,
    user_id: userData.attributes.sub
  }

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, { queryParams })

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated'
  }[readyState]

  return (
    <StyledRoot>
      <Typography>Connection Status: {connectionStatus}</Typography>
      <Typography>Invite Code: {inviteCode}</Typography>
    </StyledRoot>
  )
}

export default InGame

import type { OpenAlert, UserData, WebSocketConnection } from '../../../types'
import { Typography } from '@mui/material'
import * as React from 'react'
import styled from 'styled-components'

const StyledRoot = styled.div(() => ({
  border: '1px solid #A0A0A0',
  borderRadius: '5px',
  boxShadow: '0 2px 5px 3px #E0E0E0',
  flexBasis: '70%',
  height: '72vh'
}))

interface Props {
  inviteCode: string
  openAlert: OpenAlert
  connection: WebSocketConnection
  teamNumber: number
  userData: UserData
}

const GameWindow = ({
  connection,
  inviteCode,
  openAlert,
  teamNumber,
  userData
}: Props) => {
  return (
    <StyledRoot>
      <Typography>Connection Status: {connection.connectionStatus}</Typography>
      <Typography>Invite Code: {inviteCode}</Typography>
      <Typography>Team Number: {teamNumber}</Typography>
    </StyledRoot>
  )
}

export default GameWindow

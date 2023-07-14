import type { OpenAlert, UserData } from '../../../types'
import { Typography } from '@mui/material'
import * as React from 'react'
import styled from 'styled-components'

const StyledRoot = styled.div(() => ({
  border: '1px solid #A0A0A0',
  borderRadius: '5px',
  boxShadow: '0 2px 5px 3px #E0E0E0'
}))

interface Props {
  connectionStatus: string
  inviteCode: string
  lastMessage?: any
  openAlert: OpenAlert
  sendJsonMessage: (message: any) => void
  teamNumber: number
  userData: UserData
}

const GameWindow = ({
  connectionStatus,
  inviteCode,
  lastMessage,
  openAlert,
  sendJsonMessage,
  teamNumber,
  userData
}: Props) => {
  return (
    <StyledRoot>
      <Typography>Connection Status: {connectionStatus}</Typography>
      <Typography>Invite Code: {inviteCode}</Typography>
      <Typography>Team Number: {teamNumber}</Typography>
    </StyledRoot>
  )
}

export default GameWindow

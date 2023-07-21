import type { GlobalObj } from '../../../types'
import ChatBox from './chat-box'
import config from '../../../constants/config'
import * as React from 'react'
import styled from 'styled-components'
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
  React.useEffect(() => {
    if (!globals.connection.socketUrl && config.websocket.URL) {
      const queryParams = {
        match_invite_code: inviteCode,
        team_number: teamNumber,
        user_id: globals.userData.attributes.sub,
        username: globals.userData.username
      }

      globals.connection.setQueryParams(queryParams)
      globals.connection.setSocketUrl(config.websocket.URL)
    }
  }, [])

  return (
    <StyledRoot>
      <GameWindow
        globals={globals}
        inviteCode={inviteCode}
        teamNumber={teamNumber}
      />
      <ChatBox
        globals={globals}
      />
    </StyledRoot>
  )
}

export default InGame

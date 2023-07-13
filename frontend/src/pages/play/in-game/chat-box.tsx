import type { OpenAlert, UserData } from '../../../types'
import { Typography } from '@mui/material'
import * as React from 'react'
import styled from 'styled-components'

const StyledRoot = styled.div(() => ({}))

interface Props {
  lastMessage?: any
  openAlert: OpenAlert
  sendMessage: (message: string) => void
  userData: UserData
}

const defaultChatHistory: string[] = ['placeholder']

const ChatBox = ({ lastMessage, openAlert, sendMessage, userData }: Props) => {
  const [chatHistory, setChatHistory] = React.useState(defaultChatHistory)

  React.useEffect(() => {
    if (lastMessage !== null) {
      setChatHistory((prev) => prev.concat(lastMessage))
    }
  }, [lastMessage, setChatHistory])

  const listMessages = () => {
    let i = 0
    return chatHistory.map((chatMessage) => {
      i++
      return (
        <Typography key={`chat-message-${i}`}>{chatMessage}</Typography>
      )
    })
  }

  return (
    <StyledRoot>
      {listMessages()}
    </StyledRoot>
  )
}

export default ChatBox

import type { OpenAlert, UserData } from '../../../types'
import { Button, TextField, Typography } from '@mui/material'
import * as React from 'react'
import styled from 'styled-components'

const StyledRoot = styled.div(({ theme }) => ({
  backgroundColor: 'white',
  width: '100%',
  padding: theme.spacing(2),

  border: '1px solid #A0A0A0',
  borderRadius: '5px',
  boxShadow: '0 2px 5px 3px #E0E0E0'
}))

interface Props {
  lastMessage?: any
  openAlert: OpenAlert
  sendJsonMessage: (message: any) => void
  userData: UserData
}

const defaultChatHistory: string[] = ['placeholder']

const ChatBox = ({
  lastMessage,
  openAlert,
  sendJsonMessage,
  userData
}: Props) => {
  const [chatHistory, setChatHistory] = React.useState(defaultChatHistory)
  const [draftMessage, setDraftMessage] = React.useState('')

  React.useEffect(() => {
    if (lastMessage !== null) {
      console.log(lastMessage)
      // setChatHistory((prev) => prev.concat(lastMessage))
    }
  }, [lastMessage, setChatHistory])

  const listMessages = () => {
    let i = 0
    return chatHistory.map((chatMessage) => {
      i++
      return <Typography key={`chat-message-${i}`}>{chatMessage}</Typography>
    })
  }

  const onChangeDraftMessage = (e: any) => {
    setDraftMessage(e.target.value)
  }

  const onSendMessage = () => {
    const jsonMessage = {
      action: 'sendmessage',
      data: {
        is_chat: true,
        message: draftMessage
      }
    }
    sendJsonMessage(jsonMessage)
    setDraftMessage('')
  }

  return (
    <StyledRoot>
      {listMessages()}
      <div className="send-message-row">
        <TextField
          label="Send a message"
          size="small"
          onChange={onChangeDraftMessage}
          value={draftMessage}
        />
        <Button disabled={!draftMessage} onClick={onSendMessage}>
          Send
        </Button>
      </div>
    </StyledRoot>
  )
}

export default ChatBox

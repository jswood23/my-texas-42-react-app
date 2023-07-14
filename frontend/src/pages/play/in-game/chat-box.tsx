import type { ChatMessage, OpenAlert, UserData } from '../../../types'
import { Button, TextField, Typography } from '@mui/material'
import * as React from 'react'
import styled from 'styled-components'

const StyledRoot = styled.div(({ theme }) => ({
  backgroundColor: 'white',
  flexBasis: '30%',
  height: '72vh',

  border: '1px solid #A0A0A0',
  borderRadius: '5px',
  boxShadow: '0 2px 5px 3px #E0E0E0',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  maxWidth: '30%',
  '.chat-message': {
    fontSize: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    overflow: 'hidden',
    wordWrap: 'break-word'
  },
  '.messages-container': {
    alignItems: 'end',
    padding: theme.spacing(1),
    overflowY: 'auto'
  },
  '.send-message-row': {
    borderTop: '1px solid #A0A0A0',
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(1),
    width: '100%'
  },
  '.send-message-button': {
    flexBasis: '25%'
  },
  '.send-message-text-field': {
    flexBasis: '75%'
  }
}))

interface Props {
  lastMessage?: any
  openAlert: OpenAlert
  sendJsonMessage: (message: any) => void
  userData: UserData
}

const defaultChatHistory: ChatMessage[] = []

const ChatBox = ({
  lastMessage,
  openAlert,
  sendJsonMessage,
  userData
}: Props) => {
  const [chatHistory, setChatHistory] = React.useState(defaultChatHistory)
  const [draftMessage, setDraftMessage] = React.useState('')
  const [textFieldSelected, setTextFieldSelected] = React.useState(false)

  const bottomEl = React.useRef(null)

  const scrollToBottom = () => {
    (bottomEl?.current as any)?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    if (lastMessage !== null) {
      const messageData = (JSON.parse(lastMessage.data) as ChatMessage)
      if (messageData?.messageType === 'chat') {
        setChatHistory((prev) => prev.concat(messageData))
        scrollToBottom()
      }
    }
  }, [lastMessage, setChatHistory])

  const listMessages = () => {
    let i = 0
    return chatHistory.map((chatMessage) => {
      i++
      return (
        <Typography
          className='chat-message'
          key={`chat-message-${i}`}
        >
          {chatMessage.username}: {chatMessage.message}
        </Typography>
      )
    })
  }

  const onChangeDraftMessage = (e: any) => {
    setDraftMessage(e.target.value)
  }

  const onSendMessage = () => {
    const messageData: ChatMessage = {
      messageType: 'chat',
      message: draftMessage,
      username: userData.username
    }
    sendJsonMessage({ action: 'sendmessage', data: messageData })
    setDraftMessage('')
  }

  React.useEffect(() => {
    const listener = (event: { code: string, preventDefault: () => void }) => {
      if (textFieldSelected && (event.code === 'Enter' || event.code === 'NumpadEnter')) {
        event.preventDefault()
        onSendMessage()
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [onSendMessage, textFieldSelected])

  return (
    <StyledRoot>
      <div className="messages-container">
        {listMessages()}
        <div ref={bottomEl}>.</div>
      </div>
      <div className="send-message-row">
        <TextField
          className="send-message-text-field"
          label="Send a message"
          size="small"
          onChange={onChangeDraftMessage}
          onFocus={() => { setTextFieldSelected(true) }}
          onBlur={() => { setTextFieldSelected(false) }}
          value={draftMessage}
        />
        <Button
          className="send-message-button"
          disabled={!draftMessage}
          onClick={onSendMessage}
        >
          Send
        </Button>
      </div>
    </StyledRoot>
  )
}

export default ChatBox

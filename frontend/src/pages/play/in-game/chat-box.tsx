import { Button, TextField, Typography } from '@mui/material'
import type { ChatMessage, GlobalObj, ServerMessage } from '../../../types'
import { CONNECTION_STATES, MAX_CHAT_LENGTH, SERVER_MESSAGE_TYPES } from '../../../constants'
import * as React from 'react'
import styled from 'styled-components'

const StyledRoot = styled.div(({ theme }) => ({
  backgroundColor: 'white',
  flexBasis: '30%',
  height: theme.isMobile ? theme.spacing(50) : theme.spacing(67),
  minHeight: theme.spacing(50),

  border: '1px solid #A0A0A0',
  borderRadius: '5px',
  boxShadow: '0 2px 5px 3px #E0E0E0',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  maxWidth: theme.isMobile ? '100%' : '30%',
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
    flexBasis: '25%',
    backgroundColor: theme.palette.primary.alt,
    color: theme.palette.secondary.main,
    fontSize: theme.isMobile ? theme.spacing(2) : theme.spacing(1.5),
    '&:hover': {
      color: theme.palette.secondary.alt,
      backgroundColor: theme.palette.primary.main
    }
  },
  '.send-message-text-field': {
    flexBasis: '75%'
  }
}))

interface Props {
  globals: GlobalObj
}

const defaultChatHistory: ChatMessage[] = []

const ChatBox = ({
  globals
}: Props) => {
  const [chatHistory, setChatHistory] = React.useState(defaultChatHistory)
  const [draftMessage, setDraftMessage] = React.useState('')
  const [textFieldSelected, setTextFieldSelected] = React.useState(false)
  const [shouldScroll, setShouldScroll] = React.useState(false)

  const bottomEl = React.useRef(null)

  const messageTooLong = draftMessage.length > MAX_CHAT_LENGTH

  // don't allow sending a message if the message is empty or the connection is not open or the message is too long
  const disableSendButton = !draftMessage ||
      globals.connection.connectionStatus !== CONNECTION_STATES.open ||
      messageTooLong

  const scrollToBottom = () => {
    (bottomEl?.current as any)?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    if (shouldScroll) {
      scrollToBottom()
      setShouldScroll(false)
    }
  }, [shouldScroll, setShouldScroll])

  React.useEffect(() => {
    if (globals.connection.lastMessage !== null) {
      const messageData = (JSON.parse(globals.connection.lastMessage.data) as ServerMessage)
      if (messageData?.messageType === SERVER_MESSAGE_TYPES.chat) {
        const newChatMessage: ChatMessage = {
          username: messageData.username,
          message: messageData.message
        }
        setChatHistory((prev) => prev.concat(newChatMessage))
        setShouldScroll(true)
      }
    }
  }, [globals.connection.lastMessage, setChatHistory, setShouldScroll])

  const listMessages = () => {
    let i = 0
    return chatHistory.map((chatMessage) => {
      i++
      const isBottomEl = i === chatHistory.length - 1
      return (
        <Typography
          className='chat-message'
          key={`chat-message-${i}`}
          ref={isBottomEl ? bottomEl : null}
        >
          <strong>{chatMessage.username}: </strong>
          {chatMessage.message}
        </Typography>
      )
    })
  }

  const onChangeDraftMessage = (e: any) => {
    const messageLimitedLength = e.target.value.slice(0, MAX_CHAT_LENGTH * 2)
    setDraftMessage(messageLimitedLength)
  }

  const onSendMessage = () => {
    const messageData: ChatMessage = {
      message: draftMessage,
      username: globals.userData.username
    }
    globals.connection.sendJsonMessage({ action: 'send_chat_message', data: JSON.stringify(messageData) })
    setDraftMessage('')
  }

  React.useEffect(() => {
    if (!disableSendButton) {
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
    }
  }, [onSendMessage, textFieldSelected])

  return (
    <StyledRoot>
      <div className="messages-container">
        {listMessages()}
      </div>
      <div className="send-message-row">
        <TextField
          className="send-message-text-field"
          label="Send a message"
          size="small"
          onChange={onChangeDraftMessage}
          onFocus={() => { setTextFieldSelected(true) }}
          onBlur={() => { setTextFieldSelected(false) }}
          error={messageTooLong}
          helperText={messageTooLong ? `Message length must be ${MAX_CHAT_LENGTH} characters or less. Length: ${draftMessage.length}` : ''}
          value={draftMessage}
        />
        <Button
          className="send-message-button"
          variant="contained"
          disabled={disableSendButton}
          onClick={onSendMessage}
        >
          Send
        </Button>
      </div>
    </StyledRoot>
  )
}

export default ChatBox

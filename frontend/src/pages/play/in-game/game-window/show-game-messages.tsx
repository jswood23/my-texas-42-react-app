import { Box, Typography } from '@mui/material'
import { type GlobalObj } from '../../../../types'
import * as React from 'react'
import styled from 'styled-components'
import { pos } from './utils/helpers'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
}

interface StyledProps {
  xpos: number
  ypos: number
  width: number
  height: number
}

const MessageBar = styled(Box)<StyledProps>(({ theme, xpos, ypos, width, height }) => {
  return ({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: `${xpos}px`,
    top: `${ypos}px`,
    width: `${width}px`,
    height: `${height}px`,

    '.message': {
      color: 'black',
      fontSize: theme.spacing(2),
      fontStyle: 'italic',
      fontWeight: 'bold',
      userSelect: 'none',
      textAlign: 'center'
    }
  })
})

const ShowGameMessages = ({ globals, windowHeight, windowWidth }: Props) => {
  const [latestMessage, setLatestMessage] = React.useState('')
  const [buildingMessage, setBuildingMessage] = React.useState('')

  const addToBuildingMessage = () => {
    // console.log(buildingMessage, '/', latestMessage)
    if (buildingMessage.length < latestMessage.length) {
      // console.log('adding to building message')
      const nextChar = latestMessage.at(buildingMessage.length) ?? ''
      setBuildingMessage(buildingMessage + nextChar)
    }
  }

  React.useEffect(() => {
    if (globals.gameState.current_round_history.length > 0) {
      const lastMessage = globals.gameState.current_round_history.at(-1) ?? '\\'
      if (lastMessage.includes('\\')) {
        return () => {}
      }
      setLatestMessage(lastMessage)
      setBuildingMessage('')
      // const interval = setInterval(addToBuildingMessage, 1000)
      // return () => { clearInterval(interval) }
    }
  }, globals.gameState.current_round_history)

  return (
    <MessageBar
      xpos={pos(30, windowWidth)}
      ypos={0}
      width={pos(40, windowWidth)}
      height={pos(15, windowHeight)}
    >
      <Typography className='message'>
        {latestMessage}
      </Typography>
    </MessageBar>
  )
}

export default ShowGameMessages

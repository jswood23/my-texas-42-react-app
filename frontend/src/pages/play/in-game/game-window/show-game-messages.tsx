import { Box, Typography } from '@mui/material'
import { getBidString, replaceGameString } from './utils/get-game-information'
import { type GlobalObj } from '../../../../types'
import { pos } from './utils/helpers'
import * as React from 'react'
import styled from 'styled-components'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
  lastMessage: string
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
    alignItems: 'flex-start',
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
    },
    '.rules-header': {
      color: theme.palette.light.main,
      fontSize: theme.spacing(1.5),
      fontStyle: 'italic',
      fontWeight: 'bold',
      userSelect: 'none',
      textAlign: 'center'
    }
  })
})

const ShowGameMessages = ({ globals, windowHeight, windowWidth, lastMessage }: Props) => {
  const [latestMessage, setLatestMessage] = React.useState('')
  const [buildingMessage, setBuildingMessage] = React.useState('')
  const [rulesHeader, setRulesHeader] = React.useState('')

  const addToBuildingMessage = (onClear: () => void) => {
    if (buildingMessage.length < latestMessage.length) {
      const nextChar = latestMessage.at(buildingMessage.length) ?? ''
      setBuildingMessage(buildingMessage + nextChar)
    } else {
      onClear()
    }
  }

  React.useEffect(() => {
    if (globals.gameState.current_round_history.length > 0) {
      if (lastMessage.includes('\\')) {
        return () => {}
      }
      setLatestMessage(lastMessage)
      setBuildingMessage('')
    }
  }, [lastMessage])

  React.useEffect(() => {
    const interval = setInterval(addToBuildingMessage, 40, () => { clearInterval(interval) })
    return () => { clearInterval(interval) }
  }, [latestMessage, buildingMessage])

  React.useEffect(() => {
    const rules = globals.gameState.current_round_rules
    if (typeof rules === 'string') {
      setRulesHeader('')
    } else {
      let header = `Team ${rules.biddingTeam}'s bid: ${getBidString(rules.bid)}.`
      if (rules.variant === '') {
        header += ` Trump: ${replaceGameString(rules.trump)}`
      } else {
        header += ` Variant: ${replaceGameString(rules.variant)}`
        if (rules.trump !== '') {
          header += `, ${replaceGameString(rules.trump)}`
        }
      }
      setRulesHeader(header)
    }
  }, [globals.gameState.current_round_rules])

  return (
    <>
      <MessageBar
        xpos={pos(31, windowWidth)}
        ypos={0}
        width={pos(38, windowWidth)}
        height={pos(5, windowHeight)}
      >
        <Typography className='rules-header'>
          {rulesHeader}
        </Typography>
      </MessageBar>
      <MessageBar
        xpos={pos(31, windowWidth)}
        ypos={pos(7, windowHeight)}
        width={pos(38, windowWidth)}
        height={pos(20, windowHeight)}
      >
        <Typography className='message'>
          {buildingMessage}
        </Typography>
      </MessageBar>
    </>
  )
}

export default ShowGameMessages

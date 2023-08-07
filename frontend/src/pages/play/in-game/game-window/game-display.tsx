import { Button, MenuItem, Select, TextField, Typography } from '@mui/material'
import { type GlobalObj } from '../../../../types'
import * as React from 'react'
import styled from 'styled-components'

const MOVE_TYPES = {
  bid: 'bid',
  call: 'call',
  play: 'play'
}

const StyledRoot = styled.div(({ theme }) => ({
  padding: theme.spacing(2)
}))

interface Props {
  globals: GlobalObj
}

const GameDisplay = ({ globals }: Props) => {
  const [moveType, setMoveType] = React.useState(MOVE_TYPES.bid)
  const [move, setMove] = React.useState('')
  const { gameState } = globals

  const sendMove = () => {
    globals.connection.sendJsonMessage({ action: 'play_turn', data: JSON.stringify({ move, moveType }) })
  }

  return (
    <StyledRoot>
      <Select
        value={moveType}
        onChange={(e: any) => {
          setMoveType(e.target.value as string)
        }}
      >
        <MenuItem value={MOVE_TYPES.bid}>{MOVE_TYPES.bid}</MenuItem>
        <MenuItem value={MOVE_TYPES.call}>{MOVE_TYPES.call}</MenuItem>
        <MenuItem value={MOVE_TYPES.play}>{MOVE_TYPES.play}</MenuItem>
      </Select>
      <TextField
        label="Player move"
        value={move}
        onChange={(e: any) => {
          setMove(e.target.value as string)
        }}
      />
      <Button onClick={sendMove}>Send</Button>
      <br />
      <Typography>{gameState.player_dominoes.join(', ')}</Typography>
    </StyledRoot>
  )
}

export default GameDisplay

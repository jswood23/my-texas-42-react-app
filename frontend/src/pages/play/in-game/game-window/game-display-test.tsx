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
  padding: theme.spacing(2),
  '.player-move-box': {
    border: '1px solid #000000',
    padding: theme.spacing(1)
  }
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

  const showPastMoves = () => {
    const pastMoves = gameState.current_round_history.slice(-5).reverse()
    return pastMoves.map((pastMove) => {
      return <Typography key={pastMove}>{pastMove}</Typography>
    })
  }

  const showPlayerTurn = () => {
    const listOfPlayers = [gameState.team_1[0], gameState.team_2[0], gameState.team_1[1], gameState.team_2[1]]
    const playerTurn = listOfPlayers[gameState.current_player_turn]
    const startingBidder = listOfPlayers[gameState.current_starting_bidder]
    const startingPlayer = listOfPlayers[gameState.current_starting_player]
    return (
      <>
        <Typography>Current starting bidder: {startingBidder}</Typography>
        <Typography>Current starting player: {startingPlayer}</Typography>
        <Typography>Current player turn: {playerTurn}</Typography>
      </>
    )
  }

  const showTeamPlayers = (team: number) =>
    (team === 1 ? gameState.team_1 : gameState.team_2).join(', ')

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
      {showPlayerTurn()}
      <br />
      <Typography>Team 1: {showTeamPlayers(1)}</Typography>
      <Typography>Team 2: {showTeamPlayers(2)}</Typography>
      <br />
      <div className="player-move-box">{showPastMoves()}</div>
    </StyledRoot>
  )
}

export default GameDisplay

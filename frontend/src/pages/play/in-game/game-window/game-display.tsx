import type { DominoObj, GlobalObj, ServerMessage } from '../../../../types'
import { THEME } from '../../../../constants/theme'
import * as React from 'react'
import ShowBids from './show-bids'
import ShowDominoes from './show-dominoes'
import ShowGameMessages from './show-game-messages'
import ShowPlayerInfo from './show-player-info'
import ShowPlayerOptions from './show-player-options'
import ShowTeamInfo from './show-team-info'
import styled from 'styled-components'
import { getUserPosition } from './utils/get-game-information'

const StyledRoot = styled.div(({ theme }) => ({
  position: 'relative',
  '.player-move-box': {
    border: '1px solid #000000',
    height: theme.spacing(15),
    overflowY: 'auto',
    padding: theme.spacing(1)
  }
}))

interface Props {
  globals: GlobalObj
  lastServerMessage: ServerMessage
}

const GameDisplay = ({ globals, lastServerMessage }: Props) => {
  const userPosition = React.useMemo(() => getUserPosition(globals.gameState, globals.userData.username), [globals.gameState.team_1, globals.gameState.team_2, globals.userData.username])
  const isPlayerTurn = userPosition === globals.gameState.current_player_turn
  const gameWindowWidth = +(THEME.spacing(77.5).slice(0, -2))
  const gameWindowHeight = +(THEME.spacing(67).slice(0, -2))
  const lastMessage = globals.gameState.current_round_history.at(-1) ?? '\\'

  const [stagedDomino, setStagedDomino] = React.useState<DominoObj | null | undefined>()
  const [showGrid, setShowGrid] = React.useState(false)

  React.useEffect(() => {
    setShowGrid(false)
  }, [])

  const displayGrid = () => {
    const horizontalLines = () => {
      const spacing = gameWindowHeight / 10
      return Array.from(Array(10).keys()).map(i => <line key={`hline-${i}`} y1={`${i * spacing}px`} x1='0px' y2={`${i * spacing}px`} x2 = {`${gameWindowWidth}px`} />)
    }
    const verticalLines = () => {
      const spacing = gameWindowWidth / 10
      return Array.from(Array(10).keys()).map(i => <line key={`vline-${i}`} x1={`${i * spacing}px`} y1='0px' x2={`${i * spacing}px`} y2 = {`${gameWindowHeight}px`} />)
    }
    return (
      <svg width={gameWindowWidth} height={gameWindowHeight} fill='black' stroke='black' strokeWidth={0.1}>
        {horizontalLines()}
        {verticalLines()}
      </svg>
    )
  }

  return (
    <StyledRoot>
      {showGrid && displayGrid()}
      <ShowPlayerInfo globals={globals} windowHeight={gameWindowHeight} windowWidth={gameWindowWidth} />
      <ShowTeamInfo globals={globals} windowHeight={gameWindowHeight} windowWidth={gameWindowWidth} />
      <ShowGameMessages globals={globals} windowHeight={gameWindowHeight} windowWidth={gameWindowWidth} lastMessage={lastMessage} />
      {isPlayerTurn && <ShowPlayerOptions globals={globals} windowHeight={gameWindowHeight} windowWidth={gameWindowWidth} stagedDomino={stagedDomino} lastServerMessage={lastServerMessage} />}
      <ShowDominoes globals={globals} windowHeight={gameWindowHeight} windowWidth={gameWindowWidth} lastMessage={lastMessage} stagedDomino={stagedDomino} setStagedDomino={setStagedDomino} />
      <ShowBids globals={globals} windowHeight={gameWindowHeight} windowWidth={gameWindowWidth} />
    </StyledRoot>
  )
}

export default GameDisplay

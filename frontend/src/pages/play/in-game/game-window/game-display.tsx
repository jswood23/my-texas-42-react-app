import { type GlobalObj } from '../../../../types'
import { THEME } from '../../../../constants/theme'
import * as React from 'react'
import styled from 'styled-components'
import ShowDominoes from './show-dominoes'
import ShowPlayerInfo from './show-player-info'
import ShowTeamInfo from './show-team-info'

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
}

const GameDisplay = ({ globals }: Props) => {
  const gameWindowWidth = +(THEME.spacing(77.5).slice(0, -2))
  const gameWindowHeight = +(THEME.spacing(67).slice(0, -2))

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
      <ShowDominoes globals={globals} windowHeight={gameWindowHeight} windowWidth={gameWindowWidth} />
    </StyledRoot>
  )
}

export default GameDisplay

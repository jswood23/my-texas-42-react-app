import { type DominoPlacement } from '../../types'
import Domino from '../domino'
import React from 'react'
import styled from 'styled-components'

const StyledRoot = styled.div({
  border: 'black 1px solid',
  width: '100%',
  height: '400px',
  position: 'relative',
  padding: 0
})

const DominoWindow = () => {
  const centerX = 500
  const centerY = 200
  const [nowX, setNowX] = React.useState(0)
  const [nowY, setNowY] = React.useState(0)

  const onClick = () => {
    setNowX(nowX + 15)
  }

  const onHover = () => {
    setNowY(-20)
  }

  const onBlur = () => {
    setNowY(0)
  }

  const p1: DominoPlacement = {
    startingX: centerX,
    startingY: centerY,
    currentX: nowX,
    currentY: nowY,
    size: 100,
    rotation: 0,
    duration: 0.2
  }

  return (
    <StyledRoot>
      <Domino
        onBlur={onBlur}
        onClick={onClick}
        onHover={onHover}
        placement={p1}
        type="3-4"
      />
    </StyledRoot>
  )
}

export default DominoWindow

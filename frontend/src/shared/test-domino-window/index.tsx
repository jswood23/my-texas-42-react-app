import { type DominoPlacement } from '../../types'
import Domino from '../domino'
import styled from 'styled-components'

const DominoWindow = () => {
  const centerX = 150
  const centerY = 200

  const StyledRoot = styled.div({
    border: 'black 1px solid',
    width: '100%',
    height: '400px',
    position: 'relative'
  })

  const p1: DominoPlacement = {
    xPos: centerX,
    yPos: centerY,
    size: 300,
    rotation: 0
  }

  return (
    <StyledRoot>
      <Domino placement={p1} type="3-4" />
    </StyledRoot>
  )
}

export default DominoWindow

import { type DominoPlacement } from '../../types'
import styled from 'styled-components'
import { THEME } from '../../constants/theme'
import { Box } from '@mui/material'

interface Props {
  onClick: () => void
  onHover: () => void
  onDrag: () => void
  onBlur: () => void
  placement: DominoPlacement
  type: string
}

const defaultProps = {
  onBlur: () => {},
  onClick: () => {},
  onDrag: () => {},
  onHover: () => {}
}

interface StyledProps {
  onClick: () => void
  onMouseOver: () => void
  onDrag: () => void
  onMouseOut: () => void
  centerX: number
  centerY: number
  multiplier: number
  placement: DominoPlacement
  squareSize: number
  strokeWidth: number
}

const StyledRoot = styled(Box)<StyledProps>(({
  centerX,
  centerY,
  multiplier,
  placement,
  squareSize,
  strokeWidth
}) => ({
  backgroundColor: '#FFFEF5',
  border: `black ${strokeWidth}px solid`,
  borderRadius: '10%',
  height: `${squareSize * 2}`,
  width: `${squareSize}`,
  display: 'flex',
  flexDirection: 'column',

  position: 'absolute',
  left: `${centerX}px`,
  top: `${centerY}px`,
  rotate: `${placement.rotation}deg`,
  scale: `${multiplier}`,
  translate: `${placement.currentX}px ${placement.currentY}px`,
  transition: '0.2s ease-in-out',

  '.separator-line': {
    position: 'absolute',
    top: 0
  }
}))

const Domino = ({
  onBlur,
  onClick,
  onDrag,
  onHover,
  placement,
  type
}: Props) => {
  const multiplier = placement.size / 300
  const strokeWidth = 2
  const space = 25
  const squareSize = space * 6
  const dotSize = space * 0.6

  const centerX = placement.startingX - 75
  const centerY = placement.startingY - 150

  const SeparatorLine = (
    <div className="separator-line">
      <svg width={squareSize} height={squareSize * 2} stroke="black">
        <line x1="0" y1={squareSize} x2={squareSize} y2={squareSize} strokeWidth={strokeWidth} />
      </svg>
    </div>
  )

  const returnDots = (type: string) => {
    const zeroDot = (
      <svg width={squareSize} height={squareSize}>
      </svg>
    )
    const oneDot = (
      <svg width={squareSize} height={squareSize} fill={THEME.palette.domino.color1}>
        <circle cx={space * 3} cy={space * 3} r={dotSize} />
      </svg>
    )
    const twoDot = (
      <svg width={squareSize} height={squareSize} fill={THEME.palette.domino.color2}>
        <circle cx={space * 5} cy={space} r={dotSize} />
        <circle cx={space} cy={space * 5} r={dotSize} />
      </svg>
    )
    const threeDot = (
      <svg width={squareSize} height={squareSize} fill={THEME.palette.domino.color3}>
        <circle cx={space * 5} cy={space} r={dotSize} />
        <circle cx={space * 3} cy={space * 3} r={dotSize} />
        <circle cx={space} cy={space * 5} r={dotSize} />
      </svg>
    )
    const fourDot = (
      <svg width={squareSize} height={squareSize} fill={THEME.palette.domino.color4}>
        <circle cx={space} cy={space} r={dotSize} />
        <circle cx={space * 5} cy={space} r={dotSize} />
        <circle cx={space} cy={space * 5} r={dotSize} />
        <circle cx={space * 5} cy={space * 5} r={dotSize} />
      </svg>
    )
    const fiveDot = (
      <svg width={squareSize} height={squareSize} fill={THEME.palette.domino.color5}>
        <circle cx={space} cy={space} r={dotSize} />
        <circle cx={space * 5} cy={space} r={dotSize} />
        <circle cx={space} cy={space * 5} r={dotSize} />
        <circle cx={space * 5} cy={space * 5} r={dotSize} />
        <circle cx={space * 3} cy={space * 3} r={dotSize} />
      </svg>
    )
    const sixDot = (
      <svg width={squareSize} height={squareSize} fill={THEME.palette.domino.color6}>
        <circle cx={space} cy={space} r={dotSize} />
        <circle cx={space} cy={space * 3} r={dotSize} />
        <circle cx={space} cy={space * 5} r={dotSize} />
        <circle cx={space * 5} cy={space} r={dotSize} />
        <circle cx={space * 5} cy={space * 3} r={dotSize} />
        <circle cx={space * 5} cy={space * 5} r={dotSize} />
      </svg>
    )

    const sides = type.split('-')
    return sides.map((side: string) => {
      switch (parseInt(side)) {
        case 0:
          return zeroDot
        case 1:
          return oneDot
        case 2:
          return twoDot
        case 3:
          return threeDot
        case 4:
          return fourDot
        case 5:
          return fiveDot
        case 6:
          return sixDot
        default:
          return zeroDot
      }
    })
  }

  return (
    <StyledRoot
      onMouseOut={onBlur}
      onClick={onClick}
      onDrag={onDrag}
      onMouseOver={onHover}

      centerX={centerX}
      centerY={centerY}
      multiplier={multiplier}
      placement={placement}
      squareSize={squareSize}
      strokeWidth={strokeWidth}
    >
      {SeparatorLine}
      {returnDots(type)}
    </StyledRoot>
  )
}

Domino.defaultProps = defaultProps

export default Domino

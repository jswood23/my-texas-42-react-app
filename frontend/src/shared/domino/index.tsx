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
  duration: number
  multiplier: number
  rotation: number
  squaresize: number
  strokewidth: number
  xpos: number
  ypos: number
}

const StyledRoot = styled.div<StyledProps>(({
  duration,
  multiplier,
  rotation,
  squaresize,
  strokewidth,
  xpos,
  ypos
}) => {
  console.log(`${rotation}deg`)
  return ({
    '.domino-box': {
      backgroundColor: '#FFFEF5',
      border: `black ${strokewidth}px solid`,
      borderRadius: '10%',
      height: `${squaresize * 2}px`,
      width: `${squaresize}px`,
      display: 'flex',
      flexDirection: 'column',

      position: 'absolute',
      left: `${xpos}px`,
      top: `${ypos}px`,
      transition: `${duration}s ease-in-out`,
      rotate: `${rotation}deg`,
      scale: `${multiplier}`
    },
    '.separator-line': {
      position: 'absolute',
      top: 0
    }
  })
})

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

  const centerX = placement.startingX - 75 + placement.currentX
  const centerY = placement.startingY - 150 + placement.currentY

  const SeparatorLine = (
    <div className="separator-line">
      <svg width={squareSize} height={squareSize * 2} stroke="black">
        <line x1="0" y1={squareSize} x2={squareSize - strokeWidth} y2={squareSize} strokeWidth={strokeWidth} />
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
      duration={placement.duration}
      multiplier={multiplier}
      rotation={placement.rotation}
      squaresize={squareSize}
      strokewidth={strokeWidth}
      xpos={centerX}
      ypos={centerY}
    >
      <Box
        className="domino-box"
        onMouseOut={onBlur}
        onClick={onClick}
        onDrag={onDrag}
        onMouseOver={onHover}
      >
        {SeparatorLine}
        {returnDots(type)}
      </Box>
    </StyledRoot>
  )
}

Domino.defaultProps = defaultProps

export default Domino

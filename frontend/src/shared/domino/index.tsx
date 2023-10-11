import { Box } from '@mui/material'
import { type DominoPlacement } from '../../types'
import { THEME } from '../../constants/theme'
import * as React from 'react'
import styled from 'styled-components'

interface Props {
  clickable?: boolean
  disabled?: boolean
  onClick?: () => void
  onHover?: () => void
  onDrag?: () => void
  onBlur?: () => void
  placement: DominoPlacement
  type: string
}

const defaultProps = {
  clickable: false,
  disabled: false,
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
  strokeWidth: number
  xpos: number
  ypos: number
}

const StyledRoot = styled.div<StyledProps>(({
  duration,
  multiplier,
  rotation,
  squaresize,
  strokeWidth,
  xpos,
  ypos
}) => {
  return ({
    '.clickable': {
      cursor: 'pointer'
    },
    '.disabled-box': {
      borderRadius: '10%',
      position: 'absolute',
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, .2)'
    },
    '.domino-box': {
      backgroundColor: '#FFFEF5',
      border: `black ${strokeWidth}px solid`,
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
  clickable,
  disabled,
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

  const clickableClassName = React.useMemo(() => (clickable && !disabled) ? 'clickable' : '', [clickable, disabled])

  const SeparatorLine = React.useMemo(() => (
    <div className="separator-line">
      <svg width={squareSize} height={squareSize * 2} stroke="black">
        <line x1="0" y1={squareSize} x2={squareSize - strokeWidth} y2={squareSize} strokeWidth={strokeWidth} />
      </svg>
    </div>
  ), [])

  const returnDots = React.useCallback((type: string) => {
    const zeroDot = (key: number) => (
      <svg key={key} width={squareSize} height={squareSize}>
      </svg>
    )
    const oneDot = (key: number) => (
      <svg key={key} width={squareSize} height={squareSize} fill={THEME.palette.domino.color1}>
        <circle cx={space * 3} cy={space * 3} r={dotSize} />
      </svg>
    )
    const twoDot = (key: number) => (
      <svg key={key} width={squareSize} height={squareSize} fill={THEME.palette.domino.color2}>
        <circle cx={space * 5} cy={space} r={dotSize} />
        <circle cx={space} cy={space * 5} r={dotSize} />
      </svg>
    )
    const threeDot = (key: number) => (
      <svg key={key} width={squareSize} height={squareSize} fill={THEME.palette.domino.color3}>
        <circle cx={space * 5} cy={space} r={dotSize} />
        <circle cx={space * 3} cy={space * 3} r={dotSize} />
        <circle cx={space} cy={space * 5} r={dotSize} />
      </svg>
    )
    const fourDot = (key: number) => (
      <svg key={key} width={squareSize} height={squareSize} fill={THEME.palette.domino.color4}>
        <circle cx={space} cy={space} r={dotSize} />
        <circle cx={space * 5} cy={space} r={dotSize} />
        <circle cx={space} cy={space * 5} r={dotSize} />
        <circle cx={space * 5} cy={space * 5} r={dotSize} />
      </svg>
    )
    const fiveDot = (key: number) => (
      <svg key={key} width={squareSize} height={squareSize} fill={THEME.palette.domino.color5}>
        <circle cx={space} cy={space} r={dotSize} />
        <circle cx={space * 5} cy={space} r={dotSize} />
        <circle cx={space} cy={space * 5} r={dotSize} />
        <circle cx={space * 5} cy={space * 5} r={dotSize} />
        <circle cx={space * 3} cy={space * 3} r={dotSize} />
      </svg>
    )
    const sixDot = (key: number) => (
      <svg key={key} width={squareSize} height={squareSize} fill={THEME.palette.domino.color6}>
        <circle cx={space} cy={space} r={dotSize} />
        <circle cx={space} cy={space * 3} r={dotSize} />
        <circle cx={space} cy={space * 5} r={dotSize} />
        <circle cx={space * 5} cy={space} r={dotSize} />
        <circle cx={space * 5} cy={space * 3} r={dotSize} />
        <circle cx={space * 5} cy={space * 5} r={dotSize} />
      </svg>
    )

    const sides = type.split('-')
    let i = -1
    return sides.map((side: string) => {
      i += 1
      switch (parseInt(side)) {
        case 0:
          return zeroDot(i)
        case 1:
          return oneDot(i)
        case 2:
          return twoDot(i)
        case 3:
          return threeDot(i)
        case 4:
          return fourDot(i)
        case 5:
          return fiveDot(i)
        case 6:
          return sixDot(i)
        default:
          return zeroDot(1)
      }
    })
  }, [type])

  return (
    <StyledRoot
      duration={placement.duration}
      multiplier={multiplier}
      rotation={-placement.rotation}
      squaresize={squareSize}
      strokeWidth={strokeWidth}
      xpos={centerX}
      ypos={centerY}
    >
      <Box
        className={`domino-box ${clickableClassName}`}
        onMouseOut={onBlur}
        onClick={onClick}
        onDrag={onDrag}
        onMouseOver={onHover}
      >
        {Boolean(type) && SeparatorLine}
        {returnDots(type)}
        {disabled &&
          <div
            className='disabled-box'
          />
        }
      </Box>
    </StyledRoot>
  )
}

Domino.defaultProps = defaultProps

export default Domino

import { Box, IconButton } from '@mui/material'
import { ArrowLeft, ArrowRight } from '@mui/icons-material'
import * as React from 'react'
import styled from 'styled-components'
import GameButton from '../game-button'

interface Props {
  xpos: number
  ypos: number
  width: number
  height: number
  fontSize: number
  onChoose: (num: number) => void
  min: number
  max: number
}

interface StyledProps {
  xpos: number
  ypos: number
  size: number
  rotation: number
}

const Triangle = styled(Box)<StyledProps>`
.triangle {
  position: absolute;
  left: ${props => props.xpos}px;
  top: ${props => props.ypos}px;
  background-color: ${props => props.theme.palette.primary.alt};
  text-align: left;
}
.triangle:before,
.triangle:after {
  content: '';
  position: absolute;
  background-color: inherit;
}
.triangle,
.triangle:before,
.triangle:after {
  width:  ${props => props.size}px;
  height: ${props => props.size}px;
  border-top-right-radius: 30%;
}

.triangle {
  transform: rotate(-60deg) skewX(-30deg) scale(1,.866);
}
.triangle:before {
  transform: rotate(-135deg) skewX(-45deg) scale(1.414,.707) translate(0,-50%);
}
.triangle:after {
  transform: rotate(135deg) skewY(-45deg) scale(.707,1.414) translate(50%);
}
`

const GameNumberPicker = ({ xpos, ypos, width, height, fontSize, onChoose, min, max }: Props) => {
  const [currentNumber, setCurrentNumber] = React.useState(min + 1)
  const showDownArrow = currentNumber > min
  const showUpArrow = currentNumber < max
  const buttonWidth = Math.round(width / 4)

  const onClickUpButton = () => {
    console.log('clicking up')
  }

  const onClickDownButton = () => {
    console.log('clicking down')
  }

  return (
    <>
      {showDownArrow &&
        <Triangle
          xpos={xpos}
          ypos={ypos}
          size={height * 0.5}
          rotation={90}
          onClick={onClickDownButton}
        >
          <div className='triangle'></div>
        </Triangle>
      }
      <GameButton
        xpos={xpos + buttonWidth}
        ypos={ypos}
        width={buttonWidth * 2}
        height={height}
        text={currentNumber.toString()}
        fontSize={fontSize}
        onClick={() => { onChoose(currentNumber) }}
      />
    </>
  )
}

export default GameNumberPicker

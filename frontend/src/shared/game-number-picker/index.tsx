import { Box } from '@mui/material'
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

const TriangleRoot = styled(Box)<StyledProps>(({ xpos, ypos, size, rotation }) => ({
  position: 'absolute',
  left: `${xpos}px`,
  top: `${ypos}px`,
  scale: `${size / 100}`,
  rotate: `${rotation}deg`
}))

const Triangle = styled.div`
.triangle {
  position: absolute;
  left: -50px;
  top: -80px;
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
  width:  100px;
  height: 100px;
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

.triangle:hover {
  background-color: ${props => props.theme.palette.primary.main};
  cursor: pointer;
}
`

const GameNumberPicker = ({ xpos, ypos, width, height, fontSize, onChoose, min, max }: Props) => {
  const [currentNumber, setCurrentNumber] = React.useState(min + 1)
  const showDownArrow = currentNumber > min
  const showUpArrow = currentNumber < max
  const buttonWidth = Math.round(width / 4)
  const yOffset = buttonWidth * 0.56

  const onClickUpButton = () => {
    setCurrentNumber(currentNumber + 1)
  }

  const onClickDownButton = () => {
    setCurrentNumber(currentNumber - 1)
  }

  return (
    <>
      {showDownArrow &&
        <TriangleRoot
          xpos={xpos + buttonWidth / 2}
          ypos={ypos + yOffset}
          size={height * 0.5}
          rotation={-90}
          onClick={onClickDownButton}
        >
          <Triangle>
            <div className='triangle'></div>
          </Triangle>
        </TriangleRoot>
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
      {showUpArrow &&
        <TriangleRoot
          xpos={xpos + width - buttonWidth / 2}
          ypos={ypos + yOffset}
          size={height * 0.5}
          rotation={90}
          onClick={onClickUpButton}
        >
          <Triangle>
            <div className='triangle'></div>
          </Triangle>
        </TriangleRoot>
      }
    </>
  )
}

export default GameNumberPicker

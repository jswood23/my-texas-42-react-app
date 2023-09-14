import { Box, Button } from '@mui/material'
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

const GameNumberPicker = ({ xpos, ypos, width, height, fontSize, onChoose, min, max }: Props) => {
  const [currentNumber, setCurrentNumber] = React.useState(min)
  const showDownArrow = currentNumber > min
  const showUpArrow = currentNumber < max
  const buttonWidth = Math.round(width / 3)

  return (
    <>
      <GameButton
        xpos={xpos + buttonWidth}
        ypos={ypos}
        width={buttonWidth}
        height={height}
        text={currentNumber.toString()}
        fontSize={fontSize}
        onClick={() => { onChoose(currentNumber) }}
      />
    </>
  )
}

export default GameNumberPicker

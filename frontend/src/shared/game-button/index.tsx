import { Button } from '@mui/material'
import * as React from 'react'
import styled from 'styled-components'

interface Props {
  xpos: number
  ypos: number
  width: number
  height: number
  text: string
  disabled: boolean
  onClick: () => void
}

const defaultProps = {
  disabled: false,
  onClick: () => {}
}

interface StyledProps {
  xpos: number
  ypos: number
  width: number
  height: number
}

const StyledButton = styled(Button)<StyledProps>(({ theme, xpos, ypos, width, height }) => {
  return ({
    position: 'absolute',
    left: `${xpos}px`,
    top: `${ypos}px`,
    width: `${width}px`,
    height: `${height}px`
  })
})

const GameButton = ({ xpos, ypos, width, height, text, disabled, onClick }: Props) => {
  return (
    <StyledButton
      xpos={xpos}
      ypos={ypos}
      width={width}
      height={height}
      onClick={onClick}
    >
      {text}
    </StyledButton>
  )
}

GameButton.defaultProps = defaultProps

export default GameButton

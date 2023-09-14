import { Button } from '@mui/material'
import styled from 'styled-components'

interface Props {
  xpos: number
  ypos: number
  width: number
  height: number
  text: string
  fontSize: number
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
  fs: number
}

const StyledRoot = styled.div<StyledProps>(({ theme, xpos, ypos, width, height, fs }) => ({
  position: 'absolute',
  left: `${xpos}px`,
  top: `${ypos}px`,
  width: `${width}px`,
  height: `${height}px`,
  '.game-button': {
    backgroundColor: theme.palette.primary.alt,
    color: theme.palette.secondary.main,
    padding: 0,
    width: '100%',
    height: '100%',
    fontSize: `${fs}px`,
    fontWeight: 'bold',
    letterSpacing: '2px',
    '&:hover': {
      color: theme.palette.secondary.alt,
      backgroundColor: theme.palette.primary.main
    }
  }
}))

const GameButton = ({ xpos, ypos, width, height, text, fontSize, disabled, onClick }: Props) => {
  return (
    <StyledRoot
      xpos={xpos}
      ypos={ypos}
      width={width}
      height={height}
      fs={fontSize}
    >
      <Button
        className="game-button"
        variant="contained"
        disabled={disabled}
        onClick={onClick}
      >
        {text}
      </Button>
    </StyledRoot>
  )
}

GameButton.defaultProps = defaultProps

export default GameButton

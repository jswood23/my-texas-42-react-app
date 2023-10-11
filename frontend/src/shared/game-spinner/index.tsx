import { CircularProgress } from '@mui/material'
import styled from 'styled-components'

interface Props {
  xpos: number
  ypos: number
  size: number
}

const StyledRoot = styled.div<Props>(({ theme, xpos, ypos, size }) => ({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  left: `${xpos - size / 2}px`,
  top: `${ypos - size / 2}px`,
  width: `${size}px`,
  height: `${size}px`,
  scale: `${size / 40}`
}))

const GameSpinner = ({ xpos, ypos, size }: Props) => {
  return (
    <>
      <StyledRoot
        xpos={xpos}
        ypos={ypos}
        size={size}
      >
        <CircularProgress />
      </StyledRoot>
    </>
  )
}

export default GameSpinner

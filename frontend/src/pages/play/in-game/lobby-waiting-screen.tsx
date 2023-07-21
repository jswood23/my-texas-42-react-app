import type { GlobalObj } from '../../../types'
import { Typography } from '@mui/material'
import styled from 'styled-components'

const StyledRoot = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: theme.isMobile ? 'column' : 'row'
}))

interface Props {
  globals: GlobalObj
}

const LobbyWaitingScreen = ({ globals }: Props) => {
  return (
    <StyledRoot>
      <Typography>Waiting on players...</Typography>
    </StyledRoot>
  )
}

export default LobbyWaitingScreen

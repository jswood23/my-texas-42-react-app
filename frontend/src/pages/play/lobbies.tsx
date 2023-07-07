import { AddCircle } from '@mui/icons-material'
import { Button } from '@mui/material'
import { GAME_STAGES } from '../../constants'
import type { OpenAlert, UserData } from '../../types'
import styled from 'styled-components'

interface Props {
  onChangeStage: (newStage: string) => void
  openAlert: OpenAlert
  userData: UserData
}

const StyledRoot = styled.div(({ theme }) => ({
  '.new-game-button': {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.alt,
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(2),
    minHeight: theme.isMobile ? theme.spacing(6) : theme.spacing(4),
    minWidth: theme.spacing(13),
    '&:hover': {
      color: theme.palette.secondary.alt,
      backgroundColor: theme.palette.primary.main
    }
  },
  '.new-game-button-container': {
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
  },
  '.new-game-icon': {
    marginRight: theme.spacing(1)

  }
}))

const Lobbies = ({ onChangeStage, openAlert, userData }: Props) => {
  const onClickStartNewGame = () => { onChangeStage(GAME_STAGES.NEW_GAME_STAGE) }

  return (
    <StyledRoot>
      <div className='new-game-button-container'>
        <Button
          className='new-game-button'
          variant='contained'
          onClick={onClickStartNewGame}
        >
          <AddCircle className='new-game-icon' />
          Start new game
        </Button>
      </div>
    </StyledRoot>
  )
}

export default Lobbies

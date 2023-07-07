import { AddCircle } from '@mui/icons-material'
import { Button, Divider, Typography } from '@mui/material'
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
  '.centered-item-container': {
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
  },
  '.new-game-icon': {
    marginRight: theme.spacing(1)
  },
  '.or-divider': {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: theme.isMobile ? '75%' : '50%',
    '.or-text': {
      color: theme.palette.light.main,
      fontSize: theme.spacing(2),
      fontStyle: 'italic'
    }
  }
}))

const Lobbies = ({ onChangeStage, openAlert, userData }: Props) => {
  const onClickStartNewGame = () => { onChangeStage(GAME_STAGES.NEW_GAME_STAGE) }

  return (
    <StyledRoot>
      <div className="centered-item-container">
        <Button
          className="new-game-button"
          variant="contained"
          onClick={onClickStartNewGame}
        >
          <AddCircle className="new-game-icon" />
          Start new game
        </Button>
      </div>
      <div className="centered-item-container">
        <Divider className="or-divider">
          <Typography className="or-text">or</Typography>
        </Divider>
      </div>
    </StyledRoot>
  )
}

export default Lobbies

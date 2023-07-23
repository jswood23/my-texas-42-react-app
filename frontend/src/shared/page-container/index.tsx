import { CircularProgress, Container, Typography } from '@mui/material'
import type { GlobalObj } from '../../types'
import styled from 'styled-components'
import { limitString } from '../../utils/string-utils'

interface Props {
  action?: any
  children?: any
  globals: GlobalObj
  isLoading?: boolean
  title: string
}

const StyledRoot = styled(Container)(({ theme }) => ({
  '.page-container': {
    backgroundColor: 'white',
    minHeight: theme.isMobile ? '560px' : '800px',
    width: '100%',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(10),
    padding: theme.spacing(2),

    border: '1px solid #A0A0A0',
    borderRadius: '5px',
    boxShadow: '0 2px 5px 3px #E0E0E0'
  },
  '.circular-progress-container': {
    width: '100%',
    height: theme.isMobile ? '400px' : '600px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  '.page-header': {
    fontSize: theme.isMobile ? theme.spacing(2.5) : theme.spacing(4),
    fontWeight: 'bold'
  },
  '.row-multiple-items': {
    display: 'flex',
    width: '100%'
  },
  '.item-align-left': {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
    flexBasis: '80%'
  },
  '.item-align-right': {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexBasis: '20%'
  }
}))

const PageContainer = ({ action, children, globals, isLoading = false, title }: Props) => {
  const titleCharLimit = globals.isMobile ? 18 : 40
  const limitedTitle = limitString(title, titleCharLimit)
  return (
    <StyledRoot>
      <Container fixed className='page-container'>
        <div className="row-multiple-items">
          <div className="item-align-left">
            <Typography className='page-header'>
              {limitedTitle}
            </Typography>
          </div>
          <div className="item-align-right">
            {action}
          </div>
        </div>
        <hr />
        {isLoading
          ? (
          <div className="circular-progress-container">
            <CircularProgress />
          </div>
            )
          : (
              children
            )}
      </Container>
    </StyledRoot>
  )
}

export default PageContainer

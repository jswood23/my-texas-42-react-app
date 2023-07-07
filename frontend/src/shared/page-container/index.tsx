import { CircularProgress, Container, Typography } from '@mui/material'
import type { OpenAlert, UserData } from '../../types'
import styled from 'styled-components'

interface Props {
  action?: any
  children?: any
  isLoading?: boolean
  openAlert: OpenAlert
  title: string
  userData: UserData
}

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: 'white',
  minHeight: theme.isMobile ? '560px' : '800px',
  width: '100%',
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),

  border: '1px solid #A0A0A0',
  borderRadius: '5px',
  boxShadow: '0 2px 5px 3px #E0E0E0',
  '.circular-progress-container': {
    width: '100%',
    height: theme.isMobile ? '400px' : '600px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  '.page-header': {
    fontSize: theme.spacing(4),
    fontWeight: 'bold'
  },
  '.row-multiple-items': {
    display: 'flex',
    width: '100%'
  },
  '.item-align-left': {
    display: 'flex',
    justifyContent: 'flex-start',
    flexBasis: '50%'
  },
  '.item-align-right': {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexBasis: '50%'
  }
}))

const PageContainer = ({ action, children, isLoading = false, openAlert, title, userData }: Props) => {
  return (
    <StyledContainer fixed>
      <div className="row-multiple-items">
        <div className="item-align-left">
          <Typography className='page-header'>
            {title}
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
    </StyledContainer>
  )
}

export default PageContainer

import { CircularProgress, Container } from '@mui/material'
import { isMobile } from 'react-device-detect'
import type { OpenAlert, UserData } from '../../types'
import * as React from 'react'
import styled from 'styled-components'

interface Props {
  children?: any
  isLoading?: boolean
  openAlert: OpenAlert
  title: string
  userData: UserData
}

const StyledContainer = styled(Container)(({ theme }) => ({
  // backgroundColor: THEME.palette.secondary.main,
  backgroundColor: 'white',
  minHeight: isMobile ? '560px' : '800px',
  width: '100%',
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),

  border: '1px solid #A0A0A0',
  borderRadius: '5px',
  boxShadow: '0 2px 5px 3px #E0E0E0',
  '.circular-progress-container': {
    width: '100%',
    height: isMobile ? '400px' : '600px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

const PageContainer = ({ children, isLoading = false, openAlert, title, userData }: Props) => {
  return (
    <StyledContainer fixed>
      <h1>{title}</h1>
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

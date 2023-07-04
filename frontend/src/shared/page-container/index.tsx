import { CircularProgress, Container } from '@mui/material'
import type { OpenAlert, UserData } from '../../types'
import { THEME } from '../../constants/theme'
import * as React from 'react'

interface Props {
  children?: any
  isLoading?: boolean
  openAlert: OpenAlert
  title: string
  userData: UserData
}

const PageContainer = ({ children, isLoading = false, openAlert, title, userData }: Props) => {
  const [pageHeight, setPageHeight] = React.useState(0)

  React.useEffect(() => {
    setPageHeight(window.innerHeight - 140)
  }, [])

  const classes = {
    backdrop: {
      // backgroundColor: THEME.palette.secondary.main,
      backgroundColor: 'white',
      minHeight: pageHeight,
      width: '100%',
      marginTop: THEME.spacing(2),
      padding: THEME.spacing(2),

      border: '1px solid #A0A0A0',
      borderRadius: '5px',
      boxShadow: '0 2px 5px 3px #E0E0E0'
    }
  }

  return (
    <Container fixed style={classes.backdrop}>
      <h1>{title}</h1>
      <hr />
      {isLoading ? <CircularProgress /> : children}
    </Container>
  )
}

export default PageContainer

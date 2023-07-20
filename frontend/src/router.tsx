import { Auth } from 'aws-amplify'
import { Navigate, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { defaultUserData, requireLoginPages } from './constants'
import * as React from 'react'
import Homepage from './pages/home'
import LoginPage from './pages/users/login'
import Navbar from './shared/navbar'
import PlayPage from './pages/play'
import ProfilePage from './pages/users/profile'
import Rulespage from './pages/rules'
import SignupPage from './pages/users/signup'
import SnackbarAlert from './shared/snackbar-alert'
import { type GlobalObj } from './types'

const RouterElements = () => {
  // snackbar alert logic
  const defaultSnackbarData = {
    open: false,
    message: 'Default snackbar message',
    severity: 'info'
  }
  const [snackbarData, setSnackbarData] = React.useState(defaultSnackbarData)
  const handleClose = (event: unknown, reason: string) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbarData(defaultSnackbarData)
  }
  const openAlert = (message = '', severity = 'info') => {
    setSnackbarData({
      open: true,
      message,
      severity
    })
  }

  // get user data from amplify auth
  const [userData, setUserData] = React.useState(defaultUserData)
  const location = useLocation()
  const navigate = useNavigate()
  React.useEffect(() => {
    const getAuthData = async () => {
      try {
        const authData = await Auth.currentAuthenticatedUser()
        setUserData({ ...authData, exists: true })
      } catch {
        setUserData(defaultUserData)
        if (requireLoginPages.includes(location.pathname)) {
          openAlert('You need to be signed in to access this page.', 'info')
          navigate('/')
        }
      }
    }
    getAuthData()
  }, [location, navigate])

  const globals: GlobalObj = {
    openAlert: (message: string, severity: string) => { openAlert(message, severity) },
    userData
  }

  return (
    <>
      <Navbar globals={globals} />
      <Routes>
          <Route
            path="/"
            element={<Homepage globals={globals} />}
          />
          <Route path="/home" element={<Navigate to="/" />} />
          <Route
            path="/rules"
            element={<Rulespage globals={globals} />}
          />
          {!userData.exists && <>
            <Route
              path='/login'
              element={<LoginPage globals={globals} />}
            />
            <Route
              path='/signup'
              element={<SignupPage globals={globals} />}
            />
          </>}
          {userData.exists && <>
            <Route
              path='/profile'
              element={<ProfilePage globals={globals} />}
            />
            <Route
              path='/play'
              element={<PlayPage globals={globals} />}
            />
          </>}
      </Routes>
      <SnackbarAlert
          handleClose={handleClose}
          message={snackbarData.message}
          open={snackbarData.open}
          severity={snackbarData.severity}
      />
    </>
  )
}

export default RouterElements

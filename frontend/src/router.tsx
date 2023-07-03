import { Auth } from 'aws-amplify'
import { Navigate, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { defaultUserData, requireLoginPages } from './constants'
import * as React from 'react'
import Homepage from './pages/home'
import LoginPage from './pages/users/login'
import Navbar from './shared/navbar'
import ProfilePage from './pages/users/profile'
import Rulespage from './pages/rules'
import SignupPage from './pages/users/signup'
import SnackbarAlert from './shared/snackbar-alert'

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

  return (
    <>
      <Navbar openAlert={openAlert} userData={userData} />
      <Routes>
          <Route
            path="/"
            element={<Homepage openAlert={openAlert} userData={userData} />}
          />
          <Route path="/home" element={<Navigate to="/" />} />
          <Route
            path="/rules"
            element={<Rulespage openAlert={openAlert} userData={userData} />}
          />
          {!userData.exists && <>
            <Route
              path='/login'
              element={<LoginPage openAlert={openAlert} userData={userData} />}
            />
            <Route
              path='/signup'
              element={<SignupPage openAlert={openAlert} userData={userData} />}
            />
          </>}
          {userData.exists && <>
            <Route
              path='/profile'
              element={<ProfilePage openAlert={openAlert} userData={userData} />}
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

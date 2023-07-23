import { Auth } from 'aws-amplify'
import { Navigate, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { CONNECTION_STATES, defaultGameState, defaultUserData, requireLoginPages } from './constants'
import { isMobile } from 'react-device-detect'
import { type WebSocketConnection, type GlobalObj } from './types'
import * as React from 'react'
import Homepage from './pages/home'
import LoginPage from './pages/users/login'
import Navbar from './shared/navbar'
import PlayPage from './pages/play'
import ProfilePage from './pages/users/profile'
import Rulespage from './pages/rules'
import SignupPage from './pages/users/signup'
import SnackbarAlert from './shared/snackbar-alert'
import useWebSocket, { ReadyState } from 'react-use-websocket'

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

  // get connection data and functions
  const defaultSocketUrl: any = null
  const [socketUrl, setSocketUrl] = React.useState(defaultSocketUrl)
  const [queryParams, setQueryParams] = React.useState({})
  const connectionParams = socketUrl ? { queryParams } : {}
  const { getWebSocket, lastMessage, readyState, sendJsonMessage } = useWebSocket(socketUrl, connectionParams)
  const connectionStatus = {
    [ReadyState.CONNECTING]: CONNECTION_STATES.connecting,
    [ReadyState.OPEN]: CONNECTION_STATES.open,
    [ReadyState.CLOSING]: CONNECTION_STATES.closing,
    [ReadyState.CLOSED]: CONNECTION_STATES.closed,
    [ReadyState.UNINSTANTIATED]: CONNECTION_STATES.uninstantiated
  }[readyState]
  const prevConnectionStatus = React.useRef<string>(connectionStatus)
  React.useEffect(() => {
    switch (connectionStatus) {
      case CONNECTION_STATES.open: {
        openAlert('Connected to lobby.', 'info')
        break
      }
      case CONNECTION_STATES.connecting: {
        break
      }
      default: {
        if (prevConnectionStatus.current === CONNECTION_STATES.open) {
          openAlert('Lobby connection closed.', 'info')
        }
        break
      }
    }
    prevConnectionStatus.current = connectionStatus
  }, [connectionStatus])
  const connection: WebSocketConnection = {
    connectionStatus,
    disconnect: () => getWebSocket()?.close(),
    lastMessage,
    queryParams,
    setQueryParams,
    setSocketUrl,
    sendJsonMessage,
    socketUrl,
    readyState
  }

  // game state
  const [gameState, setGameState] = React.useState(defaultGameState)

  const globals: GlobalObj = {
    connection,
    gameState,
    setGameState,
    isMobile,
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

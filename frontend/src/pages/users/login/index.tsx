import { Box, Button, CircularProgress, Collapse, FormControl, TextField } from '@mui/material'
import { Auth } from 'aws-amplify'
import type { OpenAlert, UserData } from '../../../types'
import { useNavigate } from 'react-router-dom'
import { THEME } from '../../../constants/theme'
import { validateField } from '../../../utils/user-utils'
import * as React from 'react'
import ConfirmUserForm from '../confirm-user-form'
import PageContainer from '../../../shared/page-container'

const classes = {
  formContainer: THEME.form.container,
  formWindow: THEME.form.window,
  textInput: THEME.form.input
}

interface Props {
  openAlert: OpenAlert
  userData: UserData
}

const LoginPage = ({ openAlert, userData }: Props) => {
  const initialValues = {
    username: '',
    password: ''
  }

  const [confirmingUser, setConfirmingUser] = React.useState(false)
  const [username, setUsername] = React.useState(initialValues.username)
  const [password, setPassword] = React.useState(initialValues.password)
  const [errors, setErrors] = React.useState({ hasError: false, username: null, password: null })
  const [isLoading, setIsLoading] = React.useState(false)

  const navigate = useNavigate()
  const defaultUsername = username
  const defaultPassword = password
  const disableSubmitButton = confirmingUser || isLoading || Object.values(errors).some((e: any) => e?.hasError)

  const goToSignUp = React.useCallback(() => {
    navigate('/signup')
  }, [navigate])

  const goToHome = React.useCallback(() => {
    navigate('/')
  }, [navigate])

  const runValidationTasks = React.useCallback(
    (fieldName: string, currentValue: string) => {
      const validations = {
        username: [{ type: 'Required' }],
        password: [{ type: 'Required' }]
      }
      const validationResponse = validateField(
        currentValue,
        (validations as any)[fieldName]
      )
      setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }))
      return validationResponse
    },
    []
  )

  const onChangeUsername = (e: { target: { value: string } }) => {
    const value = e.target.value
    if ((errors.username as any)?.hasError) {
      runValidationTasks('username', value)
    }
    setUsername(value)
  }

  const onChangePassword = (e: { target: { value: string } }) => {
    const value = e.target.value
    if ((errors.password as any)?.hasError) {
      runValidationTasks('password', value)
    }
    setPassword(value)
  }

  const onSubmit = React.useCallback(async () => {
    if (confirmingUser) return

    // Check validations before submitting
    runValidationTasks('username', username)
    runValidationTasks('password', password)

    if (
      Object.values(errors).some((e: any) => e?.hasError) ||
      !(username && password)
    ) {
      return
    }

    // Submit form
    try {
      setIsLoading(true)
      // const { user } = await Auth.signUp(modelFields);
      await Auth.signIn(username, password)
      openAlert('Signed in successfully!', 'success')
      goToHome()
    } catch (error: any) {
      let errorMessage = 'An error occurred while signing in.'
      if (error) {
        errorMessage = error.message
        if (error.message === 'User is not confirmed.') {
          setConfirmingUser(true)
        }
      }
      openAlert(errorMessage, 'error')
    }
    setIsLoading(false)
  }, [
    confirmingUser,
    errors,
    goToHome,
    openAlert,
    password,
    runValidationTasks,
    username
  ])

  React.useEffect(() => {
    const listener = (event: { code: string, preventDefault: () => void }) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault()
        onSubmit()
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [onSubmit])

  return (
    <PageContainer openAlert={openAlert} title="Login" userData={userData}>
      {/* @ts-expect-error TODO: add styled components */}
      <Box style={classes.formWindow}>
        {/* @ts-expect-error TODO: add styled components */}
        <Box style={classes.formContainer}>
          <FormControl>
            <TextField
              label="Username"
              id="username"
              autoComplete="on"
              autoFocus
              size="small"
              style={classes.textInput}
              value={username}
              onChange={onChangeUsername}
              onBlur={() => runValidationTasks('username', username)}
              helperText={(errors.username as any)?.errorMessage}
              error={(errors.username as any)?.hasError}
              disabled={confirmingUser}
            />

            <TextField
              label="Password"
              type="password"
              size="small"
              style={classes.textInput}
              value={password}
              onChange={onChangePassword}
              onBlur={() => runValidationTasks('password', password)}
              helperText={(errors.password as any)?.errorMessage}
              error={(errors.password as any)?.hasError}
              disabled={confirmingUser}
            />

            <Button
              type="submit"
              onClick={onSubmit}
              style={classes.textInput}
              disabled={disableSubmitButton}
            >
              {isLoading ? <CircularProgress size={20} /> : <>Login</>}
            </Button>

            <Button onClick={goToSignUp}>Create An Account</Button>
          </FormControl>
        </Box>
        {/* @ts-expect-error TODO: add styled components */}
        <Collapse style={classes.formContainer} in={confirmingUser}>
          <ConfirmUserForm
            defaultUsername={defaultUsername}
            defaultPassword={defaultPassword}
            openAlert={openAlert}
            userData={userData}
          />
        </Collapse>
      </Box>
    </PageContainer>
  )
}

export default LoginPage

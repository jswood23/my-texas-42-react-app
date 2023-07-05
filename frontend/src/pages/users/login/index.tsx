import { Button, CircularProgress, Collapse, FormControl, TextField } from '@mui/material'
import { Auth } from 'aws-amplify'
import type { OpenAlert, UserData } from '../../../types'
import { useNavigate } from 'react-router-dom'
import { validateField } from '../../../utils/user-utils'
import * as React from 'react'
import ConfirmUserForm from '../../../shared/confirm-user-form'
import PageContainer from '../../../shared/page-container'
import styled from 'styled-components'

const StyledRoot = styled.div(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  '.form-container': {
    width: theme.spacing(35),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  '.form-text-input': {
    width: '100%',
    marginTop: theme.spacing(3)
  }
}))

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
      <StyledRoot>
        <div className="form-container">
          <FormControl>
            <TextField
              label="Username"
              id="username"
              autoComplete="on"
              size="small"
              className="form-text-input"
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
              className="form-text-input"
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
              className="form-text-input"
              disabled={disableSubmitButton}
            >
              {isLoading ? <CircularProgress size={20} /> : <>Login</>}
            </Button>

            <Button onClick={goToSignUp}>Create An Account</Button>
          </FormControl>
        </div>
        <Collapse className="form-container" in={confirmingUser}>
          <ConfirmUserForm
            defaultUsername={defaultUsername}
            defaultPassword={defaultPassword}
            openAlert={openAlert}
            userData={userData}
          />
        </Collapse>
      </StyledRoot>
    </PageContainer>
  )
}

export default LoginPage

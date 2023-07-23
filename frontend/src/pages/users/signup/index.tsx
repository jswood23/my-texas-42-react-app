import { Alert, Button, CircularProgress, Collapse, FormControl, TextField } from '@mui/material'
import { Auth } from 'aws-amplify'
import type { GlobalObj } from '../../../types'
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
  },
  '.submit-button': {
    width: '100%',
    marginTop: theme.spacing(3),

    backgroundColor: theme.palette.primary.alt,
    color: theme.palette.secondary.main,
    fontSize: theme.spacing(2),
    marginBottom: theme.spacing(1),
    minHeight: theme.isMobile ? theme.spacing(6) : theme.spacing(4),
    '&:hover': {
      color: theme.palette.secondary.alt,
      backgroundColor: theme.palette.primary.main
    },
    '&.Mui-disabled': {
      backgroundColor: theme.palette.light.alt
    }
  }
}))

interface Props {
  globals: GlobalObj
}

const SignupPage = ({ globals }: Props) => {
  const initialValues = {
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  }

  const [confirmingUser, setConfirmingUser] = React.useState(false)
  const [email, setEmail] = React.useState(initialValues.email)
  const [username, setUsername] = React.useState(initialValues.username)
  const [password, setPassword] = React.useState(initialValues.password)
  const [selectedPassword, setSelectedPassword] = React.useState(false)
  const [confirmPassword, setConfirmPassword] = React.useState(
    initialValues.confirmPassword
  )
  const [errors, setErrors] = React.useState({ hasErrors: false, email: null, username: null, password: null, confirmPassword: null })
  const [isLoading, setIsLoading] = React.useState(false)

  const defaultUsername = username
  const defaultPassword = password
  const disableSubmitButton = confirmingUser || isLoading || Object.values(errors).some((e: any) => e?.hasError)

  const runValidationTasks = React.useCallback(
    (fieldName: string, currentValue: string) => {
      const validations = {
        email: [
          { type: 'Email' },
          { type: 'LessThanChar', numValues: [30] },
          { type: 'Required' }
        ],
        username: [
          { type: 'IsNonWhitespace' },
          { type: 'LessThanChar', numValues: [25] },
          { type: 'Required' }
        ],
        password: [
          { type: 'Required' },
          { type: 'GreaterThanChar', numValues: [8] },
          { type: 'LessThanChar', numValues: [20] },
          {
            type: 'Contains',
            strValues: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            validationMessage: 'The password must contain a number.'
          }
        ],
        confirmPassword: [
          { type: 'Required' },
          {
            type: 'EqualTo',
            numValues: [password],
            validationMessage: 'The passwords must match.'
          }
        ]
      }
      const validationResponse = validateField(
        currentValue,
        (validations as any)[fieldName]
      )
      setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }))
      return validationResponse
    },
    [password]
  )

  const onChangeEmail = (e: { target: { value: string } }) => {
    const value = e.target.value
    if ((errors.email as any)?.hasError) {
      runValidationTasks('email', value)
    }
    setEmail(value)
  }

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

  const onChangeConfirmPassword = (e: { target: { value: string } }) => {
    const value = e.target.value
    if ((errors.confirmPassword as any)?.hasError) {
      runValidationTasks('confirmPassword', value)
    }
    setConfirmPassword(value)
  }

  const onSubmit = React.useCallback(async () => {
    if (confirmingUser) return

    // Check validations before submitting
    runValidationTasks('email', email)
    runValidationTasks('username', username)
    runValidationTasks('password', password)
    runValidationTasks('confirmPassword', confirmPassword)

    const somethingIsAllWhitespace = !/\S/.test(username) || !/\S/.test(password)

    if (
      Object.values(errors).some((e: any) => e?.hasError) ||
      !(email && username && password && confirmPassword) ||
      password !== confirmPassword ||
      somethingIsAllWhitespace
    ) {
      return
    }

    // Submit form

    const modelFields = {
      email,
      password,
      username,
      attributes: {
        email
      }
    }

    try {
      setIsLoading(true)
      // const { user } = await Auth.signUp(modelFields);
      await Auth.signUp(modelFields)
      setConfirmingUser(true)
    } catch (error: any) {
      let errorMessage = 'An error occurred while creating an account.'
      if (error) {
        errorMessage = error.message
        if (error.message === 'User is not confirmed.') {
          setConfirmingUser(true)
        } else if (error.message.includes('existing_email') || error.message.includes('email already exists')) {
          errorMessage = 'An account already exists with this email.'
        } else if (error.message.includes('User already exists')) {
          errorMessage = 'This username is already taken.'
        }
      }
      globals.openAlert(errorMessage, 'error')
    }
    setIsLoading(false)
  }, [
    confirmPassword,
    confirmingUser,
    email,
    errors,
    globals.openAlert,
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
    <PageContainer
      globals={globals}
      title="Create an account"
    >
      <StyledRoot>
        <div className="form-container">
          <FormControl>
            <TextField
              label="Email"
              id="email"
              autoComplete="on"
              size="small"
              className="form-text-input"
              value={email}
              onChange={onChangeEmail}
              onBlur={() => runValidationTasks('email', email)}
              helperText={(errors.email as any)?.errorMessage}
              error={(errors.email as any)?.hasError}
              disabled={confirmingUser}
            />

            <TextField
              label="Username"
              autoComplete="on"
              id="username"
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
              onFocus={() => {
                setSelectedPassword(true)
              }}
              onBlur={() => {
                setSelectedPassword(false)
                runValidationTasks('password', password)
              }}
              helperText={(errors.password as any)?.errorMessage}
              error={(errors.password as any)?.hasError}
              disabled={confirmingUser}
            />

            <Collapse in={selectedPassword}>
              <Alert severity="info" className="form-text-input">
                Your password must have at least 8 characters with at least one
                number.
              </Alert>
            </Collapse>

            <TextField
              label="Confirm Password"
              type="password"
              size="small"
              className="form-text-input"
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
              onBlur={() =>
                runValidationTasks('confirmPassword', confirmPassword)
              }
              helperText={(errors.confirmPassword as any)?.errorMessage}
              error={(errors.confirmPassword as any)?.hasError}
              disabled={confirmingUser}
            />

            <Button
              className="submit-button"
              type="submit"
              variant="contained"
              onClick={onSubmit}
              disabled={disableSubmitButton}
            >
              {isLoading ? <CircularProgress size={20} /> : <>Sign Up</>}
            </Button>
          </FormControl>
        </div>
        <Collapse className="form-container" in={confirmingUser}>
          <ConfirmUserForm
            defaultUsername={defaultUsername}
            defaultPassword={defaultPassword}
            globals={globals}
          />
        </Collapse>
      </StyledRoot>
    </PageContainer>
  )
}

export default SignupPage

import { Alert, Button, CircularProgress, FormControl, TextField } from '@mui/material'
import { API, Auth } from 'aws-amplify'
import { useNavigate } from 'react-router-dom'
import { THEME } from '../../constants/theme'
import type { OpenAlert, UserData } from '../../types'
import { validateField } from '../../utils/user-utils'
import * as React from 'react'

const classes = {
  formContainer: THEME.form.container,
  textInput: THEME.form.input
}

interface Props {
  defaultUsername: string
  defaultPassword: string
  openAlert: OpenAlert
  userData: UserData
}

const ConfirmUserForm = ({
  defaultUsername,
  defaultPassword,
  openAlert,
  userData
}: Props) => {
  const initialValues = {
    verificationCode: ''
  }

  const [verificationCode, setVerificationCode] = React.useState(
    initialValues.verificationCode
  )
  const [errors, setErrors] = React.useState({ hasErrors: false, verificationCode: null })
  const [isFieldSelected, setIsFieldSelected] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const disableSubmitButton = isLoading || Object.values(errors).some((e: any) => e?.hasError)

  const navigate = useNavigate()

  const goToHome = React.useCallback(() => {
    navigate('/')
  }, [navigate])

  const runValidationTasks = React.useCallback(
    (fieldName: string, currentValue: string) => {
      const validations = {
        verificationCode: [{ type: 'Required' }]
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

  const onChangeVerificationCode = (e: { target: { value: string } }) => {
    const value = e.target.value
    if ((errors.verificationCode as any)?.hasError) {
      runValidationTasks('verificationCode', value)
    }
    setVerificationCode(value)
  }

  const onSubmit = React.useCallback(async () => {
    if (!isFieldSelected) return

    runValidationTasks('verificationCode', verificationCode)

    if (Object.values(errors).some((e: any) => e?.hasError) || !verificationCode) {
      return
    }

    try {
      setIsLoading(true)
      await Auth.confirmSignUp(defaultUsername, verificationCode)
      const newUserData = await Auth.signIn(defaultUsername, defaultPassword)

      const { username } = newUserData
      const { email } = newUserData.attributes

      // Send http post to create a new UserInfo entry
      await API.post('mytexas42api', '/userInfo', {
        body: {
          username,
          email
        }
      })

      openAlert('Signed in successfully!', 'success')
      goToHome()
    } catch (error: any) {
      let errorMessage = 'An error occurred while confirming the account.'
      if (error) {
        errorMessage = error.message || error
      }
      openAlert(errorMessage, 'error')
    }
    setIsLoading(false)
  }, [
    defaultPassword,
    defaultUsername,
    errors,
    goToHome,
    isFieldSelected,
    openAlert,
    runValidationTasks,
    verificationCode
  ])

  const onResend = React.useCallback(async () => {
    try {
      await Auth.resendSignUp(defaultUsername)
      openAlert(
        'The verification code has been resent. Remember to check your spam folder.',
        'info'
      )
    } catch (error: any) {
      let errorMessage = 'An error occurred while resending the verification code.'
      if (error) {
        errorMessage = error.message
      }
      openAlert(errorMessage, 'error')
    }
  }, [defaultUsername, openAlert])

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
    <FormControl>
      <Alert severity="info">
        An email was sent to your inbox with a verification code. Please enter
        it below.
      </Alert>

      <TextField
        label="Verification Code"
        id="verification-code"
        autoComplete="on"
        size="small"
        style={classes.textInput}
        value={verificationCode}
        onFocus={() => { setIsFieldSelected(true) }}
        onChange={onChangeVerificationCode}
        helperText={(errors.verificationCode as any)?.errorMessage}
        error={(errors.verificationCode as any)?.hasError}
      />

      <Button
        type="submit"
        disabled={disableSubmitButton}
        onClick={onSubmit}
        style={classes.textInput}
      >
        {isLoading ? <CircularProgress size={20} /> : <>Verify Account</>}
      </Button>

      <Button onClick={onResend} style={classes.textInput}>
        Resend Verification Code
      </Button>
    </FormControl>
  )
}

export default ConfirmUserForm

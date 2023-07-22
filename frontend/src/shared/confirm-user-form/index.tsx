import { Alert, Button, CircularProgress, FormControl, TextField } from '@mui/material'
import { Auth } from 'aws-amplify'
import { useNavigate } from 'react-router-dom'
import type { GlobalObj } from '../../types'
import { validateField } from '../../utils/user-utils'
import * as React from 'react'
import styled from 'styled-components'

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '.form-text-input': {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  '.verify-account-button': {
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
  },
  '.resend-button': {
    width: '100%',
    marginTop: theme.spacing(1),

    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.alt,
    fontSize: theme.spacing(2),
    marginBottom: theme.spacing(1),
    minHeight: theme.isMobile ? theme.spacing(6) : theme.spacing(4),
    '&:hover': {
      backgroundColor: theme.palette.secondary.alt,
      color: theme.palette.primary.main
    },
    borderColor: theme.palette.primary.main,
    border: '1px solid'
  }
}))

interface Props {
  defaultUsername: string
  defaultPassword: string
  globals: GlobalObj
}

const ConfirmUserForm = ({
  defaultUsername,
  defaultPassword,
  globals
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

      await Auth.signIn(defaultUsername, defaultPassword)

      globals.openAlert('Signed in successfully!', 'success')

      goToHome()
    } catch (error: any) {
      let errorMessage = 'An error occurred while confirming the account.'
      if (error) {
        errorMessage = error.message || error
      }
      globals.openAlert(errorMessage, 'error')
    }
    setIsLoading(false)
  }, [
    defaultPassword,
    defaultUsername,
    errors,
    goToHome,
    isFieldSelected,
    globals.openAlert,
    runValidationTasks,
    verificationCode
  ])

  const onResend = React.useCallback(async () => {
    try {
      await Auth.resendSignUp(defaultUsername)
      globals.openAlert(
        'The verification code has been resent. Remember to check your spam folder.',
        'info'
      )
    } catch (error: any) {
      let errorMessage = 'An error occurred while resending the verification code.'
      if (error) {
        errorMessage = error.message
      }
      globals.openAlert(errorMessage, 'error')
    }
  }, [defaultUsername, globals.openAlert])

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
    <StyledFormControl>
      <Alert severity="info">
        An email was sent to your inbox with a verification code. Please enter
        it below.
      </Alert>

      <TextField
        label="Verification Code"
        id="verification-code"
        autoComplete="on"
        size="small"
        className="form-text-input"
        value={verificationCode}
        onFocus={() => {
          setIsFieldSelected(true)
        }}
        onChange={onChangeVerificationCode}
        helperText={(errors.verificationCode as any)?.errorMessage}
        error={(errors.verificationCode as any)?.hasError}
      />

      <Button
        className="verify-account-button"
        type="submit"
        variant="contained"
        disabled={disableSubmitButton}
        onClick={onSubmit}
      >
        {isLoading ? <CircularProgress size={20} /> : <>Verify Account</>}
      </Button>

      <Button
        className="resend-button"
        variant="contained"
        onClick={onResend}
      >
        Resend Verification Code
      </Button>
    </StyledFormControl>
  )
}

export default ConfirmUserForm

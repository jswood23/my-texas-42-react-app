import { FormControl, TextField } from '@mui/material'
import type { OpenAlert, UserData } from '../../types'
import { validateField } from '../../utils/user-utils'
import styled from 'styled-components'
import React from 'react'

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
  onChangeStage: (newStage: string) => void
  openAlert: OpenAlert
  userData: UserData
}

const NewGame = ({ onChangeStage, openAlert, userData }: Props) => {
  const [matchName, setMatchName] = React.useState('')
  const [errors, setErrors] = React.useState({ hasError: false, matchName: null })

  const runValidationTasks = React.useCallback(
    (fieldName: string, currentValue: string) => {
      const validations = {
        matchName: [
          { type: 'Required' },
          { type: 'GreaterThanChar', numValues: [5] }
        ]
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

  const onChangeMatchName = (e: { target: { value: string } }) => {
    const value = e.target.value
    if ((errors.matchName as any)?.hasError) {
      runValidationTasks('matchName', value)
    }
    setMatchName(value)
  }

  return (
    <StyledRoot>
      <div className="form-container">
        <FormControl>
          <TextField
            label="Match Name"
            id="match-name"
            autoComplete="on"
            size="small"
            className="form-text-input"
            value={matchName}
            onChange={onChangeMatchName}
            onBlur={() => runValidationTasks('matchName', matchName)}
            helperText={(errors.matchName as any)?.errorMessage}
            error={(errors.matchName as any)?.hasError}
          />
        </FormControl>
      </div>
    </StyledRoot>
  )
}

export default NewGame

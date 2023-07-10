import { Checkbox, Divider, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import type { OpenAlert, Rule, UserData } from '../../types'
import { RULES } from '../../constants/rules'
import { validateField } from '../../utils/user-utils'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
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
    justifyContent: 'center',
    marginTop: theme.spacing(2)
  },
  '.form-text-input': {
    width: '100%',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  '.rules-container': {
    border: '1px solid #D0D0D0',
    borderRadius: '5px',
    boxShadow: '0 2px 5px 3px #E0E0E0',
    padding: theme.spacing(1)
  },
  '.rules-title-text': {
    color: theme.palette.light.main,
    fontSize: theme.spacing(2),
    fontStyle: 'italic'
  }
}))

interface Props {
  onChangeStage: (newStage: string) => void
  openAlert: OpenAlert
  userData: UserData
}

const NewGame = ({ onChangeStage, openAlert, userData }: Props) => {
  const [matchName, setMatchName] = React.useState('')
  const [privacy, setPrivacy] = React.useState(0)
  const [errors, setErrors] = React.useState({
    hasError: false,
    matchName: null
  })

  const defaultRules: string[] = []
  const defaultExcluded: string[] = []
  const [rules, setRules] = React.useState(defaultRules)
  const [excluded, setExcluded] = React.useState(defaultExcluded)

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

  const onChangePrivacy = (e: SelectChangeEvent) => {
    setPrivacy(+e.target.value)
  }

  const getRule = (ruleName: string) => {
    for (let i = 0; i < RULES.length; i++) {
      if (ruleName === RULES[i].rule_name) {
        return RULES[i]
      }
    }
    return null
  }

  const handleExcludes = () => {
    const newExcluded: string[] = []
    rules.forEach((ruleName: string) => {
      getRule(ruleName)?.excludes.forEach((excludedRule) => {
        if (!newExcluded.includes(excludedRule)) {
          newExcluded.push(excludedRule)
        }
      })
    })
    setExcluded(newExcluded)
  }

  const handleRuleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const thisRule: string = event.target.id
    const newRules: string[] = rules

    // add or remove rule
    const index = newRules.indexOf(thisRule)
    if (index > -1) {
      newRules.splice(index, 1)
    } else {
      newRules.push(thisRule)
    }

    setRules(newRules)

    handleExcludes()
  }

  const displayRuleOptions = () => {
    return RULES.map((rule: Rule) => {
      const isDisabled = excluded.includes(rule.rule_name)
      return (
        <Tooltip
          key={`rule-checkbox-${rule.rule_name}`}
          placement="left"
          title={rule.rule_description}
        >
          <FormControlLabel
            control={
              <Checkbox id={rule.rule_name} onChange={handleRuleChange} />
            }
            disabled={isDisabled}
            label={rule.rule_name}
          />
        </Tooltip>
      )
    })
  }

  return (
    <StyledRoot>
      <div className="form-container">
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
        <FormControl className="form-text-input">
          <InputLabel id="privacy-select-label">Privacy</InputLabel>
          <Select
            label="Privacy"
            id="privacy-select"
            size="small"
            value={privacy.toString()}
            onChange={onChangePrivacy}
          >
            <MenuItem value={0}>Public</MenuItem>
            <MenuItem value={1}>Friends only</MenuItem>
            <MenuItem value={2}>Invite only</MenuItem>
          </Select>
        </FormControl>
        <FormGroup className='rules-container'>
          <Divider>
            <Typography className="rules-title-text">Rules</Typography>
          </Divider>
          {displayRuleOptions()}
        </FormGroup>
      </div>
    </StyledRoot>
  )
}

export default NewGame

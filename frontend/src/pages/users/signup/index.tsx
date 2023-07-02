import { Alert, Box, Collapse, FormControl } from '@mui/material';
import { Auth } from 'aws-amplify';
import { THEME } from '../../../constants/theme';
import { useNavigate } from 'react-router-dom';
import { validateField } from '../../../utils/user-utils';
import * as React from 'react';
import Button from '@mui/material/Button';
import ConfirmUserForm from '../confirm-user-form';
import PageContainer from '../../../shared/page-container';
import * as PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';

const classes = {
  formContainer: THEME.form.container,
  formWindow: THEME.form.window,
  textInput: THEME.form.input
};

const propTypes = {
  openAlert: PropTypes.func,
  userData: PropTypes.object
};

const defaultProps = {
  openAlert: () => {},
  userData: null
};

const SignupPage = ({ openAlert, userData }: any) => {
  const goTo = useNavigate();
  if (userData) {
    goTo('/');
  }

  const initialValues = {
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  };

  const [confirmingUser, setConfirmingUser] = React.useState(false);
  const [email, setEmail] = React.useState(initialValues.email);
  const [username, setUsername] = React.useState(initialValues.username);
  const [password, setPassword] = React.useState(initialValues.password);
  const [selectedPassword, setSelectedPassword] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState(
    initialValues.confirmPassword
  );
  const [errors, setErrors] = React.useState({ hasErrors: false, email: null, username: null, password: null, confirmPassword: null });

  const defaultUsername = username;
  const defaultPassword = password;

  const runValidationTasks = React.useCallback(
    (fieldName: string, currentValue: string) => {
      const validations = {
        email: [{ type: 'Required' }, { type: 'Email' }],
        username: [{ type: 'Required' }],
        password: [
          { type: 'Required' },
          { type: 'GreaterThanChar', numValues: [8] },
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
      };
      const validationResponse = validateField(
        currentValue,
        (validations as any)[fieldName]
      );
      setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
      return validationResponse;
    },
    [password]
  );

  const onChangeEmail = (e: { target: { value: string }}) => {
    const value = e.target.value;
    if ((errors.email as any)?.hasError) {
      runValidationTasks('email', value);
    }
    setEmail(value);
  };

  const onChangeUsername = (e: { target: { value: string }}) => {
    const value = e.target.value;
    if ((errors.username as any)?.hasError) {
      runValidationTasks('username', value);
    }
    setUsername(value);
  };

  const onChangePassword = (e: { target: { value: string }}) => {
    const value = e.target.value;
    if ((errors.password as any)?.hasError) {
      runValidationTasks('password', value);
    }
    setPassword(value);
  };

  const onChangeConfirmPassword = (e: { target: { value: string }}) => {
    const value = e.target.value;
    if ((errors.confirmPassword as any)?.hasError) {
      runValidationTasks('confirmPassword', value);
    }
    setConfirmPassword(value);
  };

  const onSubmit = React.useCallback(async () => {
    if (confirmingUser) return;

    // Check validations before submitting
    runValidationTasks('email', email);
    runValidationTasks('username', username);
    runValidationTasks('password', password);
    runValidationTasks('confirmPassword', confirmPassword);

    if (
      Object.values(errors).some((e: any) => e?.hasError) ||
      !(email && username && password && confirmPassword)
    ) {
      return;
    }

    // Submit form

    const modelFields = {
      email,
      password,
      username,
      attributes: {
        email
      }
    };

    try {
      // const { user } = await Auth.signUp(modelFields);
      await Auth.signUp(modelFields);
      setConfirmingUser(true);
    } catch (error: any) {
      let errorMessage = 'An error occurred while creating an account.';
      if (error) {
        errorMessage = error.message;
        if (error.message === 'User is not confirmed.') {
          setConfirmingUser(true);
        }
      }
      openAlert(errorMessage, 'error');
    }
  }, [
    confirmPassword,
    confirmingUser,
    email,
    errors,
    openAlert,
    password,
    runValidationTasks,
    username
  ]);

  React.useEffect(() => {
    const listener = (event: { code: string, preventDefault: Function }) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();
        onSubmit();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [onSubmit]);

  return (
    <PageContainer openAlert={openAlert} title="Create an account" userData={userData}>
      {/* @ts-ignore */}
      <Box style={classes.formWindow}>
        {/* @ts-ignore */}
        <Box style={classes.formContainer}>
          <FormControl>
            <TextField
              label="Email"
              id="email"
              autoComplete="on"
              autoFocus
              size="small"
              style={classes.textInput}
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
              onFocus={() => setSelectedPassword(true)}
              onBlur={() => {
                setSelectedPassword(false);
                runValidationTasks('password', password);
              }}
              helperText={(errors.password as any)?.errorMessage}
              error={(errors.password as any)?.hasError}
              disabled={confirmingUser}
            />

            <Collapse in={selectedPassword}>
              <Alert severity="info" style={classes.textInput}>
                Your password must have at least 8 characters with at least one
                number.
              </Alert>
            </Collapse>

            <TextField
              label="Confirm Password"
              type="password"
              size="small"
              style={classes.textInput}
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
              type="submit"
              onClick={onSubmit}
              style={classes.textInput}
              disabled={
                confirmingUser || Object.values(errors).some((e: any) => e?.hasError)
              }
            >
              Sign Up
            </Button>
          </FormControl>
        </Box>
        {/* @ts-ignore */}
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
  );
};

SignupPage.propTypes = propTypes;
SignupPage.defaultProps = defaultProps;

export default SignupPage;

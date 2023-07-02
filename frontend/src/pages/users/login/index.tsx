import { Box, Collapse, FormControl } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { THEME } from '../../../constants/theme';
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

const LoginPage = ({ openAlert, userData }: any) => {
  const goTo = useNavigate();
  if (userData) {
    goTo('/');
  }

  const initialValues = {
    username: '',
    password: ''
  };

  const [confirmingUser, setConfirmingUser] = React.useState(false);
  const [username, setUsername] = React.useState(initialValues.username);
  const [password, setPassword] = React.useState(initialValues.password);
  const [errors, setErrors] = React.useState({ hasError: false, username: null, password: null });

  const navigate = useNavigate();
  const defaultUsername = username;
  const defaultPassword = password;

  const goToSignUp = React.useCallback(() => {
    navigate('/signup');
  }, [navigate]);

  const goToHome = React.useCallback(() => {
    navigate('/');
  }, [navigate]);

  const runValidationTasks = React.useCallback(
    (fieldName: string, currentValue: string) => {
      const validations = {
        username: [{ type: 'Required' }],
        password: [{ type: 'Required' }]
      };
      const validationResponse = validateField(
        currentValue,
        (validations as any)[fieldName]
      );
      setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
      return validationResponse;
    },
    []
  );

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

  const onSubmit = React.useCallback(async () => {
    if (confirmingUser) return;

    // Check validations before submitting
    runValidationTasks('username', username);
    runValidationTasks('password', password);

    if (
      Object.values(errors).some((e: any) => e?.hasError) ||
      !(username && password)
    ) {
      return;
    }

    // Submit form
    try {
      // const { user } = await Auth.signUp(modelFields);
      await Auth.signIn(username, password);
      openAlert('Signed in successfully!', 'success');
      goToHome();
    } catch (error: any) {
      let errorMessage = 'An error occurred while signing in.';
      if (error) {
        errorMessage = error.message;
        if (error.message === 'User is not confirmed.') {
          setConfirmingUser(true);
        }
      }
      openAlert(errorMessage, 'error');
    }
  }, [
    confirmingUser,
    errors,
    goToHome,
    openAlert,
    password,
    runValidationTasks,
    username
  ]);

  React.useEffect(() => {
    const listener = (event: { code: string, preventDefault: Function}) => {
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
    <PageContainer openAlert={openAlert} title="Login" userData={userData}>
      {/* @ts-ignore */}
      <Box style={classes.formWindow}>
        {/* @ts-ignore */}
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
              disabled={
                confirmingUser || Object.values(errors).some((e: any) => e?.hasError)
              }
            >
              Login
            </Button>

            <Button onClick={goToSignUp}>Create An Account</Button>
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

LoginPage.propTypes = propTypes;
LoginPage.defaultProps = defaultProps;

export default LoginPage;

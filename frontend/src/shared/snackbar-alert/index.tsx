import * as React from 'react';
import * as PropTypes from 'prop-types';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const propTypes = {
  handleClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  severity: PropTypes.string.isRequired
};

const defaultProps = {
  message: '',
  open: false,
  severity: 'info'
};

const SnackbarAlert = ({ handleClose, message, open, severity }: any) => {
  return open
    ? (
    <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
    >
        <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: '100%' }}
        >
            {message}
        </Alert>
    </Snackbar>
      )
    : (
    <div></div>
      );
};

SnackbarAlert.propTypes = propTypes;
SnackbarAlert.defaultProps = defaultProps;

export default SnackbarAlert;

import * as React from 'react'
import MuiAlert, { type AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert (
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

interface Props {
  handleClose: (event: unknown, reason: string) => void
  message: string
  open: boolean
  severity: string
}

const SnackbarAlert = ({ handleClose, message, open, severity }: Props) => {
  return open
    ? (
    <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
    >
        <Alert
            onClose={(handleClose as any)}
            severity={(severity as any)}
            sx={{ width: '100%' }}
        >
            {message}
        </Alert>
    </Snackbar>
      )
    : (
    <div></div>
      )
}

export default SnackbarAlert

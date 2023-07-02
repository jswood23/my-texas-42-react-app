import { Auth } from 'aws-amplify';
import { Navigate, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { requireLoginPages } from './constants';
import * as React from 'react';
import Navbar from './shared/navbar';
import SnackbarAlert from './shared/snackbar-alert';

const propTypes = {};

const defaultProps = {};

const RouterElements = () => {
    // snackbar alert logic
    const defaultSnackbarData = {
      open: false,
      message: 'Default snackbar message',
      severity: 'info'
    };
    const [snackbarData, setSnackbarData] = React.useState(defaultSnackbarData);
    const handleClose = (event: any, reason: string) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setSnackbarData(defaultSnackbarData);
    };
    const openAlert = (message = '', severity = 'info') => {
      setSnackbarData({
        open: true,
        message,
        severity
      });
    };

    // get user data from amplify auth
    const [userData, setUserData] = React.useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    React.useEffect(() => {
      const getAuthData = async () => {
        try {
          const authData = await Auth.currentAuthenticatedUser();
          setUserData(authData);
        } catch {
          setUserData(null);
          if (requireLoginPages.includes(location.pathname)) {
            openAlert('You need to be signed in to access this page.', 'info');
            navigate('/');
          }
        }
      };
      getAuthData();
    }, [location, navigate]);

    return (
        <div>
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={(<div>Homepage</div>)}
                />
                <Route path="/home" element={<Navigate to="/" />} />
                <Route
                    path="/rules"
                    element={(<div>Rulespage</div>)}
                />
            </Routes>
            <SnackbarAlert
                handleClose={handleClose}
                message={snackbarData.message}
                open={snackbarData.open}
                severity={snackbarData.severity}
            />
        </div>
    );
};

RouterElements.propTypes = propTypes;
RouterElements.defaultProps = defaultProps;

export default RouterElements;

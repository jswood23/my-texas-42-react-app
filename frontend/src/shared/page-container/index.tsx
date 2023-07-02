import { THEME } from '../../constants/theme';
import * as React from 'react';
import Container from '@mui/material/Container';
import * as PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.any,
  openAlert: PropTypes.func,
  title: PropTypes.string,
  userData: PropTypes.object
};

const defaultProps = {
  openAlert: () => {},
  title: '',
  userData: null
};

const PageContainer = ({ children, openAlert, title, userData }: any) => {
  const [pageHeight, setPageHeight] = React.useState(0);

  React.useEffect(() => {
    setPageHeight(window.innerHeight - 140);
  }, []);

  const classes = {
    backdrop: {
      // backgroundColor: THEME.palette.secondary.main,
      backgroundColor: 'white',
      minHeight: pageHeight,
      width: '100%',
      marginTop: THEME.spacing(2),
      padding: THEME.spacing(2),

      border: '1px solid #A0A0A0',
      borderRadius: '5px',
      boxShadow: '0 2px 5px 3px #E0E0E0'
    }
  };

  return (
    <Container fixed style={classes.backdrop}>
        <h1>{title}</h1>
        <hr />
        {children}
    </Container>
  );
};

PageContainer.propTypes = propTypes;
PageContainer.defaultProps = defaultProps;

export default PageContainer;

import PageContainer from '../../shared/page-container';
import * as PropTypes from 'prop-types';

const propTypes = {
  openAlert: PropTypes.func,
  userData: PropTypes.object
};

const defaultProps = {
  openAlert: () => {},
  userData: null
};

const Homepage = ({ openAlert, userData }: any) => (
  <PageContainer openAlert={openAlert} title="Home" userData={userData}>
    <p>Home page stuff</p>
  </PageContainer>
);

Homepage.propTypes = propTypes;
Homepage.defaultProps = defaultProps;

export default Homepage;

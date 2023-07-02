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

const Rulespage = ({ openAlert, userData }: any) => (
  <PageContainer openAlert={openAlert} title="Rules" userData={userData}>
    <p>Rules page stuff</p>
  </PageContainer>
);

Rulespage.propTypes = propTypes;
Rulespage.defaultProps = defaultProps;

export default Rulespage;

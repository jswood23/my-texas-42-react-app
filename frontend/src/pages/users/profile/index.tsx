import { useLocation } from 'react-router-dom';
import PageContainer from '../../../shared/page-container';
import * as PropTypes from 'prop-types';
import queryString from 'query-string';

const propTypes = {
  openAlert: PropTypes.func,
  userData: PropTypes.object
};

const defaultProps = {
  openAlert: () => {},
  userData: null
};

const ProfilePage = ({ openAlert, userData }: any) => {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);

  return (
    <PageContainer openAlert={openAlert} title="My Profile" userData={userData}>
      <p>
        Username: {queryParams.username}
      </p>
    </PageContainer>
  );
};

ProfilePage.propTypes = propTypes;
ProfilePage.defaultProps = defaultProps;

export default ProfilePage;

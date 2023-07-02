import type { OpenAlert, UserData } from '../../../types'
import { useLocation } from 'react-router-dom'
import PageContainer from '../../../shared/page-container'
import queryString from 'query-string'

interface Props {
  openAlert: OpenAlert
  userData: UserData
}

const ProfilePage = ({ openAlert, userData }: Props) => {
  const location = useLocation()
  const queryParams = queryString.parse(location.search)

  return (
    <PageContainer openAlert={openAlert} title="My Profile" userData={userData}>
      <p>
        Username: {queryParams.username}
      </p>
    </PageContainer>
  )
}

export default ProfilePage

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
  const username: string = (queryParams.username as string) ?? ''
  const pageHeader = username.length ? `${username}'s Profile` : 'User not found'

  return (
    <PageContainer openAlert={openAlert} title={pageHeader} userData={userData}>
    </PageContainer>
  )
}

export default ProfilePage

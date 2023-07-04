import { API } from 'aws-amplify'
import { apiContext, defaultProfileData } from '../../../constants'
import type { OpenAlert, UserData } from '../../../types'
import { useLocation } from 'react-router-dom'
import PageContainer from '../../../shared/page-container'
import queryString from 'query-string'
import * as React from 'react'

interface Props {
  openAlert: OpenAlert
  userData: UserData
}

const ProfilePage = ({ openAlert, userData }: Props) => {
  const location = useLocation()
  const queryParams = queryString.parse(location.search)

  const [isError, setIsError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [profileData, setProfileData] = React.useState(defaultProfileData)
  const [username, setUsername] = React.useState((queryParams.username as string) ?? '')

  const pageHeader = username.length ? `${username}'s Profile` : 'User not found'

  React.useEffect(() => {
    const getProfileData = async () => {
      setIsError(false)
      setIsLoading(true)
      await API.get(apiContext, `/users/${username}`, {})
        .then((response) => {
          setProfileData(response)
        }).catch((error) => {
          console.log(error)

          setIsError(true)
          setUsername('')

          openAlert('There was an error getting the profile.', 'error')
        })
      setIsLoading(false)
    }
    getProfileData()
  }, [location])

  return isError
    ? (
        <PageContainer title={pageHeader} openAlert={openAlert} userData={userData} />
      )
    : (
        <PageContainer isLoading={isLoading} title={pageHeader} openAlert={openAlert} userData={userData}>
          {profileData.games_played}
        </PageContainer>
      )
}

export default ProfilePage

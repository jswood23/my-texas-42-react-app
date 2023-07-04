import { API } from 'aws-amplify'
import { apiContext, defaultProfileData } from '../../../constants'
import type { OpenAlert, UserData } from '../../../types'
import { useLocation } from 'react-router-dom'
import PageContainer from '../../../shared/page-container'
import ProfileStats from '../../../shared/profile-stats'
import queryString from 'query-string'
import * as React from 'react'
import ProfileFriends from '../../../shared/profile-friends'

interface Props {
  openAlert: OpenAlert
  userData: UserData
}

const ProfilePage = ({ openAlert, userData }: Props) => {
  const location = useLocation()
  const queryParams = queryString.parse(location.search)
  const queryUsername = (queryParams.username as string) ?? ''

  const [isError, setIsError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [profileData, setProfileData] = React.useState(defaultProfileData)
  const [username, setUsername] = React.useState(queryUsername)

  const pageHeader = username.length ? `${username}'s Profile` : 'User not found'
  const isOwnProfile = username === userData.username

  React.useEffect(() => {
    const getProfileData = async () => {
      setUsername(queryUsername)
      setIsError(false)
      setIsLoading(true)
      await API.get(apiContext, `/users/${queryUsername}`, {})
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
    if (queryUsername) getProfileData()
    else setIsError(true)
  }, [location])

  return isError
    ? (
        <PageContainer title={pageHeader} openAlert={openAlert} userData={userData} />
      )
    : (
        <PageContainer isLoading={isLoading} title={pageHeader} openAlert={openAlert} userData={userData}>
          <ProfileStats profileData={profileData} />
          {isOwnProfile &&
            <ProfileFriends profileData={profileData} />
          }
        </PageContainer>
      )
}

export default ProfilePage

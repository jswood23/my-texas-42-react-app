import { API } from 'aws-amplify'
import { apiContext, defaultProfileData } from '../../../constants'
import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { Cancel, GroupAdd, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { limitString } from '../../../utils/string-utils'
import type { OpenAlert, UserData } from '../../../types'
import { useLocation } from 'react-router-dom'
import PageContainer from '../../../shared/page-container'
import ProfileStats from './profile-stats'
import queryString from 'query-string'
import * as React from 'react'
import ProfileFriends from './profile-friends'
import styled from 'styled-components'

interface Props {
  openAlert: OpenAlert
  userData: UserData
}

const StyledPageElements = styled.div(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: '100%'
}))

const StyledRoot = styled(Button)(({ theme }) => ({
  '.profile-friend-actions-button': {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.alt,
    fontWeight: 'bold',
    '&:hover': {
      color: theme.palette.secondary.alt,
      backgroundColor: theme.palette.primary.main
    }
  }
}))

const ProfilePage = ({ openAlert, userData }: Props) => {
  const location = useLocation()
  const queryParams = queryString.parse(location.search)
  const queryUsername = (queryParams.username as string) ?? ''

  const [anchorEl, setAnchorEl] = React.useState(null)
  const isDropdownOpen = Boolean(anchorEl)
  const [isError, setIsError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [profileData, setProfileData] = React.useState(defaultProfileData)
  const [username, setUsername] = React.useState(queryUsername)

  const pageHeader = username.length ? `${limitString(username, 25)}'s Profile` : 'User not found'
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

  const getProfileFriendAction = () => {
    const isFriends = profileData?.friends?.includes(userData?.username)
    const isRequested = profileData?.incoming_friend_requests?.includes(userData?.username)

    const handleCloseDropdown = React.useCallback(() => {
      setAnchorEl(null)
    }, [setAnchorEl])

    const handleOpenDropdown = (event: any) => {
      setAnchorEl(event.currentTarget)
    }

    const handleClickAddFriend = async () => {
      handleCloseDropdown()
      await API.get(apiContext, `/friends/send_request/${username}`, {})
        .then(() => {
          openAlert(`Sent friend request to ${username}.`, 'success')
        }).catch((error) => {
          console.log(error)
          openAlert('There was an error sending the friend request.', 'error')
        })
    }

    const handleClickCancelRequest = async () => {
      handleCloseDropdown()
      await API.get(apiContext, `/friends/cancel_request/${username}`, {})
        .then(() => {
          openAlert(`Canceled friend request to ${username}.`, 'success')
        }).catch((error) => {
          console.log(error)
          openAlert('There was an error canceling the friend request.', 'error')
        })
    }

    const handleClickRemoveFriend = async () => {
      handleCloseDropdown()
      await API.get(apiContext, `/friends/remove_friend/${username}`, {})
        .then(() => {
          openAlert(`Removed ${username} from friend list.`, 'success')
        }).catch((error) => {
          console.log(error)
          openAlert('There was an error removing this friend.', 'error')
        })
    }

    return (isOwnProfile || isLoading)
      ? <></>
      : (
      <StyledRoot>
        <Button
          className='profile-friend-actions-button'
          variant='contained'
          onClick={handleOpenDropdown}
          endIcon={
            isDropdownOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />
          }
        >
          {isFriends ? <>Friend</> : isRequested ? <>Friend request sent</> : <>Not friends</>}
        </Button>
        <Menu
          id="friends-actions-dropdown-container"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={isDropdownOpen}
          onClose={handleCloseDropdown}
        >
          {isFriends &&
            <MenuItem onClick={handleClickRemoveFriend} disableRipple>
              <ListItemIcon>
                <Cancel fontSize="small" />
              </ListItemIcon>
              <ListItemText>Remove friend</ListItemText>
            </MenuItem>
          }
          {!isFriends && !isRequested &&
            <MenuItem onClick={handleClickAddFriend} disableRipple>
              <ListItemIcon>
                <GroupAdd fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add friend</ListItemText>
            </MenuItem>
          }
          {!isFriends && isRequested &&
            <MenuItem onClick={handleClickCancelRequest} disableRipple>
              <ListItemIcon>
                <Cancel fontSize="small" />
              </ListItemIcon>
              <ListItemText>Cancel friend Request</ListItemText>
            </MenuItem>
          }
        </Menu>
      </StyledRoot>
        )
  }

  return isError
    ? (
    <PageContainer
      title={pageHeader}
      openAlert={openAlert}
      userData={userData}
    />
      )
    : (
    <PageContainer
      action={getProfileFriendAction()}
      isLoading={isLoading}
      title={pageHeader}
      openAlert={openAlert}
      userData={userData}
    >
      <StyledPageElements>
        <ProfileStats profileData={profileData} />
        {isOwnProfile && (
          <ProfileFriends
            openAlert={openAlert}
            profileData={profileData}
            userData={userData}
          />
        )}
      </StyledPageElements>
    </PageContainer>
      )
}

export default ProfilePage

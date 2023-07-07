import { API } from 'aws-amplify'
import { apiContext } from '../../../constants'
import { Button, CircularProgress, IconButton, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import { Cancel, CheckCircle } from '@mui/icons-material'
import { limitString } from '../../../utils/string-utils'
import type { OpenAlert, ProfileData, UserData } from '../../../types'
import * as React from 'react'
import styled from 'styled-components'

const StyledRoot = styled.div(({ theme }) => ({
  display: 'flex',
  border: '0.5px solid #B0B0B0',
  borderRadius: '3px',
  boxShadow: '0 2px 5px 2px #E0E0E0',
  flexDirection: theme.isMobile ? 'column' : 'row',
  width: '100%',
  '.user-container': {
    height: '400px'
  },
  '.user-link': {
    textDecoration: 'none'
  },
  '.friend-requests': {
    borderLeft: theme.isMobile ? '0' : '0.5px solid #B0B0B0',
    borderTop: theme.isMobile ? '0.5px solid #B0B0B0' : 0
  },
  '.item-align-left': {
    display: 'flex',
    justifyContent: 'flex-start',
    flexBasis: '50%'
  },
  '.item-align-right': {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexBasis: '50%'
  },
  '.table-cell-multiple-items': {
    display: 'flex',
    width: '100%'
  },
  '.text-vertically-centered': {
    alignSelf: 'center'
  },
  '.friend-text-field': {
    fontSize: theme.spacing(1.5)
  },
  '.add-friend-button': {
    border: '0.5px solid',
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    backgroundColor: '#FFFFFF',
    fontSize: theme.spacing(1.5),
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    },
    minHeight: theme.isMobile ? theme.spacing(6) : theme.spacing(4),
    minWidth: theme.spacing(13)
  },
  '.green-button': {
    color: '#2EEE2E'
  },
  '.red-button': {
    color: '#FF2E2E'
  }
}))

interface Props {
  openAlert: OpenAlert
  profileData: ProfileData
  userData: UserData
}

const ProfileFriends = ({ openAlert, profileData, userData }: Props) => {
  const [friends, setFriends] = React.useState(profileData.friends)
  const numFriends = friends?.length
  const [friendsFilter, setFriendsFilter] = React.useState('')
  const filterMessage = friendsFilter ? `Filtered by '${limitString(friendsFilter, 18)}'` : 'Showing all friends'

  const [requests, setRequests] = React.useState(profileData.incoming_friend_requests)
  const numRequests = requests?.length
  const [addFriendUsername, setAddFriendUsername] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    setFriends(profileData.friends)
    setRequests(profileData.incoming_friend_requests)
  }, [profileData])

  const onChangeFriendsFilter = (e: { target: { value: string } }) => { setFriendsFilter(e.target.value) }

  const onChangeAddFriend = (e: { target: { value: string } }) => { setAddFriendUsername(e.target.value) }

  const onClickAcceptRequest = async (friendUsername: string) => {
    await API.get(apiContext, `/friends/accept_request/${friendUsername}`, {})
      .then(() => {
        openAlert(`Now friends with ${friendUsername}.`, 'success')
        friends?.push(friendUsername)
        requests?.splice(requests?.indexOf(friendUsername), 1)
      }).catch((error) => {
        console.log(error)
        openAlert('There was an error accepting the friend request.', 'error')
      })
  }

  const onClickRejectRequest = async (friendUsername: string) => {
    await API.get(apiContext, `/friends/reject_request/${friendUsername}`, {})
      .then(() => {
        openAlert(`Rejected friend request from ${friendUsername}.`, 'success')
        requests?.splice(requests?.indexOf(friendUsername), 1)
      }).catch((error) => {
        console.log(error)
        openAlert('There was an error rejecting the friend request.', 'error')
      })
  }

  const onClickAddFriend = async () => {
    if (!addFriendUsername) {
      openAlert('Please specify a username.', 'error')
      return
    }

    setIsLoading(true)
    await API.get(apiContext, `/friends/send_request/${addFriendUsername}`, {})
      .then(() => {
        openAlert(`Sent friend request to ${addFriendUsername}.`, 'success')
        setAddFriendUsername('')
      }).catch((error) => {
        console.log(error)
        openAlert('There was an error sending the friend request.', 'error')
      })

    setIsLoading(false)
  }

  const onClickRemoveFriend = async (friendUsername: string) => {
    await API.get(apiContext, `/friends/remove_friend/${friendUsername}`, {})
      .then(() => {
        openAlert(`Removed ${friendUsername} from friend list.`, 'success')
        friends?.splice(friends?.indexOf(friendUsername), 1)
      }).catch((error) => {
        console.log(error)
        openAlert('There was an error removing this friend.', 'error')
      })
  }

  const getUserRow = (username: string, isFriend: boolean) => {
    return (
      <TableRow hover key={`user-${username}`}>
        <TableCell className="table-cell-multiple-items">
          <div className="item-align-left">
            <Typography className="text-vertically-centered">
              <Link
                className="user-link"
                href={`/profile?username=${username}`}
              >
                {username}
              </Link>
            </Typography>
          </div>
          <div className="item-align-right">
            {isFriend && (
              <Tooltip title="Remove friend" placement="left">
                <IconButton onClick={() => { onClickRemoveFriend(username) }}>
                  <Cancel className="red-button" />
                </IconButton>
              </Tooltip>
            )}
            {!isFriend && (
              <>
                <Tooltip title="Accept friend request" placement="left">
                  <IconButton onClick={() => { onClickAcceptRequest(username) }}>
                    <CheckCircle className="green-button" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject friend request" placement="left">
                  <IconButton onClick={() => { onClickRejectRequest(username) }}>
                    <Cancel className="red-button" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    )
  }

  const listFriends = React.useCallback(() => {
    if (!friends?.length) {
      return (
        <TableRow>
          <TableCell>
            No friends, very sad :(
          </TableCell>
        </TableRow>
      )
    }
    return friends?.map((friendUsername) => {
      if (friendUsername.toLowerCase().includes(friendsFilter)) { return getUserRow(friendUsername, true) } else return (<></>)
    })
  }, [friends, friendsFilter])

  const listRequests = () => {
    if (!requests?.length) {
      return (
        <TableRow>
          <TableCell>
            No incoming friend requests.
          </TableCell>
        </TableRow>
      )
    }
    return requests?.map((requestUsername) => getUserRow(requestUsername, false))
  }

  return (
    <StyledRoot>
      <TableContainer className="user-container">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography>Friends ({numFriends})</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="table-cell-multiple-items">
                <div className="item-align-left">
                  <Typography className="text-vertically-centered">
                    {filterMessage}
                  </Typography>
                </div>
                <div className="item-align-right">
                  <TextField
                    className="friend-text-field"
                    label="Filter friends"
                    id="filter-friends-text-field"
                    size="small"
                    onChange={onChangeFriendsFilter}
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{listFriends()}</TableBody>
        </Table>
      </TableContainer>

      <TableContainer className="friend-requests user-container">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography>
                  Incoming Friend Requests ({numRequests})
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="table-cell-multiple-items">
                <div className="item-align-left">
                  <TextField
                    className="friend-text-field"
                    label="Add a friend"
                    id="add-friend-text-field"
                    size="small"
                    value={addFriendUsername}
                    onChange={onChangeAddFriend}
                  />
                </div>
                <div className="item-align-right">
                  <Button
                    className="add-friend-button"
                    variant="contained"
                    disabled={isLoading}
                    onClick={onClickAddFriend}
                  >
                    {isLoading
                      ? (
                      <CircularProgress size={20} />
                        )
                      : (
                      <>Add friend</>
                        )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{listRequests()}</TableBody>
        </Table>
      </TableContainer>
    </StyledRoot>
  )
}

export default ProfileFriends

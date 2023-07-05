// import { TableContainer } from '@mui/material'
import { Button, CircularProgress, IconButton, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { Cancel, CheckCircle } from '@mui/icons-material'
import { isMobile } from 'react-device-detect'
import { limitString } from '../../utils/string-utils'
import type { OpenAlert, ProfileData, UserData } from '../../types'
import * as React from 'react'
import styled from 'styled-components'

const StyledRoot = styled.div(({ theme }) => ({
  display: 'flex',
  border: '0.5px solid #B0B0B0',
  borderRadius: '3px',
  boxShadow: '0 2px 5px 2px #E0E0E0',
  flexDirection: isMobile ? 'column' : 'row',
  '.user-container': {
    height: '400px'
  },
  '.user-link': {
    textDecoration: 'none'
  },
  '.friend-requests': {
    borderLeft: isMobile ? '0' : '0.5px solid #B0B0B0',
    borderTop: isMobile ? '0.5px solid #B0B0B0' : 0
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
    minHeight: isMobile ? theme.spacing(6) : theme.spacing(4),
    minWidth: theme.spacing(13)
  }
}))

interface Props {
  openAlert: OpenAlert
  profileData: ProfileData
  userData: UserData
}

const ProfileFriends = ({ openAlert, profileData, userData }: Props) => {
  const { friends } = profileData
  const numFriends = friends?.length
  const [friendsFilter, setFriendsFilter] = React.useState('')
  const filterMessage = friendsFilter ? `Filtered by '${limitString(friendsFilter, 18)}'` : 'Showing all friends'

  const requests = profileData.incoming_friend_requests
  const numRequests = requests?.length
  const [addFriendUsername, setAddFriendUsername] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const onChangeFriendsFilter = (e: { target: { value: string } }) => { setFriendsFilter(e.target.value) }

  const onChangeAddFriend = (e: { target: { value: string } }) => { setAddFriendUsername(e.target.value) }

  const onClickAddFriend = () => {
    if (!addFriendUsername) {
      openAlert('Please specify a username.', 'error')
      return
    }

    setIsLoading(true)
    // TODO: add api endpoint call here

    openAlert(`Sent friend request to ${addFriendUsername}.`, 'success')
    setAddFriendUsername('')
    // setIsLoading(false)
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
              <IconButton>
                <Cancel />
              </IconButton>
            )}
            {!isFriend && (
              <>
                <IconButton>
                  <CheckCircle />
                </IconButton>
                <IconButton>
                  <Cancel />
                </IconButton>
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

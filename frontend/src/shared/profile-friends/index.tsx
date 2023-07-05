// import { TableContainer } from '@mui/material'
import { Button, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import type { OpenAlert, ProfileData, UserData } from '../../types'
import * as React from 'react'
import styled from 'styled-components'

const StyledRoot = styled.div({
  display: 'flex',
  border: '0.5px solid #B0B0B0',
  borderRadius: '3px',
  boxShadow: '0 2px 5px 2px #E0E0E0',
  '.user-container': {
    maxHeight: '300px',
    minHeight: '150px'
  },
  '.user-link': {
    textDecoration: 'none'
  },
  '.friend-requests': {
    borderLeft: '0.5px solid #B0B0B0'
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
  }
})

interface Props {
  openAlert: OpenAlert
  profileData: ProfileData
  userData: UserData
}

const ProfileFriends = ({ openAlert, profileData, userData }: Props) => {
  const { friends } = profileData
  const numFriends = friends?.length
  const [friendsFilter, setFriendsFilter] = React.useState('')
  const filterMessage = friendsFilter ? `Filtered by '${friendsFilter}'` : 'Showing all friends'

  const requests = profileData.incoming_friend_requests
  const numRequests = requests?.length
  const [addFriendUsername, setAddFriendUsername] = React.useState('')

  const onChangeFriendsFilter = (e: { target: { value: string } }) => { setFriendsFilter(e.target.value) }

  const onChangeAddFriend = (e: { target: { value: string } }) => { setAddFriendUsername(e.target.value) }

  const onClickAddFriend = () => {
    if (!addFriendUsername) {
      openAlert('Please specify a username.', 'error')
      return
    }

    openAlert(`Sent friend request to ${addFriendUsername}.`, 'success')
    setAddFriendUsername('')
  }

  const getUserRow = (username: string, isFriend: boolean) => {
    return (
      <TableRow
        hover
        key={`user-${username}`}
      >
        <TableCell>
          <Link className='user-link' href={`/profile?username=${username}`}>
            {username}
          </Link>
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
                  <Typography className='text-vertically-centered'>
                    {filterMessage}
                  </Typography>
                </div>
                <div className="item-align-right">
                  <TextField
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
                    label="Add a friend"
                    id="add-friend-text-field"
                    size="small"
                    value={addFriendUsername}
                    onChange={onChangeAddFriend}
                  />
                </div>
                <div className="item-align-right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onClickAddFriend}
                  >
                    Add friend
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

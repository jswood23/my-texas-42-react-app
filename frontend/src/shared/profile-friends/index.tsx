// import { TableContainer } from '@mui/material'
import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import type { ProfileData } from '../../types'
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
  }
})

interface Props {
  profileData: ProfileData
}

const ProfileFriends = ({ profileData }: Props) => {
  const { friends } = profileData
  const numFriends = friends?.length
  const [friendsFilter, setFriendsFilter] = React.useState('')

  const requests = profileData.incoming_friend_requests
  const numRequests = requests?.length

  const onChangeFriendsFilter = (e: { target: { value: string } }) => { setFriendsFilter(e.target.value) }

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
              <TableCell>Friends ({numFriends})</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <TextField
                  label="Filter friends"
                  id="filter-friends-text-field"
                  size="small"
                  onChange={onChangeFriendsFilter}
                />
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
              <TableCell>Friend Requests ({numRequests})</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{listRequests()}</TableBody>
        </Table>
      </TableContainer>
    </StyledRoot>
  )
}

export default ProfileFriends

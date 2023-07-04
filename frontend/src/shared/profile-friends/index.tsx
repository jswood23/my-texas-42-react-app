// import { TableContainer } from '@mui/material'
import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import type { ProfileData } from '../../types'

interface Props {
  profileData: ProfileData
}

const ProfileFriends = ({ profileData }: Props) => {
  const { friends } = profileData
  const requests = profileData.incoming_friend_requests

  const getUserRow = (username: string, isFriend: boolean) => {
    return (
      <TableRow hover>
        <TableCell>
          <Link href={`/profile?username=${username}`}>
            {username}
          </Link>
        </TableCell>
      </TableRow>
    )
  }

  console.log(profileData)

  const listFriends = () =>
    friends?.map((friendUsername) => getUserRow(friendUsername, true))

  const listRequests = () =>
    requests?.map((friendUsername) => getUserRow(friendUsername, false))

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Friends</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listFriends()}
          </TableBody>
        </Table>
      </TableContainer>
      <h3>Friend Requests</h3>
      {listRequests()}
    </div>
  )
}

export default ProfileFriends

import type { ProfileData } from '../../types'

interface Props {
  profileData: ProfileData
}

const ProfileFriends = ({ profileData }: Props) => {
  return (
    <div>
        <div>
            <h3>Friends</h3>
        </div>
        <div>
            <h3>Friend Requests</h3>
        </div>
    </div>
  )
}

export default ProfileFriends

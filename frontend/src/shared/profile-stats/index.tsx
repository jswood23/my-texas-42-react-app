import type { ProfileData } from '../../types'

interface Props {
  profileData: ProfileData
}

const ProfileStats = ({ profileData }: Props) => {
  return (
    <div>
        <h2>Game Stats</h2>
        <p>Games Played: {profileData.games_played}</p>
        <p>Games Won: {profileData.games_won}</p>
    </div>
  )
}

export default ProfileStats

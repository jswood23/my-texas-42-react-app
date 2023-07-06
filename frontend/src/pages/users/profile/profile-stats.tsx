import type { ProfileData } from '../../../types'

interface Props {
  profileData: ProfileData
}

const ProfileStats = ({ profileData }: Props) => {
  const getRatio = (numerator: number, denominator: number, perc = false) => {
    if (denominator === 0) return '0.0'
    let ratio = numerator / denominator
    if (perc) ratio *= 100
    return ratio.toFixed(1).toString()
  }

  const getPercentage = (numerator: number, denominator: number) => {
    const perc = getRatio(numerator, denominator, true)
    if (perc === '0.0') return '0.0%'
    return `${perc}%`
  }

  const gameWinRate = getPercentage(profileData.games_won, profileData.games_played)
  const roundWinRate = getPercentage(profileData.rounds_won, profileData.rounds_played)
  const bidderPPR = getRatio(profileData.total_points_as_bidder, profileData.total_rounds_as_bidder)
  const supportPPR = getRatio(profileData.total_points_as_support, profileData.total_rounds_as_support)
  const counterPPR = getRatio(profileData.total_points_as_counter, profileData.total_rounds_as_counter)

  return (
    <div>
        <h2>Game Stats</h2>
        <p>Game win rate: {gameWinRate}</p>
        <p>Round win rate: {roundWinRate}</p>
        <p>Bidder PPR: {bidderPPR}</p>
        <p>Support PPR: {supportPPR}</p>
        <p>Counter PPR: {counterPPR}</p>
    </div>
  )
}

export default ProfileStats

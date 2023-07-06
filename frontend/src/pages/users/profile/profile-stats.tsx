import { Typography } from '@mui/material'
import type { ProfileData } from '../../../types'
import styled from 'styled-components'

const StyledRoot = styled.div(({ theme }) => ({
  border: '1px solid #A0A0A0',
  borderRadius: '5px',
  boxShadow: '0 2px 5px 3px #E0E0E0',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  width: '75%',
  '.stats-title': {
    borderBottom: '1px solid #A0A0A0',
    fontSize: theme.spacing(2.5),
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%'
  }
}))

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
    <StyledRoot>
      <Typography className="stats-title">Game Stats</Typography>
      <p>Game win rate: {gameWinRate}</p>
      <p>Round win rate: {roundWinRate}</p>
      <p>Bidder PPR: {bidderPPR}</p>
      <p>Support PPR: {supportPPR}</p>
      <p>Counter PPR: {counterPPR}</p>
    </StyledRoot>
  )
}

export default ProfileStats

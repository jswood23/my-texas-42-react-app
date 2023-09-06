import { type DominoObj, type GlobalObj } from '../../../../types'
import * as React from 'react'
import Domino from '../../../../shared/domino'
import { getShuffledDominoes, getStartingDominoes } from './utils/determine-domino-locations'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
}

const ShowDominoes = ({ globals, windowHeight, windowWidth }: Props) => {
  const [dealDominoes, setDealDominoes] = React.useState(false)
  const [dominoes, setDominoes] = React.useState([] as DominoObj[])

  React.useEffect(() => {
    if (globals.gameState.current_round_history.length === 0) {
      setDominoes(getShuffledDominoes(windowWidth, windowHeight))
      setDealDominoes(true)
    }
  }, [globals.gameState.current_round_history.length])

  React.useEffect(() => {
    if (dealDominoes) {
      setDominoes(getStartingDominoes(windowWidth, windowHeight))
      setDealDominoes(false)
    }
  }, [dealDominoes, setDealDominoes])

  const displayDominoes = () => {
    let i = 0
    return dominoes.map(domino => {
      i += 1
      return (
      <Domino
        key={`domino-${i}`}
        placement={domino.placement}
        type=''
      />
      )
    })
  }

  return (
    <>
      {displayDominoes()}
    </>
  )
}

export default ShowDominoes

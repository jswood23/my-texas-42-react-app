import { type DominoPlacement, type DominoObj, type GlobalObj } from '../../../../types'
import * as React from 'react'
import Domino from '../../../../shared/domino'
import { defaultDominoObj, getShuffledDominoes, getStartingDominoes } from './utils/determine-domino-locations'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
}

const ShowDominoes = ({ globals, windowHeight, windowWidth }: Props) => {
  const [dealingDominoes, setDealingDominoes] = React.useState(false)
  const [dominoes, setDominoes] = React.useState([] as DominoObj[])
  const [hoveredDomino, setHoveredDomino] = React.useState(-1)

  const startNewRound = React.useCallback(() => {
    setTimeout(() => {
      const newDominoes = getStartingDominoes(windowWidth, windowHeight)

      // show the player's dominoes
      let i = 0
      globals.gameState.player_dominoes.forEach(dominoType => {
        newDominoes[i].type = dominoType
        newDominoes[i].isInPlayerHand = true
        newDominoes[i].isPlayable = true
        i += 1
      })
      setDominoes(newDominoes)

      setTimeout(() => {
        // speed up animations after half a second
        const spedUpDominoes = [...newDominoes]
        spedUpDominoes.forEach(domino => {
          domino.placement.duration = 0.15
        })
        setDominoes(spedUpDominoes)
      }, 500)
    }, 1500)
  }, [setDominoes])

  const changeDomino = React.useCallback((newDomino: DominoObj) => {
    const newDominoes = [...dominoes]
    newDominoes[newDomino.index] = newDomino
    setDominoes(newDominoes)
  }, [dominoes, setDominoes])

  const onHoverDomino = React.useCallback((domino: DominoObj) => {
    if (domino.isPlayable) {
      setHoveredDomino(domino.index)
    }
  }, [setHoveredDomino])

  const onBlurDomino = React.useCallback(() => {
    setHoveredDomino(-1)
  }, [setHoveredDomino])

  React.useEffect(() => {
    if (globals.gameState.current_round_history.length === 0) {
      setDominoes(getShuffledDominoes(windowWidth, windowHeight))
      setDealingDominoes(true)
    }
  }, [globals.gameState.current_round_history.length])

  React.useEffect(() => {
    if (dealingDominoes) {
      startNewRound()
      setDealingDominoes(false)
    }
  }, [dealingDominoes, setDealingDominoes])

  const displayDominoes = () => {
    const hoverSizeMultiplier = 1.2

    // using for loop here instead of .map() to enforce synchronous behavior
    const domElements: any[] = []
    for (let i = 0; i < dominoes.length; i++) {
      const domino = dominoes.at(i) ?? defaultDominoObj
      const dominoKey = `domino-${i}`

      const dominoPlacement: DominoPlacement = { ...domino.placement }

      if (domino.index === hoveredDomino) {
        dominoPlacement.size *= hoverSizeMultiplier
      }

      domElements.push(
      <Domino
        disabled={domino.isDisabled}
        key={dominoKey}
        onBlur={onBlurDomino}
        onHover={() => { onHoverDomino(domino) }}
        placement={dominoPlacement}
        type={domino.type}
      />
      )
    }

    return domElements
  }

  return (
    <>
      {displayDominoes()}
    </>
  )
}

export default ShowDominoes

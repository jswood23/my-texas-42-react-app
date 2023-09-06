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
  const [playerHand, setPlayerHand] = React.useState([] as DominoObj[])
  const [stagedDomino, setStagedDomino] = React.useState<DominoObj | null>(null)

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
      setPlayerHand(newDominoes.slice(0, 7))
      setStagedDomino(null)

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

  // const changeDomino = React.useCallback((newDomino: DominoObj) => {
  //   const newDominoes = [...dominoes]
  //   newDominoes[newDomino.index] = newDomino
  //   setDominoes(newDominoes)
  // }, [dominoes, setDominoes])

  const changeStagedDomino = React.useCallback((domino: DominoObj) => {
    if (domino.isInPlayerHand && domino.isPlayable) {
      const newPlayerHand = playerHand.map(a => ({ ...a }))
      let newStagedDomino = stagedDomino

      let playerHandIndex = -1
      for (let i = 0; i < newPlayerHand.length; i++) {
        if (domino.type === newPlayerHand[i].type) {
          playerHandIndex = i
          break
        }
      }

      if (stagedDomino !== null) {
        if (stagedDomino.type === domino.type) {
          newStagedDomino = null
          newPlayerHand.push(domino)
        } else {
          newPlayerHand.push(stagedDomino)
          newStagedDomino = domino
          newPlayerHand.splice(playerHandIndex, 1)
        }
      } else {
        newStagedDomino = domino
        newPlayerHand.splice(playerHandIndex, 1)
      }

      setPlayerHand(newPlayerHand)
      setStagedDomino(newStagedDomino)
    }
  }, [playerHand, stagedDomino, setPlayerHand, setStagedDomino])

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
        onClick={() => { changeStagedDomino(domino) }}
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

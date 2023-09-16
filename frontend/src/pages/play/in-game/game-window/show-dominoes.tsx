import { defaultDominoObj, getShuffledDominoes, getStartingDominoes, placePlayerHand, showEndOfTrick, showPlayerMove } from './utils/determine-domino-locations'
import { type DominoPlacement, type DominoObj, type GlobalObj } from '../../../../types'
import { getIsCalling, getUserPosition } from './utils/get-game-information'
import { MOVE_TYPES } from '../../../../constants/game-constants'
import * as React from 'react'
import Domino from '../../../../shared/domino'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
  lastMessage: string
}

const ShowDominoes = ({ globals, windowHeight, windowWidth, lastMessage }: Props) => {
  const userPosition = React.useMemo(() => getUserPosition(globals.gameState, globals.userData.username), [globals.gameState.team_1, globals.gameState.team_2, globals.userData.username])
  const isUserTurn = React.useMemo(() => userPosition === globals.gameState.current_player_turn, [userPosition, globals.gameState.current_player_turn])
  const isCalling = React.useMemo(() => getIsCalling(globals.gameState), [globals.gameState.current_round_rules])
  const [dealingDominoes, setDealingDominoes] = React.useState(false)
  const [dominoes, setDominoes] = React.useState([] as DominoObj[])
  const [hoveredDomino, setHoveredDomino] = React.useState(-1)
  const [playerHand, setPlayerHand] = React.useState([] as DominoObj[])
  const [stagedDomino, setStagedDomino] = React.useState<DominoObj | null | undefined>()
  const [otherStagedDominoes, setOtherStagedDominoes] = React.useState([] as DominoObj[])
  const [team1Tricks, setTeam1Tricks] = React.useState(0)
  const [team2Tricks, setTeam2Tricks] = React.useState(0)
  const [isEndOfTrick, setIsEndOfTrick] = React.useState(false)

  const playerDominoSize = 10
  const otherDominoSize = 8
  const trickDominoSize = 4.2

  const startNewRound = React.useCallback(() => {
    setTimeout(() => {
      const newDominoes = getStartingDominoes(windowWidth, windowHeight, playerDominoSize, otherDominoSize)

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

  const moveDomino = React.useCallback((newDomino: DominoObj) => {
    const newDominoes = [...dominoes]
    newDominoes[newDomino.index] = newDomino
    setDominoes(newDominoes)
  }, [dominoes, setDominoes])

  const moveDominoes = React.useCallback((...movedDominoes: DominoObj[]) => {
    const newDominoes = [...dominoes]
    movedDominoes.forEach(newDomino => {
      newDominoes[newDomino.index] = newDomino
    })
    setDominoes(newDominoes)
  }, [dominoes, setDominoes])

  const changeStagedDomino = React.useCallback((domino: DominoObj) => {
    if (domino.isInPlayerHand && domino.isPlayable) {
      const canStageDomino = isUserTurn && !globals.gameState.current_is_bidding && !isCalling
      const newPlayerHand = playerHand.map(a => ({ ...a }))
      let newStagedDomino = stagedDomino
      let playerHandIndex = -1
      for (let i = 0; i < newPlayerHand.length; i++) {
        if (domino.type === newPlayerHand[i].type) {
          playerHandIndex = i
          break
        }
      }

      if (canStageDomino) {
        if (stagedDomino) {
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
      } else {
        if (playerHandIndex) {
          newPlayerHand.splice(playerHandIndex, 1)
          newPlayerHand.unshift(domino)
        }
      }

      setPlayerHand(newPlayerHand)
      setStagedDomino(newStagedDomino)
    }
  }, [isUserTurn, playerHand, stagedDomino, setPlayerHand, setStagedDomino, globals.gameState.current_is_bidding])

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
      setDominoes(getShuffledDominoes(windowWidth, windowHeight, otherDominoSize))
      setDealingDominoes(true)
    } else {
      let shouldShowPlayerMove = false
      let messageToShow = lastMessage
      if (lastMessage.includes('\\')) {
        if (lastMessage.split('\\')[1] === MOVE_TYPES.play) {
          shouldShowPlayerMove = true
        }
      } else if (lastMessage.includes('wins trick')) {
        shouldShowPlayerMove = true
        messageToShow = globals.gameState.current_round_history.at(-2) ?? lastMessage
        setIsEndOfTrick(true)
      }

      if (shouldShowPlayerMove) {
        showPlayerMove(windowWidth, windowHeight, otherDominoSize, dominoes, globals.gameState, moveDomino, messageToShow, userPosition, otherStagedDominoes, setOtherStagedDominoes)
      }
    }
  }, [globals.gameState.current_round_history, lastMessage])

  React.useEffect(() => {
    if (isEndOfTrick) {
      const winningTeam = +lastMessage[5]
      const teamTricks = winningTeam === 1 ? team1Tricks : team2Tricks
      const setTeamTricks = winningTeam === 1 ? setTeam1Tricks : setTeam2Tricks
      setTimeout(
        () => { showEndOfTrick(windowWidth, windowHeight, trickDominoSize, stagedDomino as DominoObj, setStagedDomino, otherStagedDominoes, setOtherStagedDominoes, winningTeam, teamTricks, setTeamTricks, moveDominoes) },
        1000
      )
      setIsEndOfTrick(false)
    }
  }, [globals.gameState.current_round_history, lastMessage, isEndOfTrick])

  React.useEffect(() => {
    if (dealingDominoes) {
      startNewRound()
      setDealingDominoes(false)
    }
  }, [dealingDominoes, setDealingDominoes])

  React.useEffect(() => {
    if (stagedDomino !== undefined) { placePlayerHand(windowWidth, windowHeight, playerDominoSize, otherDominoSize, playerHand, stagedDomino, dominoes, setDominoes) }
  }, [stagedDomino, playerHand])

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

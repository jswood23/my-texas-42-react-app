import type { GameState, DominoObj } from '../../../../../types'
import { getUserPosition } from './get-game-information'
import { pos } from './helpers'

export const defaultDominoObj: DominoObj = {
  belongsToTrick: -1,
  index: -1,
  isInPlayerHand: false,
  isDisabled: false,
  isPlayable: false,
  placement: {
    startingX: 0,
    startingY: 0,
    currentX: 0,
    currentY: 0,
    size: 50,
    rotation: 0,
    duration: 0
  },
  trickWinningTeam: 0,
  type: ''
}

const shuffleList = (oldList: any[]) => {
  const newList = [...oldList]
  for (let i = newList.length - 1; i > 0; i -= 1) {
    const randomIndex: number = Math.floor(Math.random() * (i + 1));

    [newList[i], newList[randomIndex]] = [newList[randomIndex], newList[i]]
  }
  return newList
}

export const getShuffledDominoes = (windowWidth: number, windowHeight: number, dominoSize: number) => {
  const allDominoes: DominoObj[] = []

  for (let i = 0; i < 28; i += 1) {
    const size = dominoSize
    const column = i % 7
    const row = (i - column) / 7
    const spacingX = (size / 2) + (size / 6)
    const spacingY = size + (size / 4)
    const x = 50 + (column * spacingX) - (spacingX * 3)
    const y = 50 + (row * spacingY) - (spacingY * 3 / 2)

    const newDomino: DominoObj = {
      ...defaultDominoObj,
      index: i,
      placement: {
        startingX: pos(x, windowWidth),
        startingY: pos(y, windowHeight),
        currentX: 0,
        currentY: 0,
        size: pos(size, windowWidth),
        rotation: 0,
        duration: 0.5
      }
    }
    allDominoes.push(newDomino)
  }

  return shuffleList(allDominoes)
}

export const getStartingDominoes = (windowWidth: number, windowHeight: number, playerDominoSize: number, otherDominoSize: number) => {
  const allDominoes: DominoObj[] = []

  for (let i = 0; i < 28; i += 1) {
    const thisPlayerPosition = (i - i % 7) / 7
    let size = otherDominoSize
    const j = i % 7

    let x = 0
    let y = 0
    let r = 0

    switch (thisPlayerPosition) {
      case 0:
        size = playerDominoSize
        if (j < 4) {
          x = 50 + (size / 5 * 6) * j - (size / 5 * 6) * 1.5
          y = 75
        } else {
          x = 50 + (size / 5 * 6) * j - (size / 5 * 6) * 5
          y = 75 + size
        }
        r = 90
        break
      case 1:
        x = 15
        y = 40 + (size / 3 * 2) * j
        r = 90
        break
      case 2:
        x = 50 + (size / 3 * 2) * j - (size / 3 * 2) * 3
        y = 25
        r = 0
        break
      case 3:
        x = 85
        y = 40 + (size / 3 * 2) * j
        r = 90
        break
    }

    const newDomino: DominoObj = {
      ...defaultDominoObj,
      index: i,
      placement: {
        startingX: pos(x, windowWidth),
        startingY: pos(y, windowHeight),
        currentX: 0,
        currentY: 0,
        size: pos(size, windowWidth),
        rotation: r,
        duration: 0.5
      }
    }
    allDominoes.push(newDomino)
  }

  return allDominoes
}

export const placePlayerHand = (windowWidth: number, windowHeight: number, playerDominoSize: number, otherDominoSize: number, playerHand: DominoObj[], stagedDomino: DominoObj | null | undefined, dominoes: DominoObj[], setDominoes: (d: DominoObj[]) => void) => {
  const newDominoes = dominoes.map(a => ({ ...a }))

  if (stagedDomino) {
    const d = newDominoes[stagedDomino.index]
    d.placement.startingX = pos(50, windowWidth)
    d.placement.startingY = pos(50 + otherDominoSize * 1.1, windowHeight)
    d.placement.size = pos(otherDominoSize, windowWidth)
    d.placement.rotation = 0
  }

  const dominoesInHand = playerHand.length
  for (let i = 0; i < dominoesInHand; i++) {
    const d = newDominoes[playerHand[i].index]
    const startY = dominoesInHand <= 4 ? 80 : 75
    if (i < 4) {
      const domsOnRow = Math.min(4, dominoesInHand)
      const x = 50 + (playerDominoSize / 5 * 6) * i - (playerDominoSize / 5 * 6) * (domsOnRow - 1) / 2
      d.placement.startingX = pos(x, windowWidth)
      d.placement.startingY = pos(startY, windowHeight)
    } else {
      const domsOnRow = dominoesInHand - 4
      const x = 50 + (playerDominoSize / 5 * 6) * (i - 4) - (playerDominoSize / 5 * 6) * (domsOnRow - 1) / 2
      const y = startY + playerDominoSize
      d.placement.startingX = pos(x, windowWidth)
      d.placement.startingY = pos(y, windowHeight)
    }
    d.placement.size = pos(playerDominoSize, windowWidth)
    d.placement.rotation = 90
  }

  setDominoes(newDominoes)
}

export const showPlayerMove = (
  windowWidth: number,
  windowHeight: number,
  otherDominoSize: number,
  dominoes: DominoObj[],
  gameState: GameState,
  moveDomino: (newDomino: DominoObj) => void,
  lastMessage: string,
  userPosition: number,
  otherStagedDominoes: DominoObj[],
  setOtherStagedDominoes: (newStagedDominoes: DominoObj[]) => void
) => {
  const splitMessage = lastMessage.split('\\')
  const playerPosition = getUserPosition(gameState, splitMessage[0])
  // TODO: figure out why we have to add 5 here instead of 4
  const positionOnScreen = (playerPosition - userPosition + gameState.current_starting_player + 5) % 4
  const stagedPositions = [[0, 1], [-1, 0], [0, -1], [1, 0]]

  if (positionOnScreen > 0) {
    const playerFirstDomino = positionOnScreen * 7
    for (let i = playerFirstDomino + 6; i >= playerFirstDomino; i -= 1) {
      const hasNotBeenPlayed = dominoes[i].trickWinningTeam === 0
      if (hasNotBeenPlayed) {
        const newDomino: DominoObj = { ...dominoes[i] }
        newDomino.type = splitMessage[2]
        newDomino.placement.startingX = pos(50 + stagedPositions[positionOnScreen][0] * otherDominoSize, windowWidth)
        newDomino.placement.startingY = pos(50 + stagedPositions[positionOnScreen][1] * otherDominoSize, windowHeight)
        moveDomino(newDomino)
        setOtherStagedDominoes([...otherStagedDominoes, newDomino])
        break
      }
    }
  }
}

export const showEndOfTrick = (
  windowWidth: number,
  windowHeight: number,
  trickDominoSize: number,
  stagedDomino: DominoObj,
  setStagedDomino: (newStagedDomino: DominoObj | null) => void,
  otherStagedDominoes: DominoObj[],
  setOtherStagedDominoes: (newStagedDominoes: DominoObj[]) => void,
  winningTeam: number,
  teamTricks: number,
  setTeamTricks: (newTeamTricks: number) => void,
  moveDomino: (newDomino: DominoObj) => void
) => {
  const trickXPos = (winningTeam - 1) * 70 + trickDominoSize * teamTricks
  const trickYPos = 20

  const trickDominoes = [stagedDomino, ...otherStagedDominoes]

  const allCount: DominoObj[] = []
  const allNonCount: DominoObj[] = []

  for (let i = 0; i < 4; i += 1) {
    const sides = trickDominoes[i].type.split('-')
    const sideSum = (+sides[0]) + (+sides[1])
    if (sideSum % 5 === 0) {
      allCount.push(trickDominoes[i])
    } else {
      allNonCount.push(trickDominoes[i])
    }
  }

  for (let i = 0; i < allNonCount.length; i += 1) {
    const distance = trickDominoSize * 0.6
    const thisDomino = allNonCount[i]
    const offset = distance * -i
    thisDomino.placement.startingX = pos(trickXPos + distance, windowWidth)
    thisDomino.placement.startingY = pos(trickYPos + offset, windowHeight)
    thisDomino.placement.size = pos(trickDominoSize, windowWidth)
    thisDomino.placement.rotation = 90
    thisDomino.placement.duration = 1
    moveDomino(thisDomino)
  }

  for (let i = 0; i < allCount.length; i += 1) {
    const distance = trickDominoSize * 0.5
    const thisDomino = allCount[i]
    const offset = distance * (allCount.length / 2 - i + 0.7)
    thisDomino.placement.startingX = pos(trickXPos + offset, windowWidth)
    thisDomino.placement.startingY = pos(trickYPos + distance * 1.9, windowHeight)
    thisDomino.placement.size = pos(trickDominoSize, windowWidth)
    thisDomino.placement.rotation = 0
    thisDomino.placement.duration = 1
    moveDomino(thisDomino)
  }

  setStagedDomino(null)
  setOtherStagedDominoes([])
  setTeamTricks(teamTricks + 1)
}

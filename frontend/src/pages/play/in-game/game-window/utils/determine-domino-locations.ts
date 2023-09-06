import { type DominoObj } from '../../../../../types'

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

const pos = (x: number, windowWidth: number) => x / 100 * windowWidth

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

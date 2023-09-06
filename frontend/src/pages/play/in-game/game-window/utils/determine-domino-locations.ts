import { type DominoObj } from '../../../../../types'

const defaultDominoObj: DominoObj = {
  belongsToTrick: -1,
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

export const getShuffledDominoes = (windowWidth: number, windowHeight: number) => {
  const allDominoes: DominoObj[] = []

  for (let i = 0; i < 28; i += 1) {
    const size = 8
    const column = i % 7
    const row = (i - column) / 7
    const spacingX = (size / 2) + (size / 6)
    const spacingY = size + (size / 4)
    const x = 50 + (column * spacingX) - (spacingX * 3)
    const y = 50 + (row * spacingY) - (spacingY * 3 / 2)

    const newDomino: DominoObj = {
      ...defaultDominoObj,
      placement: {
        startingX: x / 100 * windowWidth,
        startingY: y / 100 * windowHeight,
        currentX: 0,
        currentY: 0,
        size: size / 100 * windowWidth,
        rotation: 0,
        duration: 0.75
      }
    }
    allDominoes.push(newDomino)
  }

  return shuffleList(allDominoes)
}

export const getStartingDominoes = (windowWidth: number, windowHeight: number) => {
  const allDominoes: DominoObj[] = []

  for (let i = 0; i < 28; i += 1) {
    const thisPlayerPosition = (i - i % 7) / 7
    let size = 8
    const j = i % 7

    let x = 0
    let y = 0
    let r = 0

    switch (thisPlayerPosition) {
      case 0:
        size = 10
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
      placement: {
        startingX: x / 100 * windowWidth,
        startingY: y / 100 * windowHeight,
        currentX: 0,
        currentY: 0,
        size: size / 100 * windowWidth,
        rotation: r,
        duration: 0.75
      }
    }
    allDominoes.push(newDomino)
  }

  return allDominoes
}

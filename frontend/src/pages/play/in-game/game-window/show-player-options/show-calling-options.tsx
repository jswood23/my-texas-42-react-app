import { type GlobalObj } from '../../../../../types'
import { MOVE_TYPES, RULES } from '../../../../../constants/game-constants'
import { pos } from '../utils/helpers'
import GameButton from '../../../../../shared/game-button'
import * as React from 'react'
import GameSpinner from '../../../../../shared/game-spinner'
import GameNumberPicker from '../../../../../shared/game-number-picker'
import { replaceGameString } from '../utils/get-game-information'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
}

const ShowCallingOptions = ({ globals, windowHeight, windowWidth }: Props) => {
  const [hasCalled, setHasCalled] = React.useState(false)

  const makeCall = (call: string | number) => {
    globals.connection.sendJsonMessage({ action: 'play_turn', data: JSON.stringify({ move: call, moveType: MOVE_TYPES.call }) })
    setHasCalled(true)
  }

  const showOption = (option: number, xpos: number, ypos: number) => {
    const callingOptions = [RULES.FOLLOW_ME, RULES.DOUBLES_TRUMP, RULES.SPLASH, RULES.PLUNGE, RULES.SEVENS, RULES.NIL, RULES.DOUBLES_LOW, RULES.DOUBLES_HIGH, RULES.DOUBLES_OWN_SUIT]
    const callText = callingOptions[option]
    const showText = replaceGameString(callingOptions[option])
    switch (option) {
      case -1:
        // call a trump
        return (
          <GameNumberPicker
            key={`calling-option-${option}`}
            xpos={xpos - pos(9, windowWidth)}
            ypos={ypos - pos(3, windowHeight)}
            width={pos(18, windowWidth)}
            height={pos(6, windowHeight)}
            fontSize={pos(3, windowWidth)}
            onChoose={makeCall}
            min={0}
            max={6}
          />
        )
      default:
        return (
          <GameButton
            key={`calling-option-${option}`}
            xpos={xpos - pos(6, windowWidth)}
            ypos={ypos - pos(3, windowHeight)}
            width={pos(14, windowWidth)}
            height={pos(6, windowHeight)}
            fontSize={pos(2 - showText.length / 35, windowWidth)}
            text={showText}
            onClick={() => { makeCall(callText) }}
          />
        )
    }

    return <></>
  }

  const getOptions = () => {
    const options: number[] = []

    options.push(0)
    options.push(-1)
    options.push(1)
    options.push(2)
    options.push(3)
    options.push(4)

    let i = -1
    const l = options.length
    return options.map(option => {
      i++
      const lastLine = i >= l - l % 3
      const x = lastLine
        ? 30 + (3 - l % 3) * 10 + (i % 3) * 20
        : 30 + (i % 3) * 20
      const y = 65 - Math.floor(i / 3) * 10
      return showOption(option, pos(x, windowWidth), pos(y, windowHeight))
    })
  }

  const showGameSpinner = () => {
    return (
      <>
        <GameSpinner
          xpos={pos(50, windowWidth)}
          ypos={pos(50, windowHeight)}
          size={pos(5, windowWidth)}
        />
      </>
    )
  }

  return (
    <>
      {hasCalled ? showGameSpinner() : getOptions()}
    </>
  )
}

export default ShowCallingOptions

import type { RoundRules, GlobalObj } from '../../../../../types'
import { MOVE_TYPES, RULES } from '../../../../../constants/game-constants'
import { pos } from '../utils/helpers'
import { replaceGameString } from '../utils/get-game-information'
import * as React from 'react'
import GameButton from '../../../../../shared/game-button'
import GameNumberPicker from '../../../../../shared/game-number-picker'
import GameSpinner from '../../../../../shared/game-spinner'

interface Props {
  globals: GlobalObj
  windowHeight: number
  windowWidth: number
}

const ShowCallingOptions = ({ globals, windowHeight, windowWidth }: Props) => {
  const [hasCalled, setHasCalled] = React.useState(false)
  const [isNilSelected, setIsNilSelected] = React.useState(false)
  const suggestedTrump = React.useMemo(() => { return 1 }, [globals.gameState.player_dominoes])

  const makeCall = (call: string | number) => {
    if (call === RULES.NIL) {
      setIsNilSelected(!isNilSelected)
    } else {
      if (typeof call === 'string') {
        const nilBids = [RULES.DOUBLES_LOW, RULES.DOUBLES_HIGH, RULES.DOUBLES_OWN_SUIT]
        if (nilBids.includes(call)) {
          call = RULES.NIL + ' ' + call
        }
      }

      globals.connection.sendJsonMessage({ action: 'play_turn', data: JSON.stringify({ move: call, moveType: MOVE_TYPES.call }) })
      setHasCalled(true)
    }
  }

  const showOption = (option: number, xpos: number, ypos: number) => {
    const nilBids = [RULES.NIL, RULES.DOUBLES_LOW, RULES.DOUBLES_HIGH, RULES.DOUBLES_OWN_SUIT]
    const callingOptions = [RULES.FOLLOW_ME, RULES.DOUBLES_TRUMP, RULES.SPLASH, RULES.PLUNGE, RULES.SEVENS, ...nilBids]
    if (option >= callingOptions.length || option < -1) return <></>
    const callText = callingOptions[option]
    const showText = replaceGameString(callingOptions[option])
    const disableIfNilSelected = isNilSelected && !nilBids.includes(callingOptions[option])
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
            disabled={disableIfNilSelected}
            defaultValue={suggestedTrump}
            onChoose={makeCall}
            min={0}
            max={6}
          />
        )
      default:
        return (
          <GameButton
            key={`calling-option-${option}`}
            xpos={xpos - pos(7.5, windowWidth)}
            ypos={ypos - pos(3, windowHeight)}
            width={pos(15, windowWidth)}
            height={pos(6, windowHeight)}
            fontSize={pos(2 - showText.length / 35, windowWidth)}
            text={showText}
            disabled={disableIfNilSelected}
            onClick={() => { makeCall(callText) }}
          />
        )
    }
  }

  const getNilOptions = () => {
    const options: number[] = []

    if (isNilSelected) {
      options.push(6)
      options.push(7)
      options.push(8)
    }

    let i = -1
    return options.map(option => {
      i++
      const x = 30 + (i % 3) * 20
      const y = 35
      return showOption(option, pos(x, windowWidth), pos(y, windowHeight))
    })
  }

  const getOptions = () => {
    const options: number[] = []
    const roundRules: RoundRules = globals.gameState.current_round_rules as RoundRules
    const gameRules = globals.gameState.rules

    options.push(0) // follow me
    options.push(-1) // numeric trump
    options.push(1) // doubles are trump

    if (roundRules.bid > 42) {
      if (gameRules.includes(RULES.SPLASH) && roundRules.variant === '') { options.push(2) } // splash
      if (gameRules.includes(RULES.PLUNGE) && roundRules.variant === '') { options.push(3) } // plunge
      if (gameRules.includes(RULES.SEVENS)) { options.push(4) } // sevens
    }

    // for (let i = -1; i < 6; i++) options.push(i)

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
      {hasCalled
        ? showGameSpinner()
        : <>
          {getOptions()}
          {getNilOptions()}
        </>
      }
    </>
  )
}

export default ShowCallingOptions

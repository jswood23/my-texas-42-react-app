import type { OpenAlert, UserData } from '../../types'

interface Props {
  onChangeStage: (newStage: string) => void
  openAlert: OpenAlert
  userData: UserData
}

const InGame = ({ onChangeStage, openAlert, userData }: Props) => {
  return <>Play a game here</>
}

export default InGame

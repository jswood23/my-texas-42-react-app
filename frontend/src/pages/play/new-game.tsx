import type { OpenAlert, UserData } from '../../types'

interface Props {
  onChangeStage: (newStage: string) => void
  openAlert: OpenAlert
  userData: UserData
}

const NewGame = ({ onChangeStage, openAlert, userData }: Props) => {
  return <>Create a new game here</>
}

export default NewGame

import type { OpenAlert, UserData } from '../../types'

interface Props {
  onChangeStage: (newStage: string) => void
  openAlert: OpenAlert
  userData: UserData
}

const Lobbies = ({ onChangeStage, openAlert, userData }: Props) => {
  return <>Listing Lobbies here</>
}

export default Lobbies

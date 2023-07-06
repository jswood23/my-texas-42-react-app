import type { OpenAlert, UserData } from '../../types'
import Lobbies from './lobbies'
import PageContainer from '../../shared/page-container'
import * as React from 'react'

interface Props {
  openAlert: OpenAlert
  userData: UserData
}

const PlayPage = ({ openAlert, userData }: Props) => {
  const [stage, setStage] = React.useState('lobbies')
  const pageTitle = stage === 'lobbies'
    ? 'Game Lobbies'
    : stage === 'new-lobby'
      ? 'New Lobby'
      : stage === 'in-game'
        ? 'Texas 42'
        : 'Undefined Stage'

  const onChangeStage = (newStage: string) => {
    setStage(newStage)
  }

  return (
    <PageContainer title={pageTitle} openAlert={openAlert} userData={userData}>
      <Lobbies onChangeStage={onChangeStage} openAlert={openAlert} userData={userData} />
    </PageContainer>
  )
}

export default PlayPage

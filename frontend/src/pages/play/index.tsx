import PageContainer from '../../shared/page-container'
import type { OpenAlert, UserData } from '../../types'

interface Props {
  openAlert: OpenAlert
  userData: UserData
}

const PlayPage = ({ openAlert, userData }: Props) => {
  const pageTitle = 'Game Lobbies'

  return (
    <PageContainer
      title={pageTitle}
      openAlert={openAlert}
      userData={userData}
    ></PageContainer>
  )
}

export default PlayPage

import PageContainer from '../../shared/page-container'
import type { OpenAlert, UserData } from '../../types'

interface Props {
  openAlert: OpenAlert
  userData: UserData
}

const Rulespage = ({ openAlert, userData }: Props) => (
  <PageContainer openAlert={openAlert} title="Rules" userData={userData}>
    <p>Rules page stuff</p>
  </PageContainer>
)

export default Rulespage

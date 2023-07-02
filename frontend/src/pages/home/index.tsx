import PageContainer from '../../shared/page-container'
import type { OpenAlert, UserData } from '../../types'

interface Props {
  openAlert: OpenAlert
  userData: UserData
}

const Homepage = ({ openAlert, userData }: Props) => (
  <PageContainer openAlert={openAlert} title="Home" userData={userData}>
    <p>Home page stuff</p>
  </PageContainer>
)

export default Homepage

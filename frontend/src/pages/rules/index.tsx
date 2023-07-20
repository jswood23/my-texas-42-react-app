import PageContainer from '../../shared/page-container'
import type { GlobalObj } from '../../types'

interface Props {
  globals: GlobalObj
}

const Rulespage = ({ globals }: Props) => (
  <PageContainer openAlert={globals.openAlert} title="Rules" userData={globals.userData}>
    <p>Rules page stuff</p>
  </PageContainer>
)

export default Rulespage

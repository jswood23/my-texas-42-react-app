import PageContainer from '../../shared/page-container'
import type { GlobalObj } from '../../types'

interface Props {
  globals: GlobalObj
}

const Homepage = ({ globals }: Props) => (
  <PageContainer globals={globals} title="Home">
    <p>Home page stuff</p>
  </PageContainer>
)

export default Homepage

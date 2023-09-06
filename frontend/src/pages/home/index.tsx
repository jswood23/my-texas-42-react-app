// import { Box } from '@mui/material'
import type { GlobalObj } from '../../types'
import PageContainer from '../../shared/page-container'
import styled from 'styled-components'
// import WebsiteUnderConstructionImg from '../../images/website-construction-graphic-4.jpg'
// import DominoWindow from '../../shared/test-domino-window'
import GameWindow from '../play/in-game/game-window'
import { Box } from '@mui/material'

interface Props {
  globals: GlobalObj
}

const StyledRoot = styled.div({
  '.under-construction-img': {
    width: '100%'
  }
})

const Homepage = ({ globals }: Props) => (
  <StyledRoot>
    <PageContainer globals={globals} title="Home">
      {/* <Box
        className='under-construction-img'
        component='img'
        src={WebsiteUnderConstructionImg}
        alt='This website is under construction'
      /> */}
      <Box sx={{ display: 'flex' }}>
        <GameWindow globals={globals} />
      </Box>
    </PageContainer>
  </StyledRoot>
)

export default Homepage

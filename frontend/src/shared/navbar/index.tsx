import { AccountCircle, Login, Logout, PersonAdd, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { AppBar, Toolbar, CssBaseline } from '@material-ui/core'
import { Auth } from 'aws-amplify'
import { makeStyles } from '@material-ui/core/styles'
import { NavLink, useNavigate } from 'react-router-dom'
import type { OpenAlert, UserData } from '../../types'
import { THEME } from '../../constants/theme'
import * as React from 'react'
import Button from '@mui/material/Button'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Logo42 from '../../images/42logo.png'
import styled from 'styled-components'

interface Props {
  openAlert: OpenAlert
  userData: UserData
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  padding: 'none',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  '.logo': {
    color: THEME.palette.secondary.main,
    height: THEME.spacing(5),
    width: THEME.spacing(5),
    marginLeft: THEME.spacing(0),
    marginRight: THEME.spacing(2)
  },
  '.nav-bar-link': {
    backgroundColor: THEME.palette.primary.main,
    color: 'white',

    fontSize: THEME.spacing(3),
    textDecoration: 'none',
    userSelect: 'none',

    margin: 'none',
    paddingLeft: THEME.spacing(2),
    paddingRight: THEME.spacing(2),
    paddingTop: THEME.spacing(1.5),
    paddingBottom: THEME.spacing(1.5),
    '&:hover': {
      color: THEME.palette.secondary.main,
      backgroundColor: THEME.palette.primary.alt
    }
  },
  '.left-side': {
    justifyContent: 'left'
  },
  '.right-side': {
    justifyContent: 'right',
    marginLeft: 'auto'
  }
}))

const useStyles = makeStyles({}) // not sure why but all of the navbar styles break when I remove this

const buttonStyle = {
  color: THEME.palette.primary.main,
  backgroundColor: '#FFFFFF',
  borderColor: '#000000',

  '&:hover': {
    backgroundColor: THEME.palette.secondary.main
  },

  fontSize: THEME.spacing(1.5),
  fontWeight: 'bold'
}

const Navbar = ({ openAlert, userData }: Props) => {
  useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const isDropdownOpen = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleCloseDropdown = React.useCallback(() => {
    setAnchorEl(null)
  }, [setAnchorEl])

  const handleClickLogin = React.useCallback(() => {
    handleCloseDropdown()
    navigate('/login')
  }, [handleCloseDropdown, navigate])

  const handleClickSignUp = React.useCallback(() => {
    handleCloseDropdown()
    navigate('/signup')
  }, [handleCloseDropdown, navigate])

  const handleClickProfile = React.useCallback(() => {
    handleCloseDropdown()
    navigate(`/profile?username=${userData?.username}`)
  }, [handleCloseDropdown, navigate, userData?.username])

  const handleOpenDropdown = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClickSignOut = React.useCallback(async () => {
    handleCloseDropdown()
    try {
      await Auth.signOut()
      openAlert('Signed out successfully!', 'success')
      navigate('/')
    } catch (error: any) {
      let errorMessage = 'An error occurred while signing out.'
      if (error) {
        errorMessage = error.message
      }
      openAlert(errorMessage, 'error')
    }
  }, [handleCloseDropdown, openAlert, navigate])

  const navRightSide = () => {
    if (userData.exists) {
      return (
        <Toolbar className={'right-side'}>
          <Button
            id="profile-dropdown-button"
            variant="contained"
            sx={buttonStyle}
            onClick={handleOpenDropdown}
            endIcon={
              isDropdownOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />
            }
          >
            {userData.username}
          </Button>
          <Menu
            id="sign-in-dropdown-container"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={isDropdownOpen}
            onClose={handleCloseDropdown}
          >
            <MenuItem onClick={handleClickProfile} disableRipple>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleClickSignOut} disableRipple>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sign out</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      )
    }
    return (
      <Toolbar className={'right-side'}>
        <Button
          id="sign-in-dropdown-button"
          variant="contained"
          sx={buttonStyle}
          onClick={handleOpenDropdown}
          endIcon={isDropdownOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        >
          Sign in
        </Button>
        <Menu
          id="sign-in-dropdown-container"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={isDropdownOpen}
          onClose={handleCloseDropdown}
        >
          <MenuItem onClick={handleClickLogin} disableRipple>
            <ListItemIcon>
              <Login fontSize="small" />
            </ListItemIcon>
            <ListItemText>Log in with email</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClickSignUp} disableRipple>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create an account</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    )
  }

  return (
    <StyledAppBar position="static">
      <CssBaseline />
      <Toolbar className={'left-side'}>
        <img src={Logo42} alt="logo" className={'logo'} />
        <NavLink to="/" className={'nav-bar-link'}>
          Home
        </NavLink>
        <NavLink to="/rules" className={'nav-bar-link'}>
          Rules
        </NavLink>
      </Toolbar>

      {navRightSide()}
    </StyledAppBar>
  )
}

export default Navbar

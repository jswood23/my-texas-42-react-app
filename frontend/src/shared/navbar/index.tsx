import { AccountCircle, Login, Logout, PersonAdd, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { AppBar, Toolbar, CssBaseline } from '@material-ui/core'
import { Auth } from 'aws-amplify'
import type { GlobalObj } from '../../types'
import { makeStyles } from '@material-ui/core/styles'
import { NavLink, useNavigate } from 'react-router-dom'
import * as React from 'react'
import Button from '@mui/material/Button'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Logo42 from '../../images/42logo.png'
import styled from 'styled-components'

interface Props {
  globals: GlobalObj
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  flexDirection: 'row',
  padding: 'none',
  position: 'fixed',
  top: 0,
  width: '100%',
  '.logo': {
    color: theme.palette.secondary.main,
    height: theme.spacing(5),
    width: theme.spacing(5)
  },
  '.nav-bar-link': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',

    fontSize: theme.spacing(3),
    textDecoration: 'none',
    userSelect: 'none',

    margin: 'none',
    paddingLeft: theme.spacing(theme.isMobile ? 1 : 2),
    paddingRight: theme.spacing(theme.isMobile ? 1 : 2),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    '&:hover': {
      color: theme.isMobile ? 'white' : theme.palette.secondary.main,
      backgroundColor: theme.isMobile ? theme.palette.primary.main : theme.palette.primary.alt
    }
  },
  '.left-side': {
    justifyContent: 'left'
  },
  '.right-side': {
    justifyContent: 'right',
    marginLeft: 'auto'
  },
  '.nav-button': {
    color: theme.palette.primary.main,
    backgroundColor: 'white',
    borderColor: '#000000',

    '&:hover': {
      backgroundColor: theme.isMobile ? 'white' : theme.palette.secondary.main
    },

    fontSize: theme.spacing(1.5),
    fontWeight: 'bold'
  }
}))

const useStyles = makeStyles({}) // not sure why but all of the navbar styles break when I remove this

const Navbar = ({ globals }: Props) => {
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
    navigate(`/profile?username=${globals.userData?.username}`)
  }, [handleCloseDropdown, navigate, globals.userData?.username])

  const handleOpenDropdown = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClickSignOut = React.useCallback(async () => {
    handleCloseDropdown()
    try {
      await Auth.signOut()
      globals.openAlert('Signed out successfully!', 'success')
      navigate('/')
    } catch (error: any) {
      let errorMessage = 'An error occurred while signing out.'
      if (error) {
        errorMessage = error.message
      }
      globals.openAlert(errorMessage, 'error')
    }
  }, [handleCloseDropdown, globals.openAlert, navigate])

  const navRightSide = () => {
    if (globals.userData.exists) {
      return (
        <Toolbar className={'right-side'}>
          <Button
            className="nav-button"
            id="profile-dropdown-button"
            variant="contained"
            onClick={handleOpenDropdown}
            endIcon={
              isDropdownOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />
            }
          >
            {globals.userData.username}
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
          className='nav-button'
          id="sign-in-dropdown-button"
          variant="contained"
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
        {globals.userData.exists &&
          <NavLink to="/play" className={'nav-bar-link'}>
            Play
          </NavLink>
        }
      </Toolbar>

      {navRightSide()}
    </StyledAppBar>
  )
}

export default Navbar

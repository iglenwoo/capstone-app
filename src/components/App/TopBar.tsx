import React, { SyntheticEvent } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { Auth, useAuth } from '../FirebaseAuth/use-auth'
import * as routes from '../../constants/routes'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
)

export const TopBar = () => {
  const auth: Auth = useAuth()

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>{auth.user ? <AuthedButtons /> : <UnAuthedButtons />}</Toolbar>
      </AppBar>
    </div>
  )
}

const AuthedButtons = () => {
  const auth: Auth = useAuth()
  const history = useHistory()

  const handleProfile = (event: SyntheticEvent) => {
    event.preventDefault()
    history.push(routes.PROFILE)
  }
  const handleProjects = (event: SyntheticEvent) => {
    event.preventDefault()
    history.push(routes.PROJECTS)
  }
  const handleMyProjects = (event: SyntheticEvent) => {
    event.preventDefault()
    history.push(routes.MY_PROJECTS)
  }
  const handleSingOut = (event: SyntheticEvent) => {
    event.preventDefault()
    auth.signout()
  }

  const classes = useStyles()

  return (
    <>
      <div className={classes.title}>
        <Button color="inherit" onClick={handleProfile}>
          Profile
        </Button>
        <Button color="inherit" onClick={handleProjects}>
          Projects
        </Button>
        <Button color="inherit" onClick={handleMyProjects}>
          My Projects
        </Button>
      </div>
      <Button color="inherit" onClick={handleSingOut}>
        Sign Out
      </Button>
    </>
  )
}

const UnAuthedButtons = () => {
  const history = useHistory()

  const handleSignUp = (event: SyntheticEvent) => {
    event.preventDefault()
    history.push(routes.SIGN_UP)
  }
  const handleSignIn = (event: SyntheticEvent) => {
    event.preventDefault()
    history.push(routes.SIGN_IN)
  }

  const classes = useStyles()

  return (
    <>
      <Typography variant="h6" className={classes.title}>
        TeamUpShare
      </Typography>
      <Button color="inherit" onClick={handleSignUp}>
        Sign Up
      </Button>
      <Button color="inherit" onClick={handleSignIn}>
        Sign In
      </Button>
    </>
  )
}

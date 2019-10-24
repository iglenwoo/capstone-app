import React, { SyntheticEvent, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { Auth, useAuth } from '../FirebaseAuth/use-auth'
import * as routes from '../../constants/routes'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

export const TopBar = () => {
  const auth: Auth = useAuth()
  const history = useHistory()

  const handleSingOut = (event: SyntheticEvent) => {
    event.preventDefault()
    auth.signout()
  }
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
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {auth.user ? (
            <>
              <div className={classes.title}>
                <Button color="inherit">Profile</Button>
                <Button color="inherit">Projects</Button>
                <Button color="inherit">My Projects</Button>
              </div>
              <Button color="inherit" onClick={handleSingOut}>
                Sign Out
              </Button>
            </>
          ) : (
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
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}

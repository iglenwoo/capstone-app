import * as React from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link as LinkUI,
  TextField,
  Typography,
} from '@material-ui/core'
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import Copyright from '../../components/Copyright'
import { FC } from 'react'
import { useState } from 'react'
import { SyntheticEvent } from 'react'
import { useStyles } from '../../theme'
import { useAuth } from '../../components/FirebaseAuth/use-auth'
import firebase from 'firebase'
import * as routes from '../../constants/routes'

export const SignUp: FC = () => {
  const { firestore, signup } = useAuth()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const newUser: firebase.User | null = await signup(email, password)
    if (!newUser) {
      alert('Sorry, something went wrong. Please try to signup again.')
      return
    }

    firestore
      .collection('users')
      .doc(newUser.uid)
      .set({
        email: newUser.email,
      })

    history.push(routes.MY_PROJECTS)
  }

  const classes = useStyles()

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={e => onSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={e => setEmail(e.currentTarget.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.currentTarget.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <LinkUI
                href="#"
                variant="body2"
                component={Link}
                to={routes.SIGN_IN}
              >
                Already have an account? Sign in
              </LinkUI>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}

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
import * as routes from '../../constants/routes'
import { useEffect } from 'react'
import { validateEmail } from '../../utils'
import { useSnackbar } from 'notistack'

export const SignUp: FC = () => {
  const { firestore, signup } = useAuth()
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<boolean>(true)
  const [password, setPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<boolean>(true)

  useEffect(() => {
    setEmailError(!validateEmail(email))
  }, [email])

  useEffect(() => {
    setPasswordError(password.length < 8)
  }, [password])

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    if (emailError || passwordError) return

    console.log('signup')
    const newUser = signup(email, password)
      .then(user => {
        console.log(user)
        if (user && user.uid && user.email) {
          firestore
            .collection('users')
            .doc(user.uid)
            .set({
              email: user.email,
            })

          history.push(routes.PROFILE)
        }
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' })
      })
    console.log('newUser', newUser)
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
                error={emailError}
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
                error={passwordError}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={emailError || passwordError}
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

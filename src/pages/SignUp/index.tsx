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
import { AccountCircle as AccountCircleIcon } from '@material-ui/icons'
import Copyright from '../../components/Copyright'
import { FC } from 'react'
import { useState } from 'react'
import { SyntheticEvent } from 'react'
import { useStyles } from '../../theme'
import { useAuth } from '../../components/FirebaseAuth/use-auth'
import * as routes from '../../constants/routes'
import { useEffect } from 'react'
import { validateEmail, validateName } from '../../utils'
import { useSnackbar } from 'notistack'

export const SignUp: FC = () => {
  const { firestore, signup } = useAuth()
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const [firstName, setFirstName] = useState<string>('')
  const [firstNameError, setFirstNameError] = useState<boolean>(true)
  const [firstNameHelperText, setFirstNameHelperText] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [lastNameError, setLastNameError] = useState<boolean>(true)
  const [lastNameHelperText, setLastNameHelperText] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<boolean>(true)

  const [password, setPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<boolean>(true)
  const [passwordHelperText, setPasswordHelperText] = useState<string>('')

  useEffect(() => {
    if (validateName(firstName)) {
      setFirstNameError(false)
      setFirstNameHelperText('')
    } else {
      setFirstNameError(true)
      setFirstNameHelperText('Alphabet only')
    }
  }, [firstName])

  useEffect(() => {
    if (validateName(lastName)) {
      setLastNameError(false)
      setLastNameHelperText('')
    } else {
      setLastNameError(true)
      setLastNameHelperText('Alphabet only')
    }
  }, [lastName])

  useEffect(() => {
    setEmailError(!validateEmail(email))
  }, [email])

  useEffect(() => {
    if (password.length < 8) {
      setPasswordError(true)
      setPasswordHelperText('Password must be at least 8 characters')
    } else {
      setPasswordError(false)
      setPasswordHelperText('')
    }
  }, [password])

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    if (firstNameError || lastNameError || emailError || passwordError) return

    signup(email, password)
      .then(user => {
        if (user && user.uid && user.email) {
          firestore
            .collection('users')
            .doc(user.uid)
            .set({
              email: user.email,
              firstName,
              lastName,
            })
            .then(() => {
              history.push(routes.PROFILE)
            })
            .catch(e => {
              enqueueSnackbar(e.message, {
                variant: 'error',
              })
              console.log(e)
            })
        }
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' })
      })
  }

  const classes = useStyles()

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatarSignUp}>
          <AccountCircleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="First Name"
                autoFocus
                value={firstName}
                onChange={e => setFirstName(e.currentTarget.value.trim())}
                error={firstNameError}
                helperText={firstNameHelperText}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={e => setLastName(e.currentTarget.value.trim())}
                error={lastNameError}
                helperText={lastNameHelperText}
              />
            </Grid>
          </Grid>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            placeholder="example@exmaple.com"
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
            error={emailError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
            error={passwordError}
            helperText={passwordHelperText}
          />
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

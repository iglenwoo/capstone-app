import * as React from 'react'
import { FC } from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import { useHistory } from 'react-router'
import { useState } from 'react'
import { SyntheticEvent } from 'react'
import * as routes from '../../constants/routes'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link as LinkUI,
  TextField,
  Typography,
} from '@material-ui/core'
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import { Link, Redirect } from 'react-router-dom'
import Copyright from '../../components/Copyright'
import { AlertDialog } from '../../components/Dialog/AlertDialog'
import { useStyles } from '../../theme'

export const SignIn: FC = () => {
  const auth: Auth = useAuth()
  const history = useHistory()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>()
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const classes = useStyles()

  const onSubmit = (event: SyntheticEvent) => {
    const user = auth.signin(email, password)
    user
      .then(u => {
        setEmail('')
        setPassword('')
        history.push(routes.LANDING)
      })
      .catch(error => {
        setError(error.message)
        setShowDialog(true)
      })

    event.preventDefault()
  }

  const onDialogClose = () => {
    setError('')
    setShowDialog(false)
  }

  if (auth.user) {
    return <Redirect to={routes.PROFILE} />
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={event => onSubmit(event)}
        >
          <TextField
            variant="outlined"
            margin="normal"
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
          <TextField
            variant="outlined"
            margin="normal"
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
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <LinkUI
                href="#"
                variant="body2"
                component={Link}
                to={routes.PASSWORD_FORGET}
              >
                Forgot password?
              </LinkUI>
            </Grid>
            <Grid item>
              <LinkUI
                href="#"
                variant="body2"
                component={Link}
                to={routes.SIGN_UP}
              >
                {"Don't have an account? Sign Up"}
              </LinkUI>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>

      <AlertDialog open={showDialog} message={error} onClose={onDialogClose} />
    </Container>
  )
}

import * as React from 'react'
import { FC, useEffect } from 'react'
import { useAuth } from '../../components/FirebaseAuth/use-auth'
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
import { Link } from 'react-router-dom'
import Copyright from '../../components/Copyright'
import { useStyles } from '../../theme'
import { useSnackbar } from 'notistack'
import { validateEmail } from '../../utils'

export const SignIn: FC = () => {
  const { signin } = useAuth()
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<boolean>(true)
  const [password, setPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<boolean>(true)
  const [passwordHelperText, setPasswordHelperText] = useState<string>('')
  const [shouldPersist, setShouldPersist] = useState<boolean>(false)

  const classes = useStyles()

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
    if (emailError || passwordError) return

    const user = signin(email, password, shouldPersist)
    user
      .then(() => {
        setEmail('')
        setPassword('')
        history.push(routes.PROJECTS)
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' })
      })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatarSignIn}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            placeholder="example@exmaple.com"
            autoFocus
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
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={shouldPersist}
                onChange={() => {
                  setShouldPersist(!shouldPersist)
                }}
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={emailError || passwordError}
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
    </Container>
  )
}
